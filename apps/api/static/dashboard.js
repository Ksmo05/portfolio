(function () {
  const chartRegistry = [];
  let geoChartLoadedPromise = null;

  function $(id) {
    return document.getElementById(id);
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

  function setText(id, value) {
    const node = $(id);
    if (!node) return;
    node.textContent = value;
  }

  function setHtml(id, value) {
    const node = $(id);
    if (!node) return;
    node.innerHTML = value;
  }

  function safeItems(data) {
    return Array.isArray(data && data.items) ? data.items : [];
  }

  async function fetchJsonOrNull(url) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        console.warn("[dashboard] endpoint returned non-2xx", { url, status: response.status, data });
        return null;
      }
      return data;
    } catch (error) {
      console.warn("[dashboard] endpoint failed", { url, error });
      return null;
    }
  }

  function countBy(items, key) {
    return items.reduce((acc, item) => {
      const value = item && item[key];
      if (typeof value === "string" && value) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {});
  }

  function topKey(dataObject) {
    return Object.entries(dataObject || {})
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        return String(a[0]).localeCompare(String(b[0]));
      })
      .map((entry) => entry[0])[0] || "-";
  }

  function humanizeLabel(value) {
    if (!value) return "-";
    return String(value)
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
  }

  function formatMessageDate(value) {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value).slice(0, 10);
    }
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  }

  function messageSearchBlob(item) {
    return [
      item.user_name,
      item.user_email,
      item.company,
      item.summary,
      item.thread_title,
      item.theme_label,
      item.theme_slug,
      item.source,
      item.category,
      item.language,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function buildFilterOptions(items, key, preferredOrder) {
    const values = Array.from(
      new Set(
        items
          .map((item) => item && item[key])
          .filter((value) => typeof value === "string" && value)
      )
    );

    if (Array.isArray(preferredOrder) && preferredOrder.length > 0) {
      const ordered = preferredOrder.filter((value) => values.includes(value));
      const remaining = values.filter((value) => !ordered.includes(value)).sort();
      return [...ordered, ...remaining];
    }

    return values.sort();
  }

  function setSelectOptions(select, values, formatter) {
    if (!select) return;
    const firstOption = select.querySelector("option");
    select.innerHTML = "";
    if (firstOption) {
      select.appendChild(firstOption);
    }
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = formatter ? formatter(value) : value;
      select.appendChild(option);
    });
  }

  function buildTopThemes(items) {
    const counts = items.reduce((acc, item) => {
      const label = item.theme_label || item.theme_slug;
      if (typeof label === "string" && label) {
        acc[label] = (acc[label] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([label, total]) => ({ label, total }))
      .sort((a, b) => b.total - a.total);
  }

  function buildMessageVolume(items) {
    const counts = items.reduce((acc, item) => {
      const rawDate = typeof item.created_at === "string" ? item.created_at : "";
      const day = rawDate.slice(0, 10);
      if (day) {
        acc[day] = (acc[day] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([day, total]) => ({ day, total }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }

  function sortByLeadAndDate(items) {
    return [...items].sort((a, b) => {
      const leadDiff = (Number(b.lead_score) || 0) - (Number(a.lead_score) || 0);
      if (leadDiff !== 0) {
        return leadDiff;
      }
      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });
  }

  function fallbackSummary(items) {
    const topThemes = buildTopThemes(items);
    return {
      total_messages: items.length,
      by_priority: countBy(items, "priority"),
      by_sentiment: countBy(items, "sentiment"),
      by_language: countBy(items, "language"),
      by_category: countBy(items, "category"),
      by_source: countBy(items, "source"),
      top_themes: topThemes,
      executive_summary:
        items.length > 0
          ? `The inbox has captured ${items.length} recent messages.`
          : "No summary yet.",
    };
  }

  function fallbackDashboardMessages(items) {
    const topThemes = buildTopThemes(items);
    return {
      message_volume: buildMessageVolume(items),
      top_opportunities: sortByLeadAndDate(items).slice(0, 5),
      recent_high_priority: items
        .filter((item) => item.priority === "high")
        .sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")))
        .slice(0, 6),
      most_requested_topics: topThemes.slice(0, 4),
    };
  }

  function renderMetricList(container, items, formatter) {
    if (!container) return;
    container.innerHTML = "";
    if (!items || items.length === 0) {
      container.appendChild(createElement("div", "empty-state small-empty", "No data available yet."));
      return;
    }
    items.forEach((item) => {
      container.appendChild(formatter(item));
    });
  }

  function renderCountMapList(container, counts, formatter) {
    if (!container) return;
    const items = Object.entries(counts || {})
      .map(function ([label, total]) {
        return { label, total };
      })
      .sort(function (a, b) {
        if (b.total !== a.total) {
          return b.total - a.total;
        }
        return String(a.label).localeCompare(String(b.label));
      });

    renderMetricList(container, items, function (item) {
      const row = createElement("div", "list-row");
      row.append(
        createElement("strong", "", formatter ? formatter(item.label) : humanizeLabel(item.label)),
        createElement("span", "tag", `${item.total}`)
      );
      return row;
    });
  }

  function formatShortDayLabel(value) {
    if (!value) return "-";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return String(value).slice(5);
    }
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(parsed);
  }

  function sourceActivityRow(item) {
    const row = createElement("div", "list-row");
    row.append(
      createElement("strong", "", humanizeLabel(item.label || item.source || "unknown")),
      createElement("span", "tag", `${item.value ?? item.total ?? 0} messages`)
    );
    return row;
  }

  function gaSnapshotRow(label, value) {
    const row = createElement("div", "list-row");
    row.append(createElement("strong", "", label), createElement("span", "tag", value));
    return row;
  }

  function renderGaSnapshot(container, analytics) {
    if (!container) return;
    container.innerHTML = "";
    if (!analytics || analytics.status !== "configured") {
      const reason = analytics && analytics.reason ? analytics.reason : "GA4 is not configured yet.";
      container.appendChild(createElement("div", "empty-state small-empty", reason));
      return;
    }

    const totals = analytics.totals || {};
    container.appendChild(gaSnapshotRow("Sessions", String(totals.sessions || 0)));
    container.appendChild(gaSnapshotRow("Users", String(totals.users || 0)));
    container.appendChild(gaSnapshotRow("Page views", String(totals.page_views || 0)));
    const topPage = analytics.top_pages && analytics.top_pages[0] ? analytics.top_pages[0].page : "/";
    container.appendChild(gaSnapshotRow("Top page", topPage));
  }

  function renderGaMetricStrip(container, analytics) {
    if (!container) return;
    container.innerHTML = "";
    if (!analytics || analytics.status !== "configured") {
      container.appendChild(createElement("div", "empty-state small-empty", "GA4 metrics are not available right now."));
      return;
    }

    const totals = analytics.totals || {};
    [
      { label: "Active users", value: String(totals.users || 0) },
      { label: "Sessions", value: String(totals.sessions || 0) },
      { label: "Views", value: String(totals.page_views || 0) },
      { label: "Engaged", value: String(totals.engaged_sessions || 0) },
    ].forEach(function (item) {
      const card = createElement("div", "ga4-metric-card");
      card.append(createElement("span", "section-kicker", item.label), createElement("strong", "", item.value));
      container.appendChild(card);
    });
  }

  function renderGaCountriesTable(container, analytics) {
    if (!container) return;
    container.innerHTML = "";
    if (!analytics || analytics.status !== "configured" || !Array.isArray(analytics.countries) || analytics.countries.length === 0) {
      container.appendChild(createElement("div", "empty-state small-empty", "No country-level GA4 data available yet."));
      return;
    }

    analytics.countries.forEach(function (item, index) {
      const row = createElement("div", "ga4-country-row");
      const meta = createElement("div", "ga4-country-meta");
      meta.append(
        createElement("span", "ga4-country-rank", `#${index + 1}`),
        createElement("strong", "", item.country || "Unknown")
      );
      row.append(meta, createElement("span", "tag", `${item.active_users || 0} active users`));
      container.appendChild(row);
    });
  }

  function loadGeoChartLibrary() {
    if (geoChartLoadedPromise) {
      return geoChartLoadedPromise;
    }

    geoChartLoadedPromise = new Promise(function (resolve, reject) {
      if (!window.google || !window.google.charts) {
        reject(new Error("google charts loader unavailable"));
        return;
      }
      window.google.charts.load("current", {
        packages: ["geochart"],
      });
      window.google.charts.setOnLoadCallback(resolve);
    });

    return geoChartLoadedPromise;
  }

  async function renderGaCountriesMap(container, analytics) {
    if (!container) return;
    container.innerHTML = "";

    if (!analytics || analytics.status !== "configured" || !Array.isArray(analytics.countries) || analytics.countries.length === 0) {
      container.appendChild(createElement("div", "empty-state", "No GA4 geography data available yet."));
      return;
    }

    const chartRoot = createElement("div", "ga4-map-chart");
    container.appendChild(chartRoot);

    try {
      await loadGeoChartLibrary();
      const dataTable = window.google.visualization.arrayToDataTable([
        ["Country", "Active users"],
        ...analytics.countries.map(function (item) {
          return [item.country || "Unknown", Number(item.active_users) || 0];
        }),
      ]);
      const chart = new window.google.visualization.GeoChart(chartRoot);
      chart.draw(dataTable, {
        backgroundColor: "transparent",
        datalessRegionColor: "#e6eef8",
        defaultColor: "#cfe0ff",
        colorAxis: {
          colors: ["#9fd7ff", "#2b70ff"],
        },
        legend: "none",
      });
    } catch (error) {
      console.warn("[dashboard] geo chart unavailable", error);
      container.innerHTML = "";
      container.appendChild(createElement("div", "empty-state", "Geography view is not available right now."));
    }
  }

  function renderBarChart(container, title, dataObject) {
    if (!container) return;
    container.innerHTML = "";
    const block = createElement("div", "chart-card");
    block.appendChild(createElement("h3", "chart-title", title));
    const entries = Object.entries(dataObject || {}).sort(function (a, b) {
      if (b[1] !== a[1]) return b[1] - a[1];
      return String(a[0]).localeCompare(String(b[0]));
    });
    if (entries.length === 0) {
      block.appendChild(createElement("div", "empty-state small-empty", "No data yet."));
      container.appendChild(block);
      return;
    }

    const max = Math.max(...entries.map((entry) => entry[1]), 1);
    entries.forEach(([label, value]) => {
      const row = createElement("div", "bar-row");
      const rowHead = createElement("div", "bar-row-head");
      rowHead.append(createElement("span", "", label), createElement("strong", "", String(value)));
      const bar = createElement("div", "bar-track");
      const fill = createElement("div", "bar-fill");
      fill.style.width = `${(value / max) * 100}%`;
      bar.appendChild(fill);
      row.append(rowHead, bar);
      block.appendChild(row);
    });
    container.appendChild(block);
  }

  function renderSparkline(container, items) {
    if (!container) return;
    container.innerHTML = "";
    if (!items || items.length === 0) {
      container.appendChild(createElement("div", "empty-state small-empty", "No trend data yet."));
      return;
    }
    const max = Math.max(...items.map((item) => item.total), 1);
    items.forEach((item) => {
      const col = createElement("div", "spark-col");
      const bar = createElement("div", "spark-bar");
      bar.style.height = `${Math.max((item.total / max) * 120, 10)}px`;
      col.append(bar, createElement("span", "spark-label", formatShortDayLabel(item.day)));
      container.appendChild(col);
    });
  }

  function messageCard(item) {
    const priority = String(item && item.priority ? item.priority : "low").toLowerCase();
    const category = String(item && item.category ? item.category : "general");
    const leadScore = Number(item && item.lead_score ? item.lead_score : 0);
    const language = String(item && item.language ? item.language : "unknown");
    const summary = item && item.summary ? item.summary : "No summary available";
    const threadTitle = item && item.thread_title ? item.thread_title : "Inbox message";
    const userName = item && item.user_name ? item.user_name : "Website visitor";
    const company = item && item.company ? item.company : "";

    const card = createElement("article", "insight-card");
    const meta = createElement("div", "thread-meta");
    meta.append(
      createElement("span", `pill priority-${priority}`, priority.toUpperCase()),
      createElement("span", "tag", category),
      createElement("span", "tag", `lead ${leadScore}`),
      createElement("span", "tag", `lang ${language}`)
    );
    card.append(
      meta,
      createElement("h3", "", threadTitle),
      createElement("p", "", summary),
      createElement("div", "thread-footer", `${userName}${company ? ` | ${company}` : ""}`)
    );
    return card;
  }

  function destroyCharts() {
    while (chartRegistry.length > 0) {
      const chart = chartRegistry.pop();
      if (chart) {
        chart.destroy();
      }
    }
  }

  function chartPalette(count) {
    const base = [
      "#58d4c7",
      "#ffd166",
      "#7aa2ff",
      "#ff8a80",
      "#9bdb7c",
      "#d8a8ff",
      "#7de2d1",
      "#ffb86b",
    ];
    return Array.from({ length: count }, function (_, index) {
      return base[index % base.length];
    });
  }

  function chartLabels(items) {
    return (items || []).map(function (item) {
      return humanizeLabel(item.label || "unknown");
    });
  }

  function chartValues(items) {
    return (items || []).map(function (item) {
      return Number(item.value) || 0;
    });
  }

  function createDonutChart(canvasId, items) {
    const canvas = $(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    const labels = chartLabels(items);
    const values = chartValues(items);
    chartRegistry.push(
      new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: chartPalette(values.length),
              borderColor: "rgba(8, 17, 31, 0.9)",
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#c8d6ea",
                boxWidth: 12,
                padding: 18,
              },
            },
          },
        },
      })
    );
  }

  function createBarChart(canvasId, items, color) {
    const canvas = $(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    const labels = chartLabels(items);
    const values = chartValues(items);
    chartRegistry.push(
      new Chart(canvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: color || "#58d4c7",
              borderRadius: 10,
              maxBarThickness: 34,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: "#9fb2cb" },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "#9fb2cb",
                precision: 0,
              },
              grid: {
                color: "rgba(159, 178, 203, 0.12)",
              },
            },
          },
        },
      })
    );
  }

  function createLineChart(canvasId, items, color) {
    const canvas = $(canvasId);
    if (!canvas || typeof Chart === "undefined") return;
    const labels = chartLabels(items);
    const values = chartValues(items);
    chartRegistry.push(
      new Chart(canvas, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              borderColor: color || "#2b70ff",
              backgroundColor: "rgba(43, 112, 255, 0.12)",
              tension: 0.3,
              fill: true,
              pointRadius: 3,
              pointHoverRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: { color: "#9fb2cb" },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "#9fb2cb",
                precision: 0,
              },
              grid: {
                color: "rgba(159, 178, 203, 0.12)",
              },
            },
          },
        },
      })
    );
  }

  function tableHeadCell(text) {
    return createElement("span", "table-cell", text);
  }

  function renderRecentMessages(container, items) {
    container.innerHTML = "";
    if (!items || items.length === 0) {
      container.appendChild(createElement("div", "empty-state", "No messages match the current filters."));
      return;
    }

    const head = createElement("div", "table-row is-head");
    head.append(
      tableHeadCell("Contact"),
      tableHeadCell("Priority"),
      tableHeadCell("Source"),
      tableHeadCell("Language"),
      tableHeadCell("Date"),
      tableHeadCell("Message")
    );
    container.appendChild(head);

    items.forEach((item) => {
      const row = createElement("article", "table-row");

      const contactCell = createElement("div", "table-cell table-primary");
      contactCell.append(
        createElement("strong", "", item.user_name || "Website visitor"),
        createElement("p", "table-meta-line", item.company || item.user_email || "No company or email"),
        createElement("p", "table-meta-line", item.thread_title || item.theme_label || "General inquiry")
      );

      const priorityCell = createElement("div", "table-cell");
      priorityCell.appendChild(createElement("span", `pill priority-${item.priority || "low"}`, humanizeLabel(item.priority || "low")));

      const sourceCell = createElement("div", "table-cell table-chip-stack");
      sourceCell.appendChild(createElement("span", "tag is-source", humanizeLabel(item.source || "unknown")));
      if (item.category) {
        sourceCell.appendChild(createElement("span", "tag", humanizeLabel(item.category)));
      }

      const languageCell = createElement("div", "table-cell table-chip-stack");
      languageCell.appendChild(createElement("span", "tag is-language", String(item.language || "en").toUpperCase()));
      if (item.theme_label) {
        languageCell.appendChild(createElement("span", "tag", item.theme_label));
      }

      const dateCell = createElement("div", "table-cell");
      dateCell.appendChild(createElement("span", "tag is-date", formatMessageDate(item.created_at)));

      const messageCell = createElement("div", "table-cell table-primary");
      messageCell.append(
        createElement("strong", "", item.summary || "No summary available"),
        createElement("p", "table-meta-line", item.raw_message || "")
      );

      row.append(contactCell, priorityCell, sourceCell, languageCell, dateCell, messageCell);
      container.appendChild(row);
    });
  }

  function isChatSource(value) {
    return String(value || "").toLowerCase().includes("chat");
  }

  function fallbackChatAnalytics(rawItems) {
    const byLanguage = { es: 0, en: 0, unknown: 0 };
    const dailyTotals = {};

    (rawItems || []).forEach(function (item) {
      const language = String(item && item.language ? item.language : "unknown").toLowerCase();
      if (!byLanguage[language]) {
        byLanguage[language] = 0;
      }
      byLanguage[language] += 1;
      const day = String(item && item.created_at ? item.created_at : "").slice(0, 10);
      if (day) {
        dailyTotals[day] = (dailyTotals[day] || 0) + 1;
      }
    });

    const dailyInteractions = Object.entries(dailyTotals)
      .map(function ([day, total]) {
        return { day: day, total: total };
      })
      .sort(function (a, b) {
        return String(a.day).localeCompare(String(b.day));
      })
      .slice(-14);

    return {
      total_interactions: (rawItems || []).length,
      by_language: byLanguage,
      spanish_interactions: byLanguage.es || 0,
      english_interactions: byLanguage.en || 0,
      daily_interactions: dailyInteractions,
    };
  }

  function setCardVisible(id, visible) {
    const node = $(id);
    if (!node) return;
    node.hidden = !visible;
  }

  function hasPositiveValues(items) {
    return Array.isArray(items) && items.some(function (item) {
      return Number(item && item.value) > 0;
    });
  }

  async function loadDashboard() {
    const [rawMessagesData, messages, analytics] = await Promise.all([
      fetchJsonOrNull("/api/messages?limit=100"),
      fetchJsonOrNull("/api/dashboard/messages"),
      fetchJsonOrNull("/api/dashboard/analytics"),
    ]);

    const rawItems = safeItems(rawMessagesData).filter(function (item) {
      return isChatSource(item && item.source);
    });

    console.debug("[dashboard] loaded chat + ga4 dataset", {
      rawCount: rawItems.length,
      rawSources: rawMessagesData && rawMessagesData.sources ? rawMessagesData.sources : {},
      gaStatus: analytics && analytics.status ? analytics.status : "unknown",
      databasePath: rawMessagesData && rawMessagesData.database_path ? rawMessagesData.database_path : "unknown",
    });

    renderGaMetricStrip($("gaTopMetrics"), analytics);
    renderGaCountriesTable($("gaCountriesTable"), analytics);
    await renderGaCountriesMap($("gaCountriesMap"), analytics);
    const gaCountriesPeriod = $("gaCountriesPeriod");
    if (gaCountriesPeriod) {
      gaCountriesPeriod.textContent =
        analytics && analytics.status === "configured" && analytics.countries_period_label
          ? analytics.countries_period_label
          : "Last 7 days";
    }

    const chatAnalytics =
      messages && messages.chat_analytics
        ? messages.chat_analytics
        : fallbackChatAnalytics(rawItems);

    const totalChatInteractions = Number(chatAnalytics.total_interactions || 0);
    const chatSpanish = Number(chatAnalytics.spanish_interactions || 0);
    const chatEnglish = Number(chatAnalytics.english_interactions || 0);
    const chatHighPriority = rawItems.filter(function (item) {
      return String(item && item.priority ? item.priority : "").toLowerCase() === "high";
    }).length;
    const leadScores = rawItems
      .map(function (item) {
        return Number(item && item.lead_score ? item.lead_score : 0);
      })
      .filter(function (value) {
        return Number.isFinite(value) && value > 0;
      });
    const chatAvgLead = leadScores.length
      ? leadScores.reduce(function (acc, value) {
          return acc + value;
        }, 0) / leadScores.length
      : 0;

    const gaSessions30d = Number(analytics && analytics.totals ? analytics.totals.sessions || 0 : 0);
    const gaUsers30d = Number(analytics && analytics.totals ? analytics.totals.users || 0 : 0);

    setText("chatAnalyticsCount", `${totalChatInteractions} chat interactions`);
    setText("chatTotalInteractions", String(totalChatInteractions));
    setText("chatSpanishInteractions", String(chatSpanish));
    setText("chatEnglishInteractions", String(chatEnglish));
    setText("chatHighPriorityInteractions", String(chatHighPriority));
    setText("chatAvgLeadScore", chatAvgLead.toFixed(1));
    setText("gaSessions30d", String(gaSessions30d));
    setText("gaUsers30d", String(gaUsers30d));

    setCardVisible("kpiChatTotalCard", totalChatInteractions > 0);
    setCardVisible("kpiChatEsCard", chatSpanish > 0);
    setCardVisible("kpiChatEnCard", chatEnglish > 0);
    setCardVisible("kpiChatHighPriorityCard", chatHighPriority > 0);
    setCardVisible("kpiChatAvgLeadCard", chatAvgLead > 0);
    setCardVisible("kpiGaSessionsCard", gaSessions30d > 0);
    setCardVisible("kpiGaUsersCard", gaUsers30d > 0);

    const gaHasMetrics = gaSessions30d > 0 || gaUsers30d > 0;
    const gaHasCountries = !!(
      analytics &&
      analytics.status === "configured" &&
      Array.isArray(analytics.countries) &&
      analytics.countries.length > 0
    );
    setCardVisible("ga4AnalyticsCard", gaHasMetrics || gaHasCountries);

    destroyCharts();
    const chatDailyItems = Array.isArray(chatAnalytics.daily_interactions)
      ? chatAnalytics.daily_interactions.map(function (item) {
          return {
            label: formatShortDayLabel(item.day),
            value: item.total || 0,
          };
        })
      : [];
    const showChatDaily = hasPositiveValues(chatDailyItems);
    setCardVisible("chatOverviewCard", totalChatInteractions > 0);
    setCardVisible("chatDailyChartCard", showChatDaily);
    if (showChatDaily) {
      createBarChart("chatDailyBarChart", chatDailyItems, "#5da8ff");
    }

    const chatByLanguage = chatAnalytics.by_language || {};
    const chatLanguageItems = [
      { label: "es", value: Number(chatByLanguage.es || chatSpanish || 0) },
      { label: "en", value: Number(chatByLanguage.en || chatEnglish || 0) },
      { label: "other", value: Number(chatByLanguage.unknown || 0) },
    ];
    const gaTrafficItems = Array.isArray(analytics && analytics.traffic_sources)
      ? analytics.traffic_sources.map(function (item) {
          return {
            label: item.channel || "unknown",
            value: Number(item.sessions || 0),
          };
        })
      : [];
    const gaTrendItems = Array.isArray(analytics && analytics.time_series)
      ? analytics.time_series.map(function (item) {
          return {
            label: formatShortDayLabel(String(item.day || "")),
            value: Number(item.sessions || 0),
          };
        })
      : [];

    const showChatLanguageChart = hasPositiveValues(chatLanguageItems);
    const showGaTrafficChart = hasPositiveValues(gaTrafficItems);
    const showGaTrendChart = hasPositiveValues(gaTrendItems);
    const showQuantifiedInsights = showChatLanguageChart || showGaTrafficChart || showGaTrendChart;

    setCardVisible("quantifiedInsightsCard", showQuantifiedInsights);
    setCardVisible("chatLanguageChartCard", showChatLanguageChart);
    setCardVisible("gaTrafficSourcesChartCard", showGaTrafficChart);
    setCardVisible("gaSessionsTrendChartCard", showGaTrendChart);

    if (showChatLanguageChart) {
      createDonutChart("chatLanguageDonutChart", chatLanguageItems);
    }
    if (showGaTrafficChart) {
      createBarChart("gaTrafficSourcesBarChart", gaTrafficItems, "#2b70ff");
    }
    if (showGaTrendChart) {
      createLineChart("gaSessionsTrendChart", gaTrendItems, "#24b4a3");
    }

    const priorityFilter = $("filterPriority");
    const sourceFilter = $("filterSource");
    const languageFilter = $("filterLanguage");
    const searchFilter = $("filterSearch");
    const recentMessagesTable = $("recentMessagesTable");
    const recentMessagesCount = $("recentMessagesCount");

    if (priorityFilter && sourceFilter && languageFilter && searchFilter && recentMessagesTable && recentMessagesCount) {
      setSelectOptions(priorityFilter, buildFilterOptions(rawItems, "priority", ["high", "medium", "low"]), humanizeLabel);
      setSelectOptions(sourceFilter, buildFilterOptions(rawItems, "source"), humanizeLabel);
      setSelectOptions(languageFilter, buildFilterOptions(rawItems, "language", ["en", "es"]), function (value) {
        return String(value).toUpperCase();
      });

      function applyFilters() {
        const filteredItems = rawItems.filter((item) => {
          const matchesPriority = !priorityFilter.value || item.priority === priorityFilter.value;
          const matchesSource = !sourceFilter.value || item.source === sourceFilter.value;
          const matchesLanguage = !languageFilter.value || item.language === languageFilter.value;
          const matchesSearch = !searchFilter.value || messageSearchBlob(item).includes(searchFilter.value.trim().toLowerCase());
          return matchesPriority && matchesSource && matchesLanguage && matchesSearch;
        });

        recentMessagesCount.textContent = `${filteredItems.length} shown`;
        renderRecentMessages(recentMessagesTable, filteredItems.slice(0, 24));
      }

      [priorityFilter, sourceFilter, languageFilter].forEach((element) => {
        element.addEventListener("change", applyFilters);
      });
      searchFilter.addEventListener("input", applyFilters);
      applyFilters();
    }

    const exportPdfButton = $("exportPdfButton");
    if (exportPdfButton && !exportPdfButton.dataset.bound) {
      exportPdfButton.dataset.bound = "true";
      exportPdfButton.addEventListener("click", function () {
        window.print();
      });
    }
  }

  loadDashboard().catch(function () {
    setText("chatAnalyticsCount", "Dashboard unavailable");
  });
})();
