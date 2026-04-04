import json
import logging
import os
import re
import sqlite3
import unicodedata
from io import BytesIO
from contextlib import closing
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from openai import OpenAI
from openpyxl import Workbook
from openpyxl.styles import Font
from pydantic import BaseModel, ConfigDict, EmailStr, Field
import requests

try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest

    GA4_CLIENT_AVAILABLE = True
except ImportError:
    GA4_CLIENT_AVAILABLE = False


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("ai-portfolio-inbox")
CHAT_WIDGET_SOURCE = "portfolio-chat-widget"


LANGUAGE_STOPWORDS = {
    "es": {"hola", "gracias", "quiero", "necesito", "proyecto", "precio", "colaboracion", "colaboración", "para", "una", "con", "como", "puedes", "sugerencia", "error", "sitio", "mensaje"},
    "en": {"hello", "thanks", "project", "pricing", "budget", "question", "suggestion", "issue", "website", "message", "need", "would", "like", "with", "about", "feature", "collaboration"},
}

PRIORITY_RANK = {"low": 1, "medium": 2, "high": 3}

THEME_RULES = [
    ("ai-automation", "AI automation and assistant builds", {"ai", "automation", "assistant", "agents", "chatbot", "llm", "openai", "copilot", "automatizacion"}),
    ("project-collaboration", "Project collaboration opportunities", {"project", "projects", "hire", "freelance", "contract", "collaboration", "partnership", "consulting", "proyecto", "colaboracion", "colaboración"}),
    ("pricing-budget", "Pricing and budget discussions", {"pricing", "budget", "quote", "cost", "proposal", "price", "precio", "presupuesto", "cotizacion", "cotización"}),
    ("bug-performance", "Bugs and performance issues", {"bug", "broken", "error", "issue", "problem", "slow", "crash", "fix", "fallo", "problema", "lento"}),
    ("analytics-dashboard", "Analytics and dashboard requests", {"analytics", "dashboard", "ga4", "google", "tracking", "reporting", "insights", "metricas", "métricas"}),
    ("content-portfolio", "Portfolio content and case studies", {"portfolio", "case", "study", "content", "copy", "about", "resume", "cv", "portafolio", "contenido"}),
    ("ux-feedback", "Portfolio UX and design feedback", {"feedback", "suggestion", "improve", "design", "ui", "ux", "layout", "experience", "sugerencia", "mejora"}),
    ("api-integration", "API and integration topics", {"api", "integration", "webhook", "backend", "database", "sqlite", "fastapi", "smtp", "integracion", "integración"}),
]

CHAT_PROFILE_FACTS = {
    "en": [
        "Carlos works at the intersection of operations, data, digital workflows, and practical AI.",
        "His profile is corporate and business-oriented, not a pure software engineering or AI engineering profile.",
        "He has experience supporting Purchasing and Aftersales processes in a BMW-related environment, including SAP support, reporting follow-up, incident handling, and coordination.",
        "His background also includes back-office operations, documentation validation, public procurement support, banking operations, and technical support operations.",
        "His projects show practical uses of digital tools, dashboards, structured information, and AI for productivity.",
    ],
    "es": [
        "Carlos trabaja en la interseccion entre operaciones, datos, workflows digitales e IA practica.",
        "Su perfil es corporativo y orientado a negocio, no un perfil puro de software engineering ni de AI engineering.",
        "Tiene experiencia dando soporte a procesos de Purchasing y Aftersales en un entorno vinculado a BMW, incluyendo soporte SAP, seguimiento de reporting, gestion de incidencias y coordinacion.",
        "Su trayectoria tambien incluye back office, validacion documental, soporte a contratacion publica, operaciones bancarias y soporte tecnico-operativo.",
        "Sus proyectos muestran usos practicos de herramientas digitales, dashboards, informacion estructurada e IA para productividad.",
    ],
}


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def iso_days_ago(days: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(days=days)).date().isoformat()


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "general"


def parse_json_list(raw: Any, fallback: list[str] | None = None) -> list[str]:
    if isinstance(raw, list):
        return [str(item) for item in raw]
    if not raw:
        return fallback or []
    try:
        parsed = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return fallback or []
    if isinstance(parsed, list):
        return [str(item) for item in parsed]
    return fallback or []


def normalize_list(values: list[str], limit: int = 6) -> list[str]:
    cleaned: list[str] = []
    seen: set[str] = set()
    for value in values:
        text = re.sub(r"\s+", " ", str(value)).strip()
        if text and text.lower() not in seen:
            seen.add(text.lower())
            cleaned.append(text)
    return cleaned[:limit]


def tokenize(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-zA-Záéíóúñü0-9]{3,}", text.lower())
        if token not in {"this", "that", "with", "from", "have", "your", "about", "would", "para", "como", "esto", "esta", "este"}
    }


def detect_language(text: str) -> str:
    tokens = tokenize(text)
    es_score = len(tokens & LANGUAGE_STOPWORDS["es"])
    en_score = len(tokens & LANGUAGE_STOPWORDS["en"])
    if re.search(r"[ñáéíóú]", text.lower()):
        es_score += 2
    return "es" if es_score > en_score else "en"


def normalize_match_text(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text or "")
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", ascii_text).strip().lower()


def language_scores(text: str) -> tuple[int, int]:
    normalized = normalize_match_text(text)
    if not normalized:
        return 0, 0

    tokens = set(re.findall(r"[a-z0-9]{2,}", normalized))
    es_terms = {
        "hola", "gracias", "quiero", "necesito", "puedes", "podrias", "perfil", "resumen", "proyectos",
        "experiencia", "contacto", "contactar", "encaje", "operaciones", "proceso", "procesos",
        "datos", "mostrar", "muestrame", "como", "por", "que", "hablame", "cuentame", "espanol",
        "ahora", "sigue", "seguimos", "mas", "relevantes", "rol", "roles",
    }
    en_terms = {
        "hello", "thanks", "want", "need", "can", "could", "profile", "summary", "projects",
        "experience", "contact", "fit", "operations", "process", "processes", "data", "show",
        "about", "why", "how", "english", "continue", "relevant", "role", "roles", "please",
    }
    es_score = len(tokens & es_terms)
    en_score = len(tokens & en_terms)

    if any(marker in normalized for marker in {" que ", " como ", " para ", " con ", " el ", " la ", " los ", " las "}):
        es_score += 1
    if any(marker in normalized for marker in {" the ", " and ", " with ", " for ", " his ", " her ", " role ", " roles "}):
        en_score += 1
    if re.search(r"[¿¡]", text):
        es_score += 2
    if re.search(r"[áéíóúñÁÉÍÓÚÑ]", text):
        es_score += 2

    return es_score, en_score


def explicit_chat_language(normalized_text: str) -> str | None:
    english_switches = {
        "answer in english", "respond in english", "reply in english", "continue in english",
        "can you continue in english", "speak in english", "english please", "en ingles",
        "puedes seguir en ingles", "ahora en ingles", "respondeme en ingles",
    }
    spanish_switches = {
        "answer in spanish", "respond in spanish", "reply in spanish", "continue in spanish",
        "can you continue in spanish", "speak in spanish", "spanish please", "en espanol",
        "respondeme en espanol", "ahora en espanol", "puedes seguir en espanol",
    }
    if any(term in normalized_text for term in english_switches):
        return "en"
    if any(term in normalized_text for term in spanish_switches):
        return "es"
    return None


def detect_language_from_history(messages: list[dict[str, str]] | None) -> str | None:
    if not messages:
        return None

    recent_user_messages = [
        item.get("content", "").strip()
        for item in reversed(messages[-6:])
        if item.get("role") == "user" and item.get("content")
    ]
    if not recent_user_messages:
        return None

    es_total = 0
    en_total = 0
    for content in recent_user_messages[:3]:
        normalized = normalize_match_text(content)
        explicit = explicit_chat_language(normalized)
        if explicit:
            return explicit
        es_score, en_score = language_scores(content)
        es_total += es_score
        en_total += en_score

    if es_total == en_total:
        return None
    return "es" if es_total > en_total else "en"


def resolve_chat_language(submission: "InboxSubmission") -> str:
    normalized_message = normalize_match_text(submission.message)
    explicit = explicit_chat_language(normalized_message)
    if explicit:
        return explicit

    current_es, current_en = language_scores(submission.message)
    if current_es != current_en and max(current_es, current_en) >= 1:
        return "es" if current_es > current_en else "en"

    history_language = detect_language_from_history(submission.messages)
    if history_language:
        return history_language

    if submission.locale in {"es", "en"}:
        return submission.locale

    return detect_language(submission.message)


@dataclass
class Settings:
    database_path: Path
    openai_api_key: str
    openai_model: str
    resend_api_key: str
    resend_from_email: str
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    smtp_use_tls: bool
    email_from: str
    owner_email: str
    app_base_url: str
    ai_match_threshold: float
    ga4_property_id: str
    google_application_credentials: str


def parse_bool_env(value: str, default: bool = False) -> bool:
    normalized = (value or "").strip().lower()
    if not normalized:
        return default
    return normalized in {"1", "true", "yes", "on"}


def parse_int_env(name: str, default: int) -> int:
    raw = os.getenv(name, str(default)).strip()
    try:
        return int(raw)
    except ValueError:
        logger.warning("Invalid integer for %s=%r. Falling back to %s.", name, raw, default)
        return default


