export function buildPriorityData(messages: Array<{ priority?: string }>) {
  const counts = { low: 0, medium: 0, high: 0 };

  for (const message of messages) {
    const key = message.priority as keyof typeof counts;
    if (key in counts) {
      counts[key] += 1;
    }
  }

  return [
    { name: "low", value: counts.low },
    { name: "medium", value: counts.medium },
    { name: "high", value: counts.high },
  ];
}

export function buildCategoryData(messages: Array<{ category?: string }>) {
  const map = new Map<string, number>();

  for (const message of messages) {
    const key = message.category ?? "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([name, value]) => ({
    name,
    value,
  }));
}

export function buildMessagesByDay(messages: Array<{ created_at?: string }>) {
  const map = new Map<string, number>();

  for (const message of messages) {
    if (!message.created_at) continue;
    const day = message.created_at.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      date,
      value,
    }));
}