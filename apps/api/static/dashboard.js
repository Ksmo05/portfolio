(function () {
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

  async function loadDashboard() {
    const [summaryResponse, messagesResponse, analyticsResponse, combinedResponse] = await Promise.all([
      fetch("/api/dashboard/summary"),
      fetch("/api/dashboard/messages"),
      fetch("/api/dashboard/analytics"),
      fetch("/api/dashboard/combined-insights"),
    ]);

    const summary = await summaryResponse.json();
    const messages = await messagesResponse.json();
    const analytics = await analyticsResponse.json();
    const combined = await combinedResponse.json();

    $("executiveSummary").textContent = summary.executive_summary || "No summary yet.";
    $("metricTotalMessages").textContent = String(summary.total_messages || 0);
    $("metricTopPriority").textContent = Object.keys(summary.by_priority || {})[0] || "-";
    $("metricTopTheme").textContent = (summary.top_themes && summary.top_themes[0] && summary.top_themes[0].label) || "-";
    $("metricGaStatus").textContent = analytics.status === "configured" ? "Live" : "Optional";

    $("priorityChart").innerHTML = "";
    $("sentimentChart").innerHTML = "";
    $("languageChart").innerHTML = "";
    $("categoryChart").innerHTML = "";

    renderBarChart($("priorityChart"), "Messages by priority", summary.by_priority);
    renderBarChart($("sentimentChart"), "Sentiment distribution", summary.by_sentiment);
    renderBarChart($("languageChart"), "Messages by language", summary.by_language);
    renderBarChart($("categoryChart"), "Messages by category", summary.by_category);
    renderSparkline($("messageVolumeChart"), messages.message_volume || []);

    renderMetricList($("topThemesList"), summary.top_themes || [], function (item) {
      const row = createElement("div", "list-row");
      row.append(createElement("strong", "", item.label), createElement("span", "tag", `${item.total} messages`));
      return row;
    });

    renderMetricList($("requestedTopicsList"), messages.most_requested_topics || [], function (item) {
      const row = createElement("div", "list-row");
      row.append(createElement("strong", "", item.label || item), createElement("span", "tag", `${item.total || ""}`.trim()));
      return row;
    });

    renderMetricList($("topOpportunitiesList"), messages.top_opportunities || [], messageCard);
    renderMetricList($("recentHighPriorityList"), messages.recent_high_priority || [], messageCard);

    $("analyticsStatusChip").textContent = analytics.status || "not_configured";
    const analyticsSummary = $("analyticsSummary");
    analyticsSummary.innerHTML = "";
    if (analytics.status === "configured") {
      analyticsSummary.append(
        createElement("div", "analytics-metric", `Users: ${analytics.totals.users}`),
        createElement("div", "analytics-metric", `Sessions: ${analytics.totals.sessions}`),
        createElement("div", "analytics-metric", `Page views: ${analytics.totals.page_views}`),
        createElement("div", "analytics-metric", `Engaged sessions: ${analytics.totals.engaged_sessions}`)
      );
    } else {
      analyticsSummary.appendChild(
        createElement("div", "empty-state small-empty", analytics.reason || "GA4 is not configured.")
      );
    }

    renderMetricList($("topPagesList"), analytics.top_pages || [], function (item) {
      const row = createElement("div", "list-row");
      row.append(createElement("strong", "", item.page), createElement("span", "tag", `${item.page_views} views`));
      return row;
    });

    renderMetricList($("trafficSourcesList"), analytics.traffic_sources || [], function (item) {
      const row = createElement("div", "list-row");
      row.append(createElement("strong", "", item.channel), createElement("span", "tag", `${item.sessions} sessions`));
      return row;
    });

    $("combinedSummary").textContent = combined.summary || "No combined summary yet.";
    renderMetricList($("combinedInsightsList"), combined.insights || [], function (item) {
      return createElement("div", "list-row", item);
    });
  }

  loadDashboard().catch(function () {
    $("executiveSummary").textContent = "The dashboard could not be loaded right now.";
  });
})();