def load_settings() -> Settings:
    owner_email = os.getenv("OWNER_EMAIL", "c.sanmiguelortega@gmail.com").strip()
    smtp_username = os.getenv("SMTP_USERNAME", "").strip()
    email_from = os.getenv("EMAIL_FROM", "").strip() or smtp_username
    resend_from_email = os.getenv("RESEND_FROM_EMAIL", "").strip() or email_from
    return Settings(
        database_path=BASE_DIR / os.getenv("DATABASE_PATH", "ai_portfolio_inbox.db"),
        openai_api_key=os.getenv("OPENAI_API_KEY", "").strip(),
        openai_model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini").strip(),
        resend_api_key=os.getenv("RESEND_API_KEY", "").strip(),
        resend_from_email=resend_from_email,
        smtp_host=os.getenv("SMTP_HOST", "").strip(),
        smtp_port=parse_int_env("SMTP_PORT", 587),
        smtp_username=smtp_username,
        smtp_password=os.getenv("SMTP_PASSWORD", "").strip(),
        smtp_use_tls=parse_bool_env(os.getenv("SMTP_USE_TLS", "true"), default=True),
        email_from=email_from,
        owner_email=os.getenv("OWNER_EMAIL", owner_email).strip() or owner_email,
        app_base_url=os.getenv("APP_BASE_URL", "http://127.0.0.1:8000").strip(),
        ai_match_threshold=float(os.getenv("AI_MATCH_THRESHOLD", "0.33")),
        ga4_property_id=os.getenv("GA4_PROPERTY_ID", "").strip(),
        google_application_credentials=os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "").strip(),
    )


settings = load_settings()

# Gmail SMTP recommended configuration:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USE_TLS=true
# SMTP_USERNAME=mi_correo_gmail
# SMTP_PASSWORD=app_password_de_google
# EMAIL_FROM=mi_correo_gmail
# RESEND_API_KEY=re_xxx
# RESEND_FROM_EMAIL=Portfolio Inbox <onboarding@resend.dev>
# OWNER_EMAIL=mi_correo_personal_destino

cors_debug_all_origins = os.getenv("CORS_DEBUG_ALL_ORIGINS", "").strip().lower() in {"1", "true", "yes", "on"}

if cors_debug_all_origins:
    # Temporary debug mode only. This disables credentials so wildcard origins are valid.
    cors_allow_origins = ["*"]
    cors_allow_credentials = False
else:
    cors_allow_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://portfolio-khaki-zeta-3frz86na3s.vercel.app",
    ]
    cors_allow_credentials = True


class InboxSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr | None = None
    company: str | None = Field(default=None, max_length=120)
    message: str = Field(min_length=12, max_length=3000)
    source: str = Field(default="portfolio-widget", max_length=80)
    messages: list[dict[str, str]] | None = None
    locale: str | None = Field(default=None, pattern="^(es|en)$")

    model_config = ConfigDict(str_strip_whitespace=True)


class MessageAnalysis(BaseModel):
    language: str = Field(pattern="^(es|en)$")
    category: str
    priority: str
    summary: str
    key_points: list[str]
    theme_label: str
    theme_slug: str
    thread_title: str
    reply_text: str
    lead_score: int = Field(ge=1, le=5)
    sentiment: str


app = FastAPI(title="AI Portfolio Inbox & Insights", version="2.0.0")
# --- CORS CONFIG FROM ENV ---
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "")

cors_allow_origins = [
    origin.strip()
    for origin in allowed_origins_raw.split(",")
    if origin.strip()
]

# fallback para desarrollo
if not cors_allow_origins:
    cors_allow_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

cors_allow_credentials = True
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_allow_origins,
    allow_credentials=cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


def get_openai_client() -> OpenAI | None:
    if not settings.openai_api_key:
        return None
    return OpenAI(api_key=settings.openai_api_key)


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(settings.database_path)
    connection.row_factory = sqlite3.Row
    return connection


def existing_columns(connection: sqlite3.Connection, table_name: str) -> set[str]:
    rows = connection.execute(f"PRAGMA table_info({table_name})").fetchall()
    return {row["name"] for row in rows}


def ensure_columns(connection: sqlite3.Connection, table_name: str, columns: dict[str, str]) -> None:
    current = existing_columns(connection, table_name)
    for column_name, definition in columns.items():
        if column_name not in current:
            connection.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}")


def init_db() -> None:
    with closing(get_connection()) as connection:
        connection.executescript(
            """
            PRAGMA journal_mode=WAL;

            CREATE TABLE IF NOT EXISTS threads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                theme_slug TEXT,
                theme_label TEXT,
                thread_title TEXT,
                priority TEXT,
                summary TEXT,
                created_at TEXT,
                updated_at TEXT,
                message_count INTEGER DEFAULT 0,
                lead_score INTEGER DEFAULT 1,
                slug TEXT,
                title TEXT,
                category TEXT,
                theme_tags TEXT,
                representative_summary TEXT,
                urgency_score INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                thread_id INTEGER NOT NULL,
                user_name TEXT,
                user_email TEXT,
                company TEXT,
                source TEXT,
                language TEXT,
                category TEXT,
                priority TEXT,
                lead_score INTEGER DEFAULT 1,
                sentiment TEXT,
                summary TEXT,
                key_points_json TEXT DEFAULT '[]',
                raw_message TEXT,
                reply_text TEXT,
                theme_label TEXT,
                theme_slug TEXT,
                thread_summary TEXT,
                email_status TEXT,
                analysis_engine TEXT,
                created_at TEXT,
                sender_name TEXT,
                sender_email TEXT,
                message_text TEXT,
                message_summary TEXT,
                suggested_reply TEXT,
                urgency_score INTEGER DEFAULT 0,
                themes TEXT DEFAULT '[]',
                needs_follow_up INTEGER DEFAULT 0,
                FOREIGN KEY(thread_id) REFERENCES threads(id)
            );
            """
        )
        ensure_columns(
            connection,
            "threads",
            {
                "theme_slug": "TEXT",
                "theme_label": "TEXT",
                "thread_title": "TEXT",
                "priority": "TEXT",
                "summary": "TEXT",
                "created_at": "TEXT",
                "updated_at": "TEXT",
                "message_count": "INTEGER DEFAULT 0",
                "lead_score": "INTEGER DEFAULT 1",
            },
        )
        ensure_columns(
            connection,
            "messages",
            {
                "user_name": "TEXT",
                "user_email": "TEXT",
                "source": "TEXT",
                "language": "TEXT",
                "category": "TEXT",
                "priority": "TEXT",
                "lead_score": "INTEGER DEFAULT 1",
                "sentiment": "TEXT",
                "summary": "TEXT",
                "key_points_json": "TEXT DEFAULT '[]'",
                "raw_message": "TEXT",
                "reply_text": "TEXT",
                "theme_label": "TEXT",
                "theme_slug": "TEXT",
                "thread_summary": "TEXT",
                "email_status": "TEXT",
                "analysis_engine": "TEXT",
                "created_at": "TEXT",
            },
        )
        connection.execute("CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id)")
        connection.execute("CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)")
        connection.execute("CREATE INDEX IF NOT EXISTS idx_messages_theme_slug ON messages(theme_slug)")
        connection.execute("CREATE INDEX IF NOT EXISTS idx_threads_theme_slug ON threads(theme_slug)")
        connection.commit()


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def fallback_theme(tokens: set[str]) -> tuple[str, str]:
    for slug, label, keywords in THEME_RULES:
        if tokens & keywords:
            return slug, label
    return "general-inquiries", "General inbound inquiries"


def heuristic_analysis(submission: InboxSubmission) -> tuple[MessageAnalysis, str]:
    message = submission.message.strip()
    lower_text = f"{message} {submission.company or ''}".lower()
    tokens = tokenize(lower_text)
    language = detect_language(lower_text)

    question_words = {"how", "what", "can", "could", "when", "where", "why", "como", "que", "qué", "puedes", "podrias", "podrías"}
    suggestion_words = {"suggestion", "idea", "improve", "feature", "recommend", "sugerencia", "mejora", "recomiendo"}
    project_words = {"project", "hire", "freelance", "contract", "pricing", "budget", "proposal", "collaboration", "proyecto", "contratar", "presupuesto", "propuesta", "colaboracion", "colaboración"}
    bug_words = {"bug", "issue", "error", "broken", "problem", "fix", "fallo", "problema", "arreglar"}
    positive_words = {"great", "love", "excellent", "awesome", "helpful", "genial", "encanta", "excelente", "buen"}
    negative_words = {"broken", "issue", "problem", "confusing", "slow", "fallo", "problema", "confuso", "lento"}
    urgent_words = {"urgent", "asap", "today", "deadline", "immediately", "urgente", "hoy", "inmediato", "inmediatamente"}

    if tokens & bug_words:
        category = "bug report"
    elif tokens & project_words:
        category = "project inquiry"
    elif tokens & suggestion_words:
        category = "suggestion"
    elif "?" in message or tokens & question_words:
        category = "question"
    else:
        category = "general feedback"

    if tokens & negative_words:
        sentiment = "negative"
    elif tokens & positive_words:
        sentiment = "positive"
    else:
        sentiment = "neutral"

    lead_score = 2
    if category == "project inquiry":
        lead_score = 4
    if submission.company:
        lead_score += 1
    if tokens & {"enterprise", "company", "team", "teams", "empresa", "equipo"}:
        lead_score += 1
    lead_score = max(1, min(5, lead_score))

    priority = "low"
    if category == "bug report" and tokens & urgent_words:
        priority = "high"
    elif category == "project inquiry" and (lead_score >= 4 or tokens & urgent_words):
        priority = "high"
    elif category in {"suggestion", "question", "bug report"} or lead_score >= 3:
        priority = "medium"

    theme_slug, theme_label = fallback_theme(tokens)
    thread_title = f"{theme_label} thread"
    sentence_parts = [part.strip() for part in re.split(r"(?<=[.!?])\s+", message) if part.strip()]
    summary = (sentence_parts[0] if sentence_parts else message)[:220]
    key_points = normalize_list(sentence_parts[:3] or [summary], limit=5)

    if language == "es":
        reply_text = "Gracias por escribir. He registrado tu mensaje y lo revisaré en breve con el contexto del hilo relacionado."
    else:
        reply_text = "Thanks for reaching out. I have logged your message and will review it shortly with the related thread context."

    return (
        MessageAnalysis(
            language=language,
            category=category,
            priority=priority,
            summary=summary,
            key_points=key_points,
            theme_label=theme_label,
            theme_slug=theme_slug,
            thread_title=thread_title,
            reply_text=reply_text,
            lead_score=lead_score,
            sentiment=sentiment,
        ),
        "heuristic",
    )


