import { Settings, Save, Play, StopCircle } from 'lucide-react';

export default function SettingsCard({ settings, fields, onChange, onSave, onStart, onStop }) {
  return (
    <div className="chart-card settings-card">
      <div className="chart-info">
        <div className="chart-label">
          <div className="chart-icon" style={{ backgroundColor: '#64748b20', color: '#64748b' }}>
            <Settings />
          </div>
          <span className="chart-title">Thông số điều khiển</span>
        </div>
      </div>
      <div className="settings-wrapper">
        {fields.map((field) => (
          <div key={field.key} className="setting-field">
            <label htmlFor={field.key}>{field.label}</label>
            <input
              id={field.key}
              type={field.type}
              step={field.step || '1'}
              value={settings[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          </div>
        ))}
        <div className="settings-buttons">
          <button onClick={onSave} className="settings-button save">
            <Save size={16} />
            Lưu thông số
          </button>
          <button onClick={onStart} className="settings-button start">
            <Play size={16} />
            Chạy liên tục
          </button>
          <button onClick={onStop} className="settings-button stop">
            <StopCircle size={16} />
            Dừng khẩn cấp
          </button>
        </div>
      </div>
    </div>
  );
}