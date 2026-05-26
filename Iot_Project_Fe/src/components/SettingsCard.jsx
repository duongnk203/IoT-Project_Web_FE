import { useState } from 'react';
import {
  Settings,
  Save,
  Play,
  StopCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Power,
  Cloud,
  Wind
} from 'lucide-react';

export default function SettingsCard({ settings, fields, onChange, onSave, onStart, onStop, onManualCommand }) {
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [isMistOn, setIsMistOn] = useState(false);
  const [isFilterOn, setIsFilterOn] = useState(false);

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
        <div className="control-panel">
          <div className="control-header-row">
            <span className="control-title">Điều khiển</span>
          </div>

          <div className="control-grid">
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
          </div>
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
              Dừng
            </button>
          </div>

          <div className="direction-control-wrapper">
            <div className="auto-switch-row">
              <span className="auto-switch-label">{isAutoEnabled ? 'Tự động' : 'Thủ công'}</span>
              <button
                className={`auto-switch-button ${isAutoEnabled ? 'is-active' : ''}`}
                type="button"
                role="switch"
                aria-checked={isAutoEnabled}
                aria-label="Bật tắt chế độ tự động"
                onClick={() => {
                  const nextAutoEnabled = !isAutoEnabled;
                  setIsAutoEnabled(nextAutoEnabled);
                  if (nextAutoEnabled) {
                    setIsPowerOn(false);
                    setIsMistOn(false);
                    setIsFilterOn(false);
                  }
                }}
              >
                <span className="auto-switch-track">
                  <span className="auto-switch-thumb" />
                </span>
              </button>
            </div>

            <div className="direction-pad">
              <button
                className="direction-btn up"
                type="button"
                aria-label="Lên"
                disabled={isAutoEnabled}
                onClick={() => onManualCommand?.('FORWARD')}
              >
                <ArrowUp size={18} />
              </button>
              <button
                className="direction-btn left"
                type="button"
                aria-label="Trái"
                disabled={isAutoEnabled}
                onClick={() => onManualCommand?.('LEFT')}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                className="direction-btn center power"
                type="button"
                aria-label="On Off"
                disabled={isAutoEnabled}
                onClick={() => {
                  const nextPowerOn = !isPowerOn;
                  setIsPowerOn(nextPowerOn);
                  onManualCommand?.(nextPowerOn ? 'RUNNING' : 'STOP');
                }}
              >
                <Power size={18} />
              </button>
              <button
                className="direction-btn right"
                type="button"
                aria-label="Phải"
                disabled={isAutoEnabled}
                onClick={() => onManualCommand?.('RIGHT')}
              >
                <ArrowRight size={18} />
              </button>
              <button
                className="direction-btn down"
                type="button"
                aria-label="Xuống"
                disabled={isAutoEnabled}
                onClick={() => onManualCommand?.('BACKWARD')}
              >
                <ArrowDown size={18} />
              </button>
            </div>

            <div className="action-buttons-bottom">
              <button
                className="action-button mist-button"
                type="button"
                disabled={isAutoEnabled}
                onClick={() => {
                  const nextMistOn = !isMistOn;
                  setIsMistOn(nextMistOn);
                  onManualCommand?.(nextMistOn ? 'MIST_ON' : 'MIST_OFF');
                }}
              >
                <Cloud size={16} />
                {isMistOn ? 'Tắt phun sương' : 'Phun sương'}
              </button>
              <button
                className="action-button filter-button"
                type="button"
                disabled={isAutoEnabled}
                onClick={() => {
                  const nextFilterOn = !isFilterOn;
                  setIsFilterOn(nextFilterOn);
                  onManualCommand?.(nextFilterOn ? 'FILTER_ON' : 'FILTER_OFF');
                }}
              >
                <Wind size={16} />
                {isFilterOn ? 'Tắt lọc không khí' : 'Lọc không khí'}
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}