def detect_chat_intent(normalized_text: str) -> str:
    recruiter_terms = {
        "recruiter", "recruiting", "hiring", "hire", "hiring manager", "talent", "talent acquisition",
        "role", "roles", "position", "positions", "job", "opening", "opportunity", "interview", "team",
        "fit", "candidate", "cv", "resume", "background", "profile for", "perfil", "encaje", "puesto",
        "vacante", "reclutador", "seleccion", "seleccionador", "manager", "manager hiring",
    }
    client_terms = {
        "client", "project", "collaboration", "consulting", "consultant", "consultancy", "freelance",
        "support", "workflow", "process", "process improvement", "operations support", "dashboard",
        "reporting", "reporting help", "operations", "automation", "ai", "partner", "proposal",
        "quote", "scope", "need help", "help with", "improve", "improvement", "efficiency",
        "cliente", "proyecto", "colaboracion", "consultoria", "proceso", "mejora de procesos",
        "reporte", "reporting", "dashboard", "operaciones", "soporte operativo", "automatizacion",
        "propuesta", "presupuesto", "colaborador",
    }
    if any(term in normalized_text for term in recruiter_terms):
        return "recruiter"
    if any(term in normalized_text for term in client_terms):
        return "client"
    return "general"


def detect_summary_request(normalized_text: str) -> bool:
    summary_patterns = [
        "summary", "summarize", "summarise", "short version", "short overview", "quick summary",
        "high level overview", "key points", "overview", "resumen", "resumelo", "hazme un resumen",
        "dime lo principal", "resumen rapido", "resumen en 3 puntos", "lo mas importante",
    ]
    return any(pattern in normalized_text for pattern in summary_patterns)


def detect_chat_topic(normalized_text: str) -> str:
    if detect_summary_request(normalized_text):
        return "summary"
    if any(term in normalized_text for term in {"contact", "email", "reach", "connect", "linkedin", "contactar", "correo", "hablar"}):
        return "contact"
    if any(term in normalized_text for term in {"project", "projects", "portfolio", "case study", "proyecto", "proyectos"}):
        return "projects"
    if any(term in normalized_text for term in {"experience", "background", "career", "trayectoria", "experiencia"}):
        return "experience"
    if any(term in normalized_text for term in {"fit", "role", "roles", "encaje", "puesto", "perfil"}):
        return "fit"
    if any(term in normalized_text for term in {"ai", "automation", "workflow", "productivity", "ia", "automatizacion", "productividad"}):
        return "practical-ai"
    if any(term in normalized_text for term in {"about", "who is", "what does", "profile", "sobre", "quien es", "que hace"}):
        return "profile"
    return "general"


def detect_contact_readiness(normalized_text: str) -> bool:
    contact_terms = {
        "contact", "reach", "email", "call", "meeting", "book", "connect", "talk", "speak", "follow up",
        "linkedin", "correo", "contactar", "llamar", "reunion", "agendar", "hablar", "escribir",
        "ponernos en contacto", "seguir hablando",
    }
    return any(term in normalized_text for term in contact_terms)


def needs_guided_next_step(normalized_text: str, topic: str) -> bool:
    broad_terms = {
        "tell me about", "what does he do", "how can he help", "what kind of profile", "overview",
        "more about", "cuentame", "hablame", "que hace", "que perfil", "como puede ayudar",
        "mas informacion", "mas sobre", "dime sobre",
    }
    return topic == "general" and any(term in normalized_text for term in broad_terms)


def build_chat_cta(language: str, intent: str, topic: str, contact_ready: bool) -> str:
    if language == "es":
        if contact_ready or topic == "contact":
            if intent == "recruiter":
                return "Si ya quieres valorar encaje o disponibilidad, el formulario de contacto del portfolio es el mejor siguiente paso."
            if intent == "client":
                return "Si ya tienes una necesidad concreta, el formulario de contacto del portfolio es la mejor via para aterrizar el contexto."
            return "Si prefieres pasar a una conversacion directa, el formulario de contacto del portfolio es el mejor siguiente paso."
        if intent == "recruiter":
            return "Si te encaja, puedo resumir su fit para un rol, destacar la experiencia mas relevante o indicar el mejor siguiente paso de contacto."
        if intent == "client":
            return "Si te sirve, puedo enfocarlo a procesos, reporting, workflows digitales o uso practico de IA y despues orientarte a contacto."
        return "Si quieres, puedo resumirlo en corto, enfocarlo a experiencia o senalar los proyectos mas relevantes."

    if contact_ready or topic == "contact":
        if intent == "recruiter":
            return "If you already want to assess fit or availability, the portfolio contact form is the best next step."
        if intent == "client":
            return "If you already have a concrete need, the portfolio contact form is the best way to turn it into a practical conversation."
        return "If you prefer to move into a direct conversation, the portfolio contact form is the best next step."
    if intent == "recruiter":
        return "If useful, I can summarize his fit for a role, highlight the most relevant experience, or point you to the best next contact step."
    if intent == "client":
        return "If helpful, I can frame his value around processes, reporting, digital workflows, or practical AI and then point you to contact."
    return "If you want, I can keep it short, focus on experience, or point you to the most relevant projects."


def build_guided_options(language: str, intent: str) -> str:
    if language == "es":
        if intent == "recruiter":
            return "Puedo ayudarte de tres formas: resumen de perfil, encaje para un rol o experiencia mas relevante."
        if intent == "client":
            return "Puedo ayudarte de tres formas: resumen del perfil, donde puede aportar en procesos/reporting o siguiente paso de contacto."
        return "Puedo ayudarte de tres formas: resumen del perfil, experiencia principal o proyectos mas relevantes."
    if intent == "recruiter":
        return "I can help in three ways: a profile summary, fit for a role, or the most relevant experience."
    if intent == "client":
        return "I can help in three ways: a profile summary, where he can add value in processes/reporting, or the best next contact step."
    return "I can help in three ways: a profile summary, key experience, or the most relevant projects."


def build_static_chat_reply(language: str, topic: str, intent: str, contact_ready: bool, guided_mode: bool) -> str | None:
    tail = build_chat_cta(language, intent, topic, contact_ready)

    replies = {
        "en": {
            "summary": "Quick summary:\n- Carlos is an operations, data, and digital support professional with a clear corporate profile.\n- His experience is centered on process support, reporting, SAP-related workflows, coordination, incidents, and structured follow-up.\n- He also uses digital tools and practical AI to improve productivity, information handling, and workflow efficiency.",
            "profile": "Carlos' profile sits at the intersection of operations, data, digital workflows, and practical AI. He is best understood as a corporate, business-support profile focused on process coordination, reporting, SAP support, and operational improvement rather than as a pure developer or AI engineer.\n\n" + tail,
            "experience": "His recent experience includes supporting Purchasing and Aftersales processes in a BMW-related environment, with SAP support, reporting follow-up, incident handling, and coordination. His broader background also includes back-office operations, documentation validation, public procurement support, banking operations, and technical support operations.\n\n" + tail,
            "projects": "The projects in the portfolio are positioned as applied digital initiatives. They show how Carlos structures information, communicates clearly, works with dashboards and reporting, and uses practical AI to support productivity rather than as a pure engineering showcase.\n\n" + tail,
            "fit": "Carlos is a strong fit for roles that combine operations, reporting, process support, procurement support, digital coordination, and practical AI use. He is especially relevant for teams that need structured follow-up, business support, KPI visibility, and someone comfortable working across tools, workflows, and operational contexts.\n\n" + tail,
            "practical-ai": "His use of AI is practical and business-oriented. The focus is on writing support, information organization, summarization, and workflow efficiency, not on positioning himself as a pure AI engineer.\n\n" + tail,
            "contact": "The best next step is to use the contact option in the portfolio if you want to discuss a role, collaboration, or project context. If helpful first, I can also summarize his experience or highlight the most relevant projects before you reach out.",
            "general": "Carlos' portfolio presents a professional profile centered on operations, reporting, process support, digital workflows, and practical AI. The strongest themes are corporate business support, data visibility, coordination, and useful digital initiatives.\n\n" + (build_guided_options(language, intent) if guided_mode else tail),
        },
        "es": {
            "summary": "Resumen rapido:\n- Carlos es un profesional de operaciones, datos y soporte digital con perfil corporativo claro.\n- Su experiencia se centra en soporte a procesos, reporting, workflows relacionados con SAP, coordinacion, incidencias y seguimiento estructurado.\n- Tambien utiliza herramientas digitales e IA practica para mejorar productividad, gestion de la informacion y eficiencia de workflows.",
            "profile": "El perfil de Carlos se situa en la interseccion entre operaciones, datos, workflows digitales e IA practica. Se entiende mejor como un perfil corporativo y de soporte a negocio enfocado en coordinacion de procesos, reporting, soporte SAP y mejora operativa, no como un developer puro ni como un AI engineer.\n\n" + tail,
            "experience": "Su experiencia reciente incluye soporte a procesos de Purchasing y Aftersales en un entorno vinculado a BMW, con soporte SAP, seguimiento de reporting, gestion de incidencias y coordinacion. Su trayectoria tambien incluye back office, validacion documental, contratacion publica, operaciones bancarias y soporte tecnico-operativo.\n\n" + tail,
            "projects": "Los proyectos del portfolio estan planteados como iniciativas digitales aplicadas. Muestran como Carlos estructura informacion, comunica con claridad, trabaja con dashboards y reporting, y utiliza IA practica para apoyar productividad, no como una muestra de ingenieria pura.\n\n" + tail,
            "fit": "Carlos encaja bien en roles que combinan operaciones, reporting, soporte a procesos, soporte a compras, coordinacion digital y uso practico de IA. Es especialmente relevante para equipos que necesitan seguimiento estructurado, soporte de negocio, visibilidad KPI y alguien comodo trabajando entre herramientas, workflows y contextos operativos.\n\n" + tail,
            "practical-ai": "Su uso de IA es practico y orientado a negocio. El foco esta en apoyo a redaccion, organizacion de informacion, resumenes y eficiencia de workflows, no en presentarse como un AI engineer puro.\n\n" + tail,
            "contact": "El mejor siguiente paso es usar la opcion de contacto del portfolio si quieres hablar sobre un rol, una colaboracion o un contexto de proyecto. Si te ayuda antes, tambien puedo resumir su experiencia o destacar los proyectos mas relevantes.",
            "general": "El portfolio de Carlos presenta un perfil profesional centrado en operaciones, reporting, soporte a procesos, workflows digitales e IA practica. Los temas mas fuertes son soporte corporativo a negocio, visibilidad de datos, coordinacion e iniciativas digitales utiles.\n\n" + (build_guided_options(language, intent) if guided_mode else tail),
        },
    }
    return replies.get(language, replies["en"]).get(topic)


