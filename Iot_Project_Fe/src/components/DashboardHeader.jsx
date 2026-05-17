import { RefreshCw } from 'lucide-react';

export default function DashboardHeader({ onRefresh, loading, error }) {
  return (
    <header className="dashboard-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Xe Siêu Âm</h1>
        </div>
        <button onClick={onRefresh} className="refresh-button" disabled={loading}>
          <RefreshCw size={20} className={loading ? 'spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
    </header>
  );
}