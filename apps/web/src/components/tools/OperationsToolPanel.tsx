export default function OperationsToolPanel() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Operational Workflow Blocks</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <li>• KPI dashboard status review</li>
        <li>• Purchase order progress tracking</li>
        <li>• Supplier communication follow-up</li>
        <li>• Documentation validation and control</li>
      </ul>
    </div>
  );
}