def fallback_chat_reply(language: str, intent: str, contact_ready: bool) -> str:
    if language == "es":
        return (
            "Puedo ayudarte con un resumen del perfil, experiencia, proyectos o encaje profesional. "
            + build_chat_cta(language, intent, "general", contact_ready)
        )
    return (
        "I can help with a profile summary, experience overview, projects, or role fit. "
        + build_chat_cta(language, intent, "general", contact_ready)
    )


def openai_chat_reply(
    submission: InboxSubmission,
    analysis: MessageAnalysis,
    intent: str,
    topic: str,
    contact_ready: bool,
    guided_mode: bool,
) -> tuple[str | None, str]:
    client = get_openai_client()
    if client is None:
        return None, "chat-heuristic"

    language = analysis.language or resolve_chat_language(submission)
    history = submission.messages or []
    filtered_history = [
        {
            "role": item.get("role", "user") if item.get("role") in {"assistant", "user"} else "user",
            "content": item.get("content", "").strip(),
        }
        for item in history[-6:]
        if item.get("content")
    ]

    if not filtered_history:
        filtered_history = [{"role": "user", "content": submission.message}]

    facts = "\n".join(f"- {fact}" for fact in CHAT_PROFILE_FACTS.get(language, CHAT_PROFILE_FACTS["en"]))
    history_text = "\n".join(f"{item['role']}: {item['content']}" for item in filtered_history)
    brevity_rule = (
        "If the user is asking for a summary, answer in 3 short bullet points maximum."
        if topic == "summary"
        else "Keep the reply concise, high-signal, and easy to scan."
    )

    prompt = f"""
You are the portfolio assistant for Carlos San Miguel.

Rules:
- Reply in {language}.
- Answer in the same language as the user.
- Maintain the conversation language unless the user clearly changes it.
- Summaries, CTAs, and follow-up suggestions must stay in {language}.
- Never force English when the user is speaking Spanish.
- Sound professional, clear, and recruiter-friendly.
- Position Carlos around operations, data, digital workflows, and practical AI.
- Do not present him as a pure AI engineer, full developer, or pure software engineer.
- Do not invent experience or exaggerate seniority.
- Adapt to intent: {intent}.
- {brevity_rule}
- Think like a professional portfolio assistant, not a sales bot.
- For recruiter or hiring intent, connect the answer to role fit, relevant experience, and a sensible contact path.
- For client or collaboration intent, connect the answer to process support, reporting, digital workflows, and practical AI use.
- If the question is broad ({guided_mode}), synthesize first and then offer 2 or 3 clear directions.
- If contact intent is explicit ({contact_ready}), make the next step practical and low-pressure.
- End with one brief, natural next step when it genuinely helps. Avoid empty closers.

Facts:
{facts}

Conversation:
{history_text}
"""
    try:
        response = client.responses.create(
            model=settings.openai_model,
            input=[
                {"role": "system", "content": [{"type": "input_text", "text": "You answer questions about a professional portfolio with grounded, concise, non-invented replies."}]},
                {"role": "user", "content": [{"type": "input_text", "text": prompt}]},
            ],
            max_output_tokens=220,
        )
        reply = response.output_text.strip()
        return (reply or None), "chat-openai"
    except Exception as exc:
        logger.info("Chat reply fallback used after OpenAI error: %s", exc)
        return None, "chat-heuristic"


def generate_chat_reply(submission: InboxSubmission, analysis: MessageAnalysis) -> tuple[str, str]:
    language = analysis.language or resolve_chat_language(submission)
    normalized = normalize_match_text(submission.message)
    intent = detect_chat_intent(normalized)
    topic = detect_chat_topic(normalized)
    contact_ready = detect_contact_readiness(normalized)
    guided_mode = needs_guided_next_step(normalized, topic)
    word_count = len(normalized.split())

    static_reply = build_static_chat_reply(language, topic, intent, contact_ready, guided_mode)
    if static_reply and (topic != "general" or word_count <= 8):
        return static_reply, "chat-heuristic"

    if guided_mode and static_reply:
        return static_reply, "chat-heuristic"

    model_reply, engine = openai_chat_reply(submission, analysis, intent, topic, contact_ready, guided_mode)
    if model_reply:
        return model_reply, engine

    return fallback_chat_reply(language, intent, contact_ready), "chat-fallback"


def openai_analysis(submission: InboxSubmission) -> tuple[MessageAnalysis, str]:
    client = get_openai_client()
    if client is None:
        return heuristic_analysis(submission)

    schema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "language": {"type": "string", "enum": ["es", "en"]},
            "category": {"type": "string", "enum": ["question", "suggestion", "project inquiry", "bug report", "general feedback"]},
            "priority": {"type": "string", "enum": ["high", "medium", "low"]},
            "summary": {"type": "string"},
            "key_points": {"type": "array", "items": {"type": "string"}, "minItems": 1, "maxItems": 5},
            "theme_label": {"type": "string"},
            "theme_slug": {"type": "string"},
            "thread_title": {"type": "string"},
            "reply_text": {"type": "string"},
            "lead_score": {"type": "integer", "minimum": 1, "maximum": 5},
            "sentiment": {"type": "string", "enum": ["positive", "neutral", "negative"]},
        },
        "required": ["language", "category", "priority", "summary", "key_points", "theme_label", "theme_slug", "thread_title", "reply_text", "lead_score", "sentiment"],
    }

    prompt = f"""
Analyze this inbound portfolio message for an AI product engineer.

Rules:
- Detect whether the message language is Spanish or English.
- reply_text must be in the same language as the user.
- summary and key_points should stay in the same language as the user.
- theme_label and thread_title should be concise, professional English labels for dashboard consistency.
- theme_slug must be stable, lowercase, hyphenated, and suitable for grouping similar topics.
- Project, collaboration, commercial, or consulting opportunities should usually have a higher lead_score.
- Urgent bugs or time-sensitive project opportunities should often be high priority.
- Do not invent facts.
- Keep summary concise and useful.

Metadata:
- sender_name: {submission.name}
- sender_email: {submission.email or "not provided"}
- company: {submission.company or "not provided"}
- source: {submission.source}

Message:
{submission.message}
"""

    try:
        response = client.responses.create(
            model=settings.openai_model,
            input=[
                {"role": "system", "content": [{"type": "input_text", "text": "You classify inbound messages and return strict JSON matching the provided schema."}]},
                {"role": "user", "content": [{"type": "input_text", "text": prompt}]},
            ],
            text={"format": {"type": "json_schema", "name": "bilingual_message_analysis", "strict": True, "schema": schema}},
        )
        parsed = MessageAnalysis.model_validate(json.loads(response.output_text))
        parsed.key_points = normalize_list(parsed.key_points, limit=5)
        parsed.theme_slug = slugify(parsed.theme_slug)
        return parsed, "openai"
    except Exception as exc:
        logger.exception("OpenAI analysis failed, falling back to heuristics: %s", exc)
        return heuristic_analysis(submission)


def text_summary_from_messages(messages: list[dict[str, Any]]) -> str:
    if not messages:
        return "No thread activity yet."
    top_points: list[str] = []
    for message in messages[:5]:
        top_points.extend(message.get("key_points", [])[:2])
    top_points = normalize_list(top_points, limit=4)
    if top_points:
        return "This thread centers on: " + "; ".join(top_points) + "."
    return "This thread contains recurring inbound discussion around a shared topic."


def maybe_generate_ai_thread_summary(messages: list[dict[str, Any]], fallback_summary: str) -> str:
    client = get_openai_client()
    if client is None or not messages:
        return fallback_summary
    snippets = []
    for message in messages[:6]:
        snippets.append(
            f"- language: {message['language']}\n- category: {message['category']}\n- summary: {message['summary']}\n- key points: {', '.join(message['key_points'])}"
        )
    try:
        response = client.responses.create(
            model=settings.openai_model,
            input="Generate a short internal thread summary in English based on these recent messages:\n\n" + "\n\n".join(snippets),
        )
        summary = response.output_text.strip()
        return summary or fallback_summary
    except Exception as exc:
        logger.info("Thread summary fallback used after OpenAI error: %s", exc)
        return fallback_summary


