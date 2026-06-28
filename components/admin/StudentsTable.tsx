export function StudentsTable() {
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-sm">
      <div className="grid grid-cols-4 gap-3 border-b border-forest/10 p-4 text-sm font-semibold text-forest">
        <span>学员</span>
        <span>积分</span>
        <span>等级</span>
        <span>作业</span>
      </div>
      <div className="grid grid-cols-4 gap-3 p-4 text-sm text-muted">
        <span>Jenny</span>
        <span>0</span>
        <span>觉醒者</span>
        <span>0</span>
      </div>
    </div>
  );
}

