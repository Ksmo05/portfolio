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
    const [rawMessagesResponse, summaryResponse, messagesResponse, analyticsResponse, combinedResponse] = await Promise.all([
      fetch("/api/messages?limit=100"),
      fetch("/api/dashboard/summary"),
      fetch("/api/dashboard/messages"),
      fetch("/api/dashboard/analytics"),
      fetch("/api/dashboard/combined-insights"),
    ]);

    const rawMessagesData = await rawMessagesResponse.json();
    console.log("Messages API response:", rawMessagesData);
    const rawItems = safeItems(rawMessagesData);
    const summary = await summaryResponse.json();
    const messages = await messagesResponse.json();
    const analytics = await analyticsResponse.json();
    const combined = await combinedResponse.json();
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
    $("metricTopPriority").textContent = Object.keys(summaryData.by_priority || {})[0] || "-";
    $("metricTopTheme").textContent = (summaryData.top_themes && summaryData.top_themes[0] && summaryData.top_themes[0].label) || "-";
    $("metricGaStatus").textContent = analytics.status === "configured" ? "Live" : "Optional";

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

    renderMetricList($("topOpportunitiesList"), dashboardMessages.top_opportunities || [], messageCard);
    renderMetricList($("recentHighPriorityList"), dashboardMessages.recent_high_priority || [], messageCard);

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