def get_thread_messages(connection: sqlite3.Connection, thread_id: int, limit: int = 6) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT
            id,
            COALESCE(user_name, sender_name) AS user_name,
            COALESCE(user_email, sender_email) AS user_email,
            company,
            source,
            language,
            category,
            priority,
            lead_score,
            sentiment,
            COALESCE(summary, message_summary) AS summary,
            key_points_json,
            COALESCE(raw_message, message_text) AS raw_message,
            reply_text,
            theme_label,
            theme_slug,
            thread_summary,
            email_status,
            created_at
        FROM messages
        WHERE thread_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        """,
        (thread_id, limit),
    ).fetchall()
    return [
        {
            "id": row["id"],
            "user_name": row["user_name"],
            "user_email": row["user_email"],
            "company": row["company"],
            "source": row["source"],
            "language": row["language"] or "en",
            "category": row["category"] or "general feedback",
            "priority": row["priority"] or "low",
            "lead_score": row["lead_score"] or 1,
            "sentiment": row["sentiment"] or "neutral",
            "summary": row["summary"] or "",
            "key_points": parse_json_list(row["key_points_json"]),
            "raw_message": row["raw_message"] or "",
            "reply_text": row["reply_text"] or "",
            "theme_label": row["theme_label"] or "",
            "theme_slug": row["theme_slug"] or "",
            "thread_summary": row["thread_summary"] or "",
            "email_status": allowed_email_status(row["email_status"] or "skipped"),
            "created_at": row["created_at"],
        }
        for row in rows
    ]


def get_or_create_thread(connection: sqlite3.Connection, analysis: MessageAnalysis) -> int:
    existing = connection.execute(
        "SELECT id FROM threads WHERE theme_slug = ? ORDER BY updated_at DESC, id DESC LIMIT 1",
        (analysis.theme_slug,),
    ).fetchone()
    if existing:
        return int(existing["id"])

    now = utc_now()
    cursor = connection.execute(
        """
        INSERT INTO threads (
            theme_slug, theme_label, thread_title, priority, summary, created_at, updated_at,
            message_count, lead_score, slug, title, category, theme_tags, representative_summary, urgency_score
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, 0)
        """,
        (
            analysis.theme_slug,
            analysis.theme_label,
            analysis.thread_title,
            analysis.priority,
            analysis.summary,
            now,
            now,
            analysis.lead_score,
            analysis.theme_slug,
            analysis.thread_title,
            analysis.category,
            json.dumps([analysis.theme_label]),
            analysis.summary,
        ),
    )
    return int(cursor.lastrowid)


def refresh_thread_rollup(connection: sqlite3.Connection, thread_id: int, analysis: MessageAnalysis) -> dict[str, Any]:
    messages = get_thread_messages(connection, thread_id, limit=6)
    fallback_summary = text_summary_from_messages(messages)
    thread_summary = maybe_generate_ai_thread_summary(messages, fallback_summary)
    highest_priority = "low"
    highest_lead = 1
    for message in messages:
        if PRIORITY_RANK.get(message["priority"], 1) > PRIORITY_RANK.get(highest_priority, 1):
            highest_priority = message["priority"]
        highest_lead = max(highest_lead, int(message["lead_score"]))
    now = utc_now()
    connection.execute(
        """
        UPDATE threads
        SET
            theme_slug = ?,
            theme_label = ?,
            thread_title = ?,
            priority = ?,
            summary = ?,
            updated_at = ?,
            message_count = (SELECT COUNT(*) FROM messages WHERE thread_id = ?),
            lead_score = ?,
            slug = ?,
            title = ?,
            representative_summary = ?,
            theme_tags = ?
        WHERE id = ?
        """,
        (
            analysis.theme_slug,
            analysis.theme_label,
            analysis.thread_title,
            highest_priority,
            thread_summary,
            now,
            thread_id,
            highest_lead,
            analysis.theme_slug,
            analysis.thread_title,
            thread_summary,
            json.dumps([analysis.theme_label]),
            thread_id,
        ),
    )
    connection.execute("UPDATE messages SET thread_summary = ? WHERE thread_id = ?", (thread_summary, thread_id))
    row = connection.execute(
        """
        SELECT
            id,
            theme_slug,
            theme_label,
            COALESCE(thread_title, title) AS thread_title,
            priority,
            COALESCE(summary, representative_summary) AS summary,
            created_at,
            updated_at,
            message_count,
            lead_score
        FROM threads
        WHERE id = ?
        """,
        (thread_id,),
    ).fetchone()
    return dict(row) if row else {}


def allowed_email_status(status: str) -> str:
    normalized = (status or "").strip().lower()
    return normalized if normalized in {"sent", "failed", "skipped"} else "failed"


def smtp_diagnostics() -> dict[str, Any]:
    smtp_ready = all([settings.smtp_host, settings.smtp_username, settings.smtp_password, settings.email_from, settings.owner_email])
    resend_ready = bool(settings.resend_api_key and settings.resend_from_email and settings.owner_email)
    recommendations: list[str] = []

    if not settings.resend_api_key:
        recommendations.append("Falta RESEND_API_KEY. Sin esa clave el backend omitira el envio de emails en Render Free.")
    if not settings.resend_from_email:
        recommendations.append("Falta RESEND_FROM_EMAIL. Debe ser un remitente valido verificado en Resend.")
    if not settings.owner_email:
        recommendations.append("Falta OWNER_EMAIL. Debe ser el correo que recibira las notificaciones.")
    if resend_ready and not recommendations:
        recommendations.append("Configuracion Resend lista para probar el envio real por HTTPS.")

    return {
        "provider": "resend" if resend_ready else "skipped",
        "resend_api_key_configured": bool(settings.resend_api_key),
        "resend_from_email": settings.resend_from_email,
        "resend_ready": resend_ready,
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port,
        "smtp_use_tls": settings.smtp_use_tls,
        "smtp_username_configured": bool(settings.smtp_username),
        "smtp_password_configured": bool(settings.smtp_password),
        "smtp_ready": smtp_ready,
        "email_from": settings.email_from,
        "owner_email": settings.owner_email,
        "recomendaciones": recommendations,
    }


def send_email_notification(message_id: int, submission: InboxSubmission, analysis: MessageAnalysis, thread: dict[str, Any], related_messages: list[dict[str, Any]]) -> str:
    diagnostics = smtp_diagnostics()
    logger.info(
        "Email config check | message_id=%s | provider=%s | resend_ready=%s | resend_from_email=%s | owner_email=%s",
        message_id,
        diagnostics["provider"],
        diagnostics["resend_ready"],
        diagnostics["resend_from_email"] or "",
        diagnostics["owner_email"] or "",
    )
    if not diagnostics["resend_ready"]:
        logger.warning("Resend not ready. Message %s stored, email skipped. recomendaciones=%s", message_id, diagnostics["recomendaciones"])
        return "skipped"

    related_lines = []
    for related in related_messages[:3]:
        if related["id"] == message_id:
            continue
        related_lines.append(f"- {related['created_at']} | {related['user_name']} | {related['priority']} | {related['summary']}")

    dashboard_url = f"{settings.app_base_url.rstrip('/')}/dashboard"
    key_points_text = ", ".join(analysis.key_points) if analysis.key_points else "None"
    body = f"""
New AI Portfolio Inbox message

Message metadata
- ID: {message_id}
- Name: {submission.name}
- Email: {submission.email or "not provided"}
- Company: {submission.company or "not provided"}
- Source: {submission.source}
- Language: {analysis.language}
- Category: {analysis.category}
- Priority: {analysis.priority}
- Lead score: {analysis.lead_score}
- Sentiment: {analysis.sentiment}
- Theme label: {analysis.theme_label}
- Thread title: {analysis.thread_title}

AI summary
- Summary: {analysis.summary}
- Key points: {key_points_text}
- Suggested reply: {analysis.reply_text}

Thread context
- Thread summary: {thread.get("summary", "")}
- Thread priority: {thread.get("priority", "")}
- Thread theme slug: {thread.get("theme_slug", "")}
- Message count: {thread.get("message_count", 0)}

Recent related messages
{chr(10).join(related_lines) if related_lines else "- No previous related messages yet."}

Original message
{submission.message}

