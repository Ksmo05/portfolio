(function () {
  const chartRegistry = [];

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

  function safeItems(data) {
    return Array.isArray(data && data.items) ? data.items : [];
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
    container.innerHTML = "";
    if (!items || items.length === 0) {
      container.appendChild(createElement("div", "empty-state small-empty", "No data available yet."));
      return;
    }
    items.forEach((item) => {
      container.appendChild(formatter(item));
    });
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

  function renderBarChart(container, title, dataObject) {
    const block = createElement("div", "chart-card");
    block.appendChild(createElement("h3", "chart-title", title));
    const entries = Object.entries(dataObject || {});
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
      col.append(bar, createElement("span", "spark-label", item.day.slice(5)));
      container.appendChild(col);
    });
  }

  function messageCard(item) {
    const card = createElement("article", "insight-card");
    const meta = createElement("div", "thread-meta");
    meta.append(
      createElement("span", `pill priority-${item.priority}`, item.priority.toUpperCase()),
      createElement("span", "tag", item.category),
      createElement("span", "tag", `lead ${item.lead_score}`),
      createElement("span", "tag", `lang ${item.language}`)
    );
    card.append(
      meta,
      createElement("h3", "", item.thread_title),
      createElement("p", "", item.summary),
      createElement("div", "thread-footer", `${item.user_name}${item.company ? ` | ${item.company}` : ""}`)
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

  async function loadDashboard() {
    const [rawMessagesResponse, summaryResponse, messagesResponse, metricsResponse, analyticsResponse] = await Promise.all([
      fetch("/api/messages?limit=100"),
      fetch("/api/dashboard/summary"),
      fetch("/api/dashboard/messages"),
      fetch("/api/dashboard/metrics"),
      fetch("/api/dashboard/analytics"),
    ]);

    const rawMessagesData = await rawMessagesResponse.json();
    console.log("Messages API response:", rawMessagesData);
    const rawItems = safeItems(rawMessagesData);
    const summary = await summaryResponse.json();
    const messages = await messagesResponse.json();
    const metrics = await metricsResponse.json();
    const analytics = await analyticsResponse.json();
    const summaryData = summary && summary.total_messages ? summary : fallbackSummary(rawItems);
    const dashboardMessages =
      messages && (
        (Array.isArray(messages.message_volume) && messages.message_volume.length > 0) ||
        (Array.isArray(messages.top_opportunities) && messages.top_opportunities.length > 0) ||
        (Array.isArray(messages.recent_high_priority) && messages.recent_high_priority.length > 0) ||
        (Array.isArray(messages.most_requested_topics) && messages.most_requested_topics.length > 0)
      )
        ? messages
        : fallbackDashboardMessages(rawItems);

    $("executiveSummary").textContent = summaryData.executive_summary || "No summary yet.";
    $("metricTotalMessages").textContent = String(summaryData.total_messages || rawItems.length || 0);
    $("metricTopPriority").textContent = humanizeLabel(topKey(summaryData.by_priority));
    $("metricTopTheme").textContent = (summaryData.top_themes && summaryData.top_themes[0] && summaryData.top_themes[0].label) || "-";
    $("metricGaStatus").textContent =
      analytics && analytics.status === "configured"
        ? "Live"
        : analytics && analytics.status === "error"
          ? "Error"
          : "Optional";
    const metricGaDetail = $("metricGaDetail");
    if (metricGaDetail) {
      metricGaDetail.textContent =
        analytics && analytics.status === "configured"
          ? `${analytics.totals && analytics.totals.sessions ? analytics.totals.sessions : 0} sessions in the last 30 days`
          : analytics && analytics.reason
            ? analytics.reason
            : "Traffic analytics connection status";
    }

    $("priorityChart").innerHTML = "";
    $("sentimentChart").innerHTML = "";
    $("languageChart").innerHTML = "";
    $("categoryChart").innerHTML = "";

    renderBarChart($("priorityChart"), "Messages by priority", summaryData.by_priority);
    renderBarChart($("sentimentChart"), "Sentiment distribution", summaryData.by_sentiment);
    renderBarChart($("languageChart"), "Messages by language", summaryData.by_language);
    renderBarChart($("categoryChart"), "Messages by category", summaryData.by_category);
    renderSparkline($("messageVolumeChart"), dashboardMessages.message_volume || []);

    renderMetricList($("topThemesList"), summaryData.top_themes || [], function (item) {
      const row = createElement("div", "list-row");
      row.append(createElement("strong", "", item.label), createElement("span", "tag", `${item.total} messages`));
      return row;
    });

    renderMetricList($("requestedTopicsList"), dashboardMessages.most_requested_topics || [], function (item) {
      const row = createElement("div", "list-row");
      row.append(createElement("strong", "", item.label || item), createElement("span", "tag", `${item.total || ""}`.trim()));
      return row;
    });
    renderMetricList(
      $("sourceActivityList"),
      (metrics.distribution && metrics.distribution.source) ||
        Object.entries(summaryData.by_source || {}).map(function ([label, value]) {
          return { label, value };
        }),
      sourceActivityRow
    );
    renderGaSnapshot($("gaTrafficList"), analytics);

    renderMetricList($("topOpportunitiesList"), dashboardMessages.top_opportunities || [], messageCard);
    renderMetricList($("recentHighPriorityList"), dashboardMessages.recent_high_priority || [], messageCard);

    const priorityFilter = $("filterPriority");
    const sourceFilter = $("filterSource");
    const languageFilter = $("filterLanguage");
    const searchFilter = $("filterSearch");
    const recentMessagesTable = $("recentMessagesTable");
    const recentMessagesCount = $("recentMessagesCount");

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

    destroyCharts();
    createDonutChart("priorityDonutChart", metrics.distribution && metrics.distribution.priority);
    createDonutChart("languageDonutChart", metrics.distribution && metrics.distribution.language);
    createDonutChart("sourceDonutChart", metrics.distribution && metrics.distribution.source);
    createBarChart("dailyVolumeBarChart", metrics.messages_per_day || [], "#58d4c7");
    createBarChart("themeBarChart", metrics.top_themes || [], "#7aa2ff");
    createBarChart("categoryBarChart", metrics.distribution && metrics.distribution.category, "#ffd166");

    const exportPdfButton = $("exportPdfButton");
    if (exportPdfButton && !exportPdfButton.dataset.bound) {
      exportPdfButton.dataset.bound = "true";
      exportPdfButton.addEventListener("click", function () {
        window.print();
      });
    }
  }

  loadDashboard().catch(function () {
    $("executiveSummary").textContent = "The dashboard could not be loaded right now.";
  });
})();
