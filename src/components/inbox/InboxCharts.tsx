"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import { getDashboardCopy, translateCategory, translatePriority } from "@/lib/inboxDashboardUtils";
import { buildCategoryData, buildMessagesByDay, buildPriorityData } from "@/lib/inboxChartData";

type Props = {
  messages: Array<{
    priority?: string;
    category?: string;
    created_at?: string;
  }>;
  lang: "en" | "es";
};

export default function InboxCharts({ messages, lang }: Props) {
  const copy = getDashboardCopy(lang);
  const priorityData = buildPriorityData(messages).map((item) => ({
    ...item,
    label: translatePriority(item.name, lang),
  }));
  const categoryData = buildCategoryData(messages).map((item) => ({
    ...item,
    label: translateCategory(item.name, lang),
  }));
  const byDayData = buildMessagesByDay(messages);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-4 text-sm font-medium text-white/80">{copy.messagesByPriority}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-4 text-sm font-medium text-white/80">{copy.messagesByCategory}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="mb-4 text-sm font-medium text-white/80">{copy.messagesByDay}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}