Dashboard
{dashboard_url}
"""

    subject = f"[Portfolio Inbox] {analysis.priority.upper()} | {analysis.category.title()} | {submission.name}"
    payload = {
        "from": settings.resend_from_email,
        "to": [settings.owner_email],
        "subject": subject,
        "text": body.strip(),
    }
    if submission.email:
        payload["reply_to"] = str(submission.email)

    try:
        logger.info(
            "Resend send start | message_id=%s | to=%s | from=%s | reply_to_present=%s",
            message_id,
            settings.owner_email,
            settings.resend_from_email,
            bool(submission.email),
        )
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.resend_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=20,
        )
        if response.ok:
            logger.info("Resend send completed | message_id=%s | status_code=%s", message_id, response.status_code)
            return "sent"
        logger.error(
            "Resend send failed | message_id=%s | status_code=%s | body=%s",
            message_id,
            response.status_code,
            response.text[:400],
        )
        return "failed"
    except requests.RequestException as exc:
        logger.exception("Resend delivery failed for message %s: %s", message_id, exc)
        return "failed"
    except Exception:
        logger.exception("Unexpected Resend delivery failure for message %s", message_id)
        return "failed"


def serialize_message(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "thread_id": row["thread_id"],
        "thread_title": row["thread_title"],
        "theme_slug": row["theme_slug"],
        "theme_label": row["theme_label"],
        "user_name": row["user_name"],
        "user_email": row["user_email"],
        "company": row["company"],
        "source": row["source"],
        "language": row["language"] or "en",
        "category": row["category"] or "general feedback",
        "priority": row["priority"] or "low",
        "lead_score": row["lead_score"] or 1,
        "sentiment": row["sentiment"] or "neutral",
        "summary": row["summary"] or "",
        "key_points": parse_json_list(row["key_points_json"]),
        "raw_message": row["raw_message"] or "",
        "reply_text": row["reply_text"] or "",
        "thread_summary": row["thread_summary"] or "",
        "email_status": allowed_email_status(row["email_status"] or "skipped"),
        "created_at": row["created_at"],
    }


def recent_messages(limit: int = 12) -> list[dict[str, Any]]:
    with closing(get_connection()) as connection:
        rows = connection.execute(
            """
            SELECT
                m.id,
                m.thread_id,
                COALESCE(t.thread_title, t.title) AS thread_title,
                COALESCE(t.theme_slug, m.theme_slug) AS theme_slug,
                COALESCE(t.theme_label, m.theme_label) AS theme_label,
                COALESCE(m.user_name, m.sender_name) AS user_name,
                COALESCE(m.user_email, m.sender_email) AS user_email,
                m.company,
                m.source,
                m.language,
                COALESCE(m.category, t.category) AS category,
                m.priority,
                m.lead_score,
                m.sentiment,
                COALESCE(m.summary, m.message_summary) AS summary,
                m.key_points_json,
                COALESCE(m.raw_message, m.message_text) AS raw_message,
                m.reply_text,
                m.thread_summary,
                m.email_status,
                m.created_at
            FROM messages m
            JOIN threads t ON t.id = m.thread_id
            ORDER BY m.created_at DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [serialize_message(row) for row in rows]


def thread_rows(limit: int = 20) -> list[dict[str, Any]]:
    with closing(get_connection()) as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                theme_slug,
                theme_label,
                COALESCE(thread_title, title) AS thread_title,
                priority,
                COALESCE(summary, representative_summary) AS summary,
                created_at,
                updated_at,
                message_count,
                lead_score
            FROM threads
            ORDER BY updated_at DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
    return [dict(row) for row in rows]


def aggregate_counts(connection: sqlite3.Connection, column_name: str, fallback: str = "unknown") -> dict[str, int]:
    rows = connection.execute(
        f"""
        SELECT COALESCE(NULLIF(TRIM({column_name}), ''), ?) AS label, COUNT(*) AS total
        FROM messages
        GROUP BY COALESCE(NULLIF(TRIM({column_name}), ''), ?)
        ORDER BY total DESC
        """,
        (fallback, fallback),
    ).fetchall()
    return {row["label"]: row["total"] for row in rows}


