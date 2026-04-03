(function () {
  const widget = document.getElementById("inboxWidget");
  const toggleButton = document.getElementById("toggleWidget");
  const openInlineButton = document.getElementById("openWidgetInline");
  const closeButton = document.getElementById("closeWidget");
  const refreshButton = document.getElementById("refreshFeed");
  const form = document.getElementById("inboxForm");
  const feedback = document.getElementById("formFeedback");
  const threadFeed = document.getElementById("threadFeed");
  const resultPanel = document.getElementById("resultPanel");
  const analysisGrid = document.getElementById("analysisGrid");
  const replyText = document.getElementById("replyText");
  const keyPointsList = document.getElementById("keyPointsList");
  const threadSummary = document.getElementById("threadSummary");
  const resetFormButton = document.getElementById("resetForm");
  const submitButton = document.getElementById("submitButton");

  function setWidgetOpen(isOpen) {
    widget.hidden = !isOpen;
    toggleButton.textContent = isOpen ? "Close inbox" : "Open inbox";
  }

  function setFeedback(message, mode) {
    feedback.textContent = message;
    feedback.className = "form-feedback";
    if (mode) {
      feedback.classList.add(`is-${mode}`);
    }
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function formatDate(isoString) {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(isoString));
    } catch (error) {
      return isoString;
    }
  }

  function renderFeed(items) {
    threadFeed.innerHTML = "";
    if (!items || items.length === 0) {
      threadFeed.appendChild(
        createElement(
          "div",
          "empty-state",
          "No inbox activity yet. Use the widget to generate bilingual message insights."
        )
      );
      return;
    }

    items.forEach((item) => {
      const card = createElement("article", "thread-card");
      const meta = createElement("div", "thread-meta");
      meta.append(
        createElement("span", `pill priority-${item.priority}`, item.priority.toUpperCase()),
        createElement("span", "tag", item.category),
        createElement("span", "tag", `lang: ${item.language}`),
        createElement("span", "tag", `lead: ${item.lead_score}`)
      );

      const title = createElement("h3", "", item.thread_title);
      const summary = createElement("p", "", item.summary);
      const tags = createElement("div", "tag-row");
      tags.appendChild(createElement("span", "tag", item.theme_label || item.theme_slug));

      const footer = createElement(
        "div",
        "thread-footer",
        `${item.user_name}${item.company ? ` | ${item.company}` : ""} | ${formatDate(item.created_at)}`
      );
      card.append(meta, title, summary, tags, footer);
      threadFeed.appendChild(card);
    });
  }

  function renderResult(result) {
    const message = result.message;
    const thread = result.thread;
    resultPanel.hidden = false;
    analysisGrid.innerHTML = "";

    [
      ["Detected language", message.language],
      ["Category", message.category],
      ["Priority", message.priority],
      ["Theme", message.theme_label || message.theme_slug],
      ["Lead score", String(message.lead_score)],
      ["Thread", thread.thread_title || message.thread_title],
    ].forEach(([label, value]) => {
      const item = createElement("div", "analysis-item");
      item.append(createElement("span", "analysis-label", label), createElement("strong", "", value));
      analysisGrid.appendChild(item);
    });

    replyText.textContent = message.reply_text || "";
    threadSummary.textContent = thread.summary || message.thread_summary || "";
    keyPointsList.innerHTML = "";
    (message.key_points || []).forEach((point) => {
      keyPointsList.appendChild(createElement("li", "", point));
    });
  }

  function resetResultState() {
    resultPanel.hidden = true;
    analysisGrid.innerHTML = "";
    keyPointsList.innerHTML = "";
    replyText.textContent = "";
    threadSummary.textContent = "";
  }

  async function loadMessages() {
    try {
      const response = await fetch("/api/messages?limit=8");
      if (!response.ok) {
        throw new Error("Could not load inbox activity.");
      }
      const payload = await response.json();
      renderFeed(payload.items || []);
    } catch (error) {
      renderFeed([]);
      setFeedback(error.message, "error");
    }
  }

  async function submitForm(event) {
    event.preventDefault();
    resetResultState();
    setFeedback("Analyzing your message, detecting language, and routing it into the right thread...", null);
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim() || null,
      company: String(formData.get("company") || "").trim() || null,
      message: String(formData.get("message") || "").trim(),
      source: "portfolio-widget",
    };

    if (payload.name.length < 2 || payload.message.length < 12) {
      setFeedback("Please include your name and a message with enough detail to analyze.", "error");
      submitButton.disabled = false;
      submitButton.textContent = "Send to AI inbox";
      return;
    }

    try {
      const response = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Something went wrong while saving your message.");
      }

      renderResult(result);
      form.reset();
      setFeedback(
        `Message received and analyzed with ${result.analysis_engine === "openai" ? "OpenAI" : "fallback"} processing.`,
        "success"
      );
      await loadMessages();
    } catch (error) {
      setFeedback(error.message, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send to AI inbox";
    }
  }

  toggleButton.addEventListener("click", function () {
    setWidgetOpen(widget.hidden);
  });
  openInlineButton.addEventListener("click", function () {
    setWidgetOpen(true);
  });
  closeButton.addEventListener("click", function () {
    setWidgetOpen(false);
  });
  refreshButton.addEventListener("click", loadMessages);
  form.addEventListener("submit", submitForm);
  resetFormButton.addEventListener("click", function () {
    resetResultState();
    setFeedback("Ready for another message.", null);
  });

  const initialRaw = threadFeed.getAttribute("data-initial-items");
  if (initialRaw) {
    try {
      renderFeed(JSON.parse(initialRaw));
    } catch (error) {
      renderFeed([]);
    }
  } else {
    renderFeed([]);
  }
})();
