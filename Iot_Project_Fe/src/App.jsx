import { useState, useEffect } from 'react';
import { fetchHistoryDataWithFallback } from './services/apiService';
import DashboardHeader from './components/DashboardHeader';
import SensorChartCard from './components/SensorChartCard';
import SettingsCard from './components/SettingsCard';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    thresholdPm25: '',
    thresholdHum: '',
    speed: '',
    kp: '',
    ki: '',
    kd: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const historyData = await fetchHistoryDataWithFallback();
      setData(historyData);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('https://iot-project-web-sensor.onrender.com/api/home/device-config');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const config = await response.json();
      if (config) {
        setSettings({
          thresholdPm25: config.thresholdPm25 ?? '',
          thresholdHum: config.thresholdHum ?? '',
          speed: config.speed ?? '',
          kp: config.kp ?? '',
          ki: config.ki ?? '',
          kd: config.kd ?? '',
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching config:', err);
      setError('Lỗi tải cấu hình: ' + err.message);
    }
  };

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      fetchData();
      fetchConfig();
    }, 0);

    const interval = setInterval(() => {
      fetchData();
      fetchConfig();
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sendDeviceCommand = async ({ mode = 'AUTO', command, speed = null, durationMs = null }) => {
    const payload = {
      deviceId: 'car_001',
      mode,
      command,
      speed,
      durationMs,
    };

    const response = await fetch(
      'https://iot-project-web-sensor.onrender.com/api/home/device-command',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text();
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const payload = {
        thresholdPm25: settings.thresholdPm25 ? parseInt(settings.thresholdPm25) : null,
        thresholdHum: settings.thresholdHum ? parseFloat(settings.thresholdHum) : null,
        speed: settings.speed ? parseInt(settings.speed) : null,
        kp: settings.kp ? parseFloat(settings.kp) : null,
        ki: settings.ki ? parseFloat(settings.ki) : null,
        kd: settings.kd ? parseFloat(settings.kd) : null,
      };

      const response = await fetch(
        'https://iot-project-web-sensor.onrender.com/api/home/device-config',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setError(null);
      alert('Lưu thông số thành công!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Lỗi lưu thông số: ' + err.message);
      alert('Lỗi lưu thông số: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startContinuous = async () => {
    try {
      setLoading(true);
      const result = await sendDeviceCommand({
        mode: 'AUTO',
        command: 'RUNNING',
      });

      console.log('Start continuous sent:', result);
      setError(null);
      alert('Bắt đầu chạy liên tục!');
    } catch (err) {
      console.error('Error starting continuous mode:', err);
      setError('Lỗi bắt đầu chạy: ' + err.message);
      alert('Lỗi bắt đầu chạy: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const emergencyStop = async () => {
    try {
      setLoading(true);
      const result = await sendDeviceCommand({
        mode: 'AUTO',
        command: 'STOP',
      });

      console.log('Emergency stop sent:', result);
      setError(null);
      alert('Dừng khẩn cấp!');
    } catch (err) {
      console.error('Error emergency stop:', err);
      setError('Lỗi dừng khẩn cấp: ' + err.message);
      alert('Lỗi dừng khẩn cấp: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCommand = async (command) => {
    try {
      setLoading(true);
      const parsedSpeed = settings.speed ? parseInt(settings.speed, 10) : null;
      const movementCommands = ['FORWARD', 'BACKWARD', 'LEFT', 'RIGHT', 'RUNNING'];
      const isTimedMovementCommand = movementCommands.includes(command);

      const result = await sendDeviceCommand({
        mode: 'MANUAL',
        command,
        speed: Number.isNaN(parsedSpeed) ? null : parsedSpeed,
        durationMs: command === 'STOP' ? 0 : (isTimedMovementCommand ? 3000 : null),
      });

      console.log(`Manual command ${command} sent:`, result);
      setError(null);
    } catch (err) {
      console.error('Error sending manual command:', err);
      setError('Lỗi gửi lệnh thủ công: ' + err.message);
      alert('Lỗi gửi lệnh thủ công: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const sensorConfigs = [
    { key: 'temperature', title: 'Nhiệt độ', color: '#ef4444', unit: '°C', iconName: 'Thermometer', yMin: 0, yMax: 40 },
    { key: 'humidity', title: 'Độ ẩm', color: '#3b82f6', unit: '%', iconName: 'Droplets', yMin: 0, yMax: 100 },
    { key: 'pM25', title: 'PM 2.5', color: '#8b5cf6', unit: ' µg/m³', iconName: 'Zap', yMin: 0, yMax: 100 },
  ];

  const settingFields = [
    { key: 'thresholdPm25', label: 'Threshold PM2.5', type: 'number' },
    { key: 'thresholdHum', label: 'Threshold Humidity', type: 'number' },
    { key: 'speed', label: 'Speed', type: 'number' },
    { key: 'kp', label: 'KP', type: 'number', step: '0.01' },
    { key: 'ki', label: 'KI', type: 'number', step: '0.01' },
    { key: 'kd', label: 'KD', type: 'number', step: '0.01' },
  ];

  return (
    <div className="dashboard-container">
      <DashboardHeader onRefresh={fetchData} loading={loading} error={error} />

      <div className="charts-grid">
        {sensorConfigs.map((config) => (
          <SensorChartCard key={config.key} config={config} data={data} />
        ))}

        <SettingsCard
          settings={settings}
          fields={settingFields}
          onChange={handleSettingChange}
          onSave={saveSettings}
          onStart={startContinuous}
          onStop={emergencyStop}
          onManualCommand={handleManualCommand}
        />
      </div>
    </div>
  );
}

export default App;