def all_messages_for_export(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT
            m.id,
            m.created_at,
            COALESCE(m.user_name, m.sender_name, 'Website Visitor') AS user_name,
            COALESCE(m.user_email, m.sender_email, '') AS user_email,
            COALESCE(m.company, '') AS company,
            COALESCE(NULLIF(TRIM(m.source), ''), 'unknown') AS source,
            COALESCE(NULLIF(TRIM(m.language), ''), 'unknown') AS language,
            COALESCE(NULLIF(TRIM(m.category), ''), 'other') AS category,
            COALESCE(NULLIF(TRIM(m.priority), ''), 'unknown') AS priority,
            COALESCE(NULLIF(TRIM(m.theme_label), ''), 'Untagged') AS theme_label,
            COALESCE(NULLIF(TRIM(m.theme_slug), ''), 'untagged') AS theme_slug,
            COALESCE(m.summary, m.message_summary, '') AS summary
        FROM messages m
        ORDER BY m.created_at DESC, m.id DESC
        """
    ).fetchall()
    return [dict(row) for row in rows]


def chart_dataset_from_counts(counts: dict[str, int], limit: int | None = None) -> list[dict[str, Any]]:
    items = [{"label": key or "unknown", "value": int(value)} for key, value in counts.items()]
    items.sort(key=lambda item: (-item["value"], item["label"]))
    return items[:limit] if limit is not None else items


def dashboard_chart_metrics(connection: sqlite3.Connection) -> dict[str, Any]:
    metrics = dashboard_message_metrics(connection)
    by_priority = aggregate_counts(connection, "priority", fallback="unknown")
    by_language = aggregate_counts(connection, "language", fallback="unknown")
    by_category = aggregate_counts(connection, "category", fallback="other")
    by_source = aggregate_counts(connection, "source", fallback="unknown")
    top_themes = [
        {
            "label": item["label"] or "Untagged",
            "slug": item["slug"] or "untagged",
            "value": int(item["total"]),
        }
        for item in metrics["top_themes"]
    ]
    messages_per_day = [
        {
            "label": item["day"] or "unknown",
            "value": int(item["total"]),
        }
        for item in metrics["message_volume"]
    ]
    return {
        "total_messages": metrics["total_messages"],
        "distribution": {
            "priority": chart_dataset_from_counts(by_priority),
            "language": chart_dataset_from_counts(by_language),
            "category": chart_dataset_from_counts(by_category),
            "source": chart_dataset_from_counts(by_source),
        },
        "messages_per_day": messages_per_day,
        "top_themes": top_themes,
        "summary": {
            "by_priority": by_priority,
            "by_language": by_language,
            "by_category": by_category,
            "by_source": by_source,
        },
    }


def dashboard_message_metrics(connection: sqlite3.Connection) -> dict[str, Any]:
    total_messages = connection.execute("SELECT COUNT(*) AS total FROM messages").fetchone()["total"]
    top_themes = [
        dict(row)
        for row in connection.execute(
            """
            SELECT COALESCE(theme_label, 'General inbound inquiries') AS label,
                   COALESCE(theme_slug, 'general-inquiries') AS slug,
                   COUNT(*) AS total
            FROM messages
            GROUP BY COALESCE(theme_slug, 'general-inquiries'), COALESCE(theme_label, 'General inbound inquiries')
            ORDER BY total DESC
            LIMIT 6
            """
        ).fetchall()
    ]
    message_volume = [
        dict(row)
        for row in connection.execute(
            """
            SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS total
            FROM messages
            WHERE created_at >= ?
            GROUP BY substr(created_at, 1, 10)
            ORDER BY day ASC
            """,
            (iso_days_ago(30),),
        ).fetchall()
    ]
    highest_leads = [
        serialize_message(row)
        for row in connection.execute(
            """
            SELECT
                m.id,
                m.thread_id,
                COALESCE(t.thread_title, t.title) AS thread_title,
                COALESCE(t.theme_slug, m.theme_slug) AS theme_slug,
                COALESCE(t.theme_label, m.theme_label) AS theme_label,
                COALESCE(m.user_name, m.sender_name) AS user_name,
                COALESCE(m.user_email, m.sender_email) AS user_email,
                m.company,
                m.source,
                m.language,
                m.category,
                m.priority,
                m.lead_score,
                m.sentiment,
                COALESCE(m.summary, m.message_summary) AS summary,
                m.key_points_json,
                COALESCE(m.raw_message, m.message_text) AS raw_message,
                m.reply_text,
                m.thread_summary,
                m.email_status,
                m.created_at
            FROM messages m
            JOIN threads t ON t.id = m.thread_id
            ORDER BY m.lead_score DESC, CASE m.priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC, m.created_at DESC
            LIMIT 5
            """
        ).fetchall()
    ]
    recent_high_priority = [
        serialize_message(row)
        for row in connection.execute(
            """
            SELECT
                m.id,
                m.thread_id,
                COALESCE(t.thread_title, t.title) AS thread_title,
                COALESCE(t.theme_slug, m.theme_slug) AS theme_slug,
                COALESCE(t.theme_label, m.theme_label) AS theme_label,
                COALESCE(m.user_name, m.sender_name) AS user_name,
                COALESCE(m.user_email, m.sender_email) AS user_email,
                m.company,
                m.source,
                m.language,
                m.category,
                m.priority,
                m.lead_score,
                m.sentiment,
                COALESCE(m.summary, m.message_summary) AS summary,
                m.key_points_json,
                COALESCE(m.raw_message, m.message_text) AS raw_message,
                m.reply_text,
                m.thread_summary,
                m.email_status,
                m.created_at
            FROM messages m
            JOIN threads t ON t.id = m.thread_id
            WHERE m.priority = 'high'
            ORDER BY m.created_at DESC
            LIMIT 6
            """
        ).fetchall()
    ]
    return {
        "total_messages": total_messages,
        "by_priority": aggregate_counts(connection, "priority"),
        "by_category": aggregate_counts(connection, "category"),
        "by_language": aggregate_counts(connection, "language"),
        "by_sentiment": aggregate_counts(connection, "sentiment"),
        "top_themes": top_themes,
        "message_volume": message_volume,
        "highest_leads": highest_leads,
        "recent_high_priority": recent_high_priority,
        "top_opportunities": [item for item in highest_leads if item["lead_score"] >= 4][:4],
        "recurring_interests": top_themes[:4],
    }


def fallback_executive_summary(metrics: dict[str, Any]) -> str:
    total = metrics["total_messages"]
    top_theme = metrics["top_themes"][0]["label"] if metrics["top_themes"] else "general inbound inquiries"
    top_opportunities = len(metrics["top_opportunities"])
    return f"The inbox has captured {total} messages so far. The most requested topic is {top_theme}. There are {top_opportunities} strong opportunity signals based on lead score and priority."


def generate_executive_summary(metrics: dict[str, Any]) -> str:
    client = get_openai_client()
    fallback = fallback_executive_summary(metrics)
    if client is None:
        return fallback
    prompt = {
        "total_messages": metrics["total_messages"],
        "by_priority": metrics["by_priority"],
        "by_category": metrics["by_category"],
        "by_language": metrics["by_language"],
        "top_themes": metrics["top_themes"],
        "top_opportunities": [{"summary": item["summary"], "lead_score": item["lead_score"], "priority": item["priority"], "theme_label": item["theme_label"]} for item in metrics["top_opportunities"]],
    }
    try:
        response = client.responses.create(
            model=settings.openai_model,
            input="Write a concise executive summary in English for a portfolio inbox dashboard based on this JSON:\n" + json.dumps(prompt, ensure_ascii=True),
        )
        return response.output_text.strip() or fallback
    except Exception as exc:
        logger.info("Executive summary fallback used after OpenAI error: %s", exc)
        return fallback


def ga4_configured() -> bool:
    return bool(settings.ga4_property_id and settings.google_application_credentials and GA4_CLIENT_AVAILABLE)


def fetch_ga4_analytics() -> dict[str, Any]:
    if not settings.ga4_property_id:
        return {"status": "not_configured", "reason": "GA4_PROPERTY_ID is not set."}
    if not settings.google_application_credentials:
        return {"status": "not_configured", "reason": "GOOGLE_APPLICATION_CREDENTIALS is not set."}
    if not GA4_CLIENT_AVAILABLE:
        return {"status": "not_configured", "reason": "google-analytics-data client library is not installed."}
    try:
        client = BetaAnalyticsDataClient()
        property_name = f"properties/{settings.ga4_property_id}"
        totals = client.run_report(
            RunReportRequest(
                property=property_name,
                date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
                metrics=[Metric(name="totalUsers"), Metric(name="sessions"), Metric(name="screenPageViews"), Metric(name="engagedSessions")],
            )
        )
        totals_row = totals.rows[0].metric_values if totals.rows else []
        top_pages_report = client.run_report(
            RunReportRequest(
                property=property_name,
                date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
                dimensions=[Dimension(name="pagePath")],
                metrics=[Metric(name="screenPageViews")],
                limit=5,
            )
        )
        trend_report = client.run_report(
            RunReportRequest(
                property=property_name,
                date_ranges=[DateRange(start_date="14daysAgo", end_date="today")],
                dimensions=[Dimension(name="date")],
                metrics=[Metric(name="totalUsers"), Metric(name="sessions")],
            )
        )
        channels_report = client.run_report(
            RunReportRequest(
                property=property_name,
                date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
                dimensions=[Dimension(name="sessionDefaultChannelGroup")],
                metrics=[Metric(name="sessions")],
                limit=6,
            )
        )
        return {
            "status": "configured",
            "totals": {
                "users": int(totals_row[0].value) if len(totals_row) > 0 else 0,
                "sessions": int(totals_row[1].value) if len(totals_row) > 1 else 0,
                "page_views": int(totals_row[2].value) if len(totals_row) > 2 else 0,
                "engaged_sessions": int(totals_row[3].value) if len(totals_row) > 3 else 0,
            },
            "top_pages": [{"page": row.dimension_values[0].value or "/", "page_views": int(row.metric_values[0].value)} for row in top_pages_report.rows],
            "time_series": [{"day": row.dimension_values[0].value, "users": int(row.metric_values[0].value), "sessions": int(row.metric_values[1].value)} for row in trend_report.rows],
            "traffic_sources": [{"channel": row.dimension_values[0].value or "Unknown", "sessions": int(row.metric_values[0].value)} for row in channels_report.rows],
        }
    except Exception as exc:
        logger.exception("Failed to fetch GA4 analytics: %s", exc)
        return {"status": "error", "reason": str(exc)}


def keyword_overlap_score(label: str, pages: list[dict[str, Any]]) -> int:
    label_tokens = set(slugify(label).split("-"))
    score = 0
    for page in pages:
        page_tokens = set(slugify(page.get("page", "")).split("-"))
        if label_tokens & page_tokens:
            score += int(page.get("page_views", 0))
    return score


def build_combined_insights(metrics: dict[str, Any], analytics: dict[str, Any]) -> dict[str, Any]:
    insights: list[str] = []
    opportunities: list[str] = []
    for item in metrics["top_opportunities"][:3]:
        opportunities.append(f"{item['theme_label']} is showing opportunity potential with lead score {item['lead_score']} and {item['priority']} priority.")
    if analytics.get("status") == "configured":
        for theme in metrics["top_themes"][:3]:
            overlap = keyword_overlap_score(theme["label"], analytics.get("top_pages", []))
            if overlap > 0:
                insights.append(f"{theme['label']} appears directionally aligned with traffic on related pages, based on keyword overlap with top visited content.")
        message_days = {item["day"]: item["total"] for item in metrics["message_volume"]}
        traffic_days = {item["day"]: item["sessions"] for item in analytics.get("time_series", [])}
        shared_days = set(message_days) & set(traffic_days)
        if shared_days:
            peak_day = max(shared_days, key=lambda day: message_days[day] + traffic_days[day])
            insights.append(f"Traffic and inbound activity both peaked around {peak_day}, which may indicate a content-driven contact moment.")
    else:
        insights.append("GA4 is not configured, so combined insights currently rely only on inbox activity.")
    if metrics["top_themes"]:
        insights.append(f"The most requested topic right now is {metrics['top_themes'][0]['label']}.")
    return {
        "summary": fallback_executive_summary(metrics) + " Combined insights are approximate and based on theme frequency plus available traffic patterns.",
        "insights": insights[:5],
        "top_opportunities": opportunities[:4],
        "most_requested_topics": [item["label"] for item in metrics["top_themes"][:5]],
        "analytics_status": analytics.get("status", "not_configured"),
    }


@app.get("/", response_class=HTMLResponse)
async def index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "sample_threads": recent_messages(6),
            "has_openai": bool(settings.openai_api_key),
            "has_smtp": bool(settings.smtp_host and settings.smtp_username and settings.smtp_password),
            "ga4_enabled": ga4_configured(),
        },
    )


@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "has_openai": bool(settings.openai_api_key),
            "has_smtp": bool(settings.smtp_host and settings.smtp_username and settings.smtp_password),
            "ga4_enabled": ga4_configured(),
        },
    )


@app.get("/api/messages")
async def list_messages(limit: int = Query(default=12, ge=1, le=100)) -> JSONResponse:
    return JSONResponse({"items": recent_messages(limit)})


@app.get("/api/threads")
async def list_threads(limit: int = Query(default=20, ge=1, le=100)) -> JSONResponse:
    return JSONResponse({"items": thread_rows(limit)})


@app.get("/api/threads/{thread_id}")
async def get_thread(thread_id: int) -> JSONResponse:
    with closing(get_connection()) as connection:
        thread = connection.execute(
            """
            SELECT
                id,
                theme_slug,
                theme_label,
                COALESCE(thread_title, title) AS thread_title,
                priority,
                COALESCE(summary, representative_summary) AS summary,
                created_at,
                updated_at,
                message_count,
                lead_score
            FROM threads
            WHERE id = ?
            """,
            (thread_id,),
        ).fetchone()
        if thread is None:
            raise HTTPException(status_code=404, detail="Thread not found.")
        messages = get_thread_messages(connection, thread_id, limit=20)
    return JSONResponse({"thread": dict(thread), "messages": messages})


@app.post("/api/inbox")
async def create_message(payload: InboxSubmission) -> JSONResponse:
    # 🔥 FIX: soportar payload tipo chat (messages[])
    is_chat_request = payload.source == CHAT_WIDGET_SOURCE
    if payload.messages:
        last_user_message = next(
            (item.get("content", "").strip() for item in reversed(payload.messages) if item.get("role") == "user" and item.get("content")),
            "",
        )
        if last_user_message:
            payload.message = last_user_message
    logger.info(
        "Inbox request received | source=%s | name=%s | email_provided=%s | company_provided=%s | message_length=%s",
        payload.source,
        payload.name,
        bool(payload.email),
        bool(payload.company),
        len(payload.message),
    )
    logger.info(
        "Inbox payload summary | payload=%s",
        {
            "name": payload.name,
            "email": payload.email,
            "company": payload.company,
            "source": payload.source,
            "message_preview": payload.message[:160],
        },
    )
    if is_chat_request:
        analysis, _ = heuristic_analysis(payload)
        chat_language = resolve_chat_language(payload)
        reply_text, engine = generate_chat_reply(payload, analysis)
        analysis = analysis.model_copy(update={"language": chat_language, "reply_text": reply_text})
    else:
        analysis, engine = openai_analysis(payload)
    logger.info(
        "Inbox analysis completed | source=%s | engine=%s | theme_slug=%s | category=%s | priority=%s",
        payload.source,
        engine,
        analysis.theme_slug,
        analysis.category,
        analysis.priority,
    )
    now = utc_now()
    with closing(get_connection()) as connection:
        try:
            thread_id = get_or_create_thread(connection, analysis)
            logger.info("Inbox SQLite save starting | thread_id=%s | database_path=%s", thread_id, settings.database_path)
            cursor = connection.execute(
                """
                INSERT INTO messages (
                    thread_id, user_name, user_email, company, source, language, category, priority, lead_score,
                    sentiment, summary, key_points_json, raw_message, reply_text, theme_label, theme_slug,
                    thread_summary, email_status, analysis_engine, created_at, sender_name, sender_email,
                    message_text, message_summary, suggested_reply, urgency_score, themes, needs_follow_up
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    thread_id,
                    payload.name,
                    payload.email,
                    payload.company,
                    payload.source,
                    analysis.language,
                    analysis.category,
                    analysis.priority,
                    analysis.lead_score,
                    analysis.sentiment,
                    analysis.summary,
                    json.dumps(analysis.key_points),
                    payload.message,
                    analysis.reply_text,
                    analysis.theme_label,
                    analysis.theme_slug,
                    "",
                    "pending",
                    engine,
                    now,
                    payload.name,
                    payload.email,
                    payload.message,
                    analysis.summary,
                    analysis.reply_text,
                    PRIORITY_RANK.get(analysis.priority, 1) * 25,
                    json.dumps([analysis.theme_label]),
                    1 if analysis.priority != "low" or analysis.lead_score >= 4 else 0,
                ),
            )
            message_id = int(cursor.lastrowid)
            logger.info("Inbox SQLite save completed | message_id=%s | thread_id=%s", message_id, thread_id)
            thread = refresh_thread_rollup(connection, thread_id, analysis)
            logger.info(
                "Inbox thread rollup refreshed | thread_id=%s | message_count=%s | priority=%s",
                thread_id,
                thread.get("message_count"),
                thread.get("priority"),
            )
            related_messages = get_thread_messages(connection, thread_id, limit=4)
            email_status = "skipped"
            try:
                logger.info("Inbox email trigger starting | message_id=%s | thread_id=%s", message_id, thread_id)
                email_status = allowed_email_status(
                    send_email_notification(message_id, payload, analysis, thread, related_messages)
                )
                logger.info("Inbox email trigger finished | message_id=%s | email_status=%s", message_id, email_status)
            except Exception as e:
                logger.exception("Email failed but continuing flow")
            connection.execute("UPDATE messages SET email_status = ? WHERE id = ?", (email_status, message_id))
            logger.info("Inbox email status updated | message_id=%s | email_status=%s", message_id, email_status)
            connection.commit()
        except sqlite3.Error as exc:
            logger.exception("Failed to save inbox message: %s", exc)
            raise HTTPException(status_code=500, detail="Unable to save inbox message right now.") from exc
        except Exception as exc:
            logger.exception("Unexpected inbox submission failure: %s", exc)
            raise HTTPException(status_code=500, detail="Unexpected inbox processing error.") from exc

        row = connection.execute(
            """
            SELECT
                m.id,
                m.thread_id,
                COALESCE(t.thread_title, t.title) AS thread_title,
                COALESCE(t.theme_slug, m.theme_slug) AS theme_slug,
                COALESCE(t.theme_label, m.theme_label) AS theme_label,
                COALESCE(m.user_name, m.sender_name) AS user_name,
                COALESCE(m.user_email, m.sender_email) AS user_email,
                m.company,
                m.source,
                m.language,
                m.category,
                m.priority,
                m.lead_score,
                m.sentiment,
                COALESCE(m.summary, m.message_summary) AS summary,
                m.key_points_json,
                COALESCE(m.raw_message, m.message_text) AS raw_message,
                m.reply_text,
                m.thread_summary,
                m.email_status,
                m.created_at
            FROM messages m
            JOIN threads t ON t.id = m.thread_id
            WHERE m.id = ?
            """,
            (message_id,),
        ).fetchone()
    if row is None:
        logger.error("Inbox submission saved but reload failed | message_id=%s", message_id)
        raise HTTPException(status_code=500, detail="Message saved but could not be reloaded.")
    response_payload = {"ok": True, "analysis_engine": engine, "message": serialize_message(row), "thread": thread, "related_messages": related_messages}
    logger.info(
        "Inbox submission completed | message_id=%s | thread_id=%s | response_keys=%s | message_keys=%s",
        response_payload["message"]["id"],
        response_payload["thread"].get("id"),
        list(response_payload.keys()),
        list(response_payload["message"].keys()),
    )
    return JSONResponse(response_payload, status_code=201)


