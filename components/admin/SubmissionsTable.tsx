export function SubmissionsTable() {
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-sm">
      <div className="grid grid-cols-4 gap-3 border-b border-forest/10 p-4 text-sm font-semibold text-forest">
        <span>作业</span>
        <span>学员</span>
        <span>状态</span>
        <span>提交时间</span>
      </div>
      <div className="grid grid-cols-4 gap-3 p-4 text-sm text-muted">
        <span>价值观地图</span>
        <span>Jenny</span>
        <span>待提交</span>
        <span>-</span>
      </div>
    </div>
  );
}