@app.get("/api/dashboard/summary")
async def dashboard_summary() -> JSONResponse:
    with closing(get_connection()) as connection:
        metrics = dashboard_message_metrics(connection)
    metrics["executive_summary"] = generate_executive_summary(metrics)
    return JSONResponse(metrics)


@app.get("/api/dashboard/messages")
async def dashboard_messages() -> JSONResponse:
    with closing(get_connection()) as connection:
        metrics = dashboard_message_metrics(connection)
    return JSONResponse(
        {
            "recent_high_priority": metrics["recent_high_priority"],
            "highest_leads": metrics["highest_leads"],
            "message_volume": metrics["message_volume"],
            "top_opportunities": metrics["top_opportunities"],
            "most_requested_topics": metrics["recurring_interests"],
        }
    )


@app.get("/api/dashboard/metrics")
async def dashboard_metrics() -> JSONResponse:
    with closing(get_connection()) as connection:
        metrics = dashboard_chart_metrics(connection)
    return JSONResponse(metrics)


@app.get("/api/dashboard/export.xlsx")
async def dashboard_export_excel() -> StreamingResponse:
    with closing(get_connection()) as connection:
        messages = all_messages_for_export(connection)
        metrics = dashboard_chart_metrics(connection)

    workbook = Workbook()
    summary_sheet = workbook.active
    summary_sheet.title = "Summary"
    summary_sheet["A1"] = "Portfolio Inbox Dashboard Summary"
    summary_sheet["A1"].font = Font(bold=True, size=14)
    summary_sheet["A3"] = "Total messages"
    summary_sheet["B3"] = metrics["total_messages"]

    summary_sections = [
        ("By Priority", metrics["summary"]["by_priority"]),
        ("By Language", metrics["summary"]["by_language"]),
        ("By Category", metrics["summary"]["by_category"]),
        ("By Source", metrics["summary"]["by_source"]),
    ]
    current_row = 5
    for title, values in summary_sections:
        summary_sheet.cell(row=current_row, column=1, value=title).font = Font(bold=True)
        current_row += 1
        summary_sheet.cell(row=current_row, column=1, value="Label").font = Font(bold=True)
        summary_sheet.cell(row=current_row, column=2, value="Count").font = Font(bold=True)
        current_row += 1
        for label, total in values.items():
            summary_sheet.cell(row=current_row, column=1, value=label)
            summary_sheet.cell(row=current_row, column=2, value=total)
            current_row += 1
        current_row += 1

    summary_sheet.cell(row=current_row, column=1, value="Top Themes").font = Font(bold=True)
    current_row += 1
    summary_sheet.cell(row=current_row, column=1, value="Theme").font = Font(bold=True)
    summary_sheet.cell(row=current_row, column=2, value="Count").font = Font(bold=True)
    current_row += 1
    for item in metrics["top_themes"]:
        summary_sheet.cell(row=current_row, column=1, value=item["label"])
        summary_sheet.cell(row=current_row, column=2, value=item["value"])
        current_row += 1

    messages_sheet = workbook.create_sheet("Messages")
    headers = [
        "id",
        "created_at",
        "name",
        "email",
        "company",
        "source",
        "language",
        "category",
        "priority",
        "theme_label",
        "theme_slug",
        "summary",
    ]
    messages_sheet.append(headers)
    for cell in messages_sheet[1]:
        cell.font = Font(bold=True)

    for item in messages:
        messages_sheet.append(
            [
                item["id"],
                item["created_at"],
                item["user_name"],
                item["user_email"],
                item["company"],
                item["source"],
                item["language"],
                item["category"],
                item["priority"],
                item["theme_label"],
                item["theme_slug"],
                item["summary"],
            ]
        )

    for worksheet in workbook.worksheets:
        worksheet.freeze_panes = "A2"
        for column_cells in worksheet.columns:
            max_length = max(len(str(cell.value or "")) for cell in column_cells)
            worksheet.column_dimensions[column_cells[0].column_letter].width = min(max(max_length + 2, 12), 42)

    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    filename = f"portfolio-inbox-dashboard-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}.xlsx"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )


@app.get("/api/dashboard/analytics")
async def dashboard_analytics() -> JSONResponse:
    return JSONResponse(fetch_ga4_analytics())


@app.get("/api/dashboard/combined-insights")
async def dashboard_combined_insights() -> JSONResponse:
    with closing(get_connection()) as connection:
        metrics = dashboard_message_metrics(connection)
    analytics = fetch_ga4_analytics()
    return JSONResponse(build_combined_insights(metrics, analytics))


@app.get("/api/debug/email")
async def debug_email() -> JSONResponse:
    return JSONResponse(smtp_diagnostics())


@app.get("/health")
async def healthcheck() -> JSONResponse:
    smtp_info = smtp_diagnostics()
    return JSONResponse(
        {
            "status": "ok",
            "timestamp": utc_now(),
            "openai_configured": bool(settings.openai_api_key),
            "smtp_configured": smtp_info["smtp_ready"],
            "resend_configured": smtp_info["resend_ready"],
            "email_delivery_provider": smtp_info["provider"],
            "ga4_configured": ga4_configured(),
            "smtp_host": smtp_info["smtp_host"],
            "smtp_port": smtp_info["smtp_port"],
            "smtp_use_tls": smtp_info["smtp_use_tls"],
            "email_from": smtp_info["email_from"],
            "resend_from_email": smtp_info["resend_from_email"],
            "owner_email": settings.owner_email,
            "smtp_username_configured": smtp_info["smtp_username_configured"],
            "smtp_password_configured": smtp_info["smtp_password_configured"],
            "resend_api_key_configured": smtp_info["resend_api_key_configured"],
            "database_path": str(settings.database_path),
        }
    )
