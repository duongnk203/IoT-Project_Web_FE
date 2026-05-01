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

      if (historyData.length > 0) {
        const latest = historyData[historyData.length - 1];
        setSettings({
          thresholdPm25: latest.thresholdPm25 || '',
          thresholdHum: latest.thresholdHum || '',
          speed: latest.speed || '',
          kp: latest.kp || '',
          ki: latest.ki || '',
          kd: latest.kd || '',
        });
      }

      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
      const payload = {
        deviceId: "car_001",
        command: "RUNNING"
      };

      console.log('Sending payload:', payload);

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

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      console.log('Command sent:', result);
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
      const payload = {
        deviceId: "car_001",
        command: "STOP"
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
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }

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

  const sensorConfigs = [
    { key: 'temperature', title: 'Temperature', color: '#ef4444', unit: '°C', iconName: 'Thermometer', yMin: 0, yMax: 40 },
    { key: 'humidity', title: 'Humidity', color: '#3b82f6', unit: '%', iconName: 'Droplets', yMin: 0, yMax: 100 },
    { key: 'co2', title: 'CO2', color: '#f59e0b', unit: ' ppm', iconName: 'Wind', yMin: 300, yMax: 1000 },
    { key: 'pM10', title: 'PM 10', color: '#f97316', unit: ' µg/m³', iconName: 'Activity', yMin: 0, yMax: 100 },
    { key: 'pM25', title: 'PM 2.5', color: '#8b5cf6', unit: ' µg/m³', iconName: 'Zap', yMin: 0, yMax: 100 },
    { key: 'pM1', title: 'PM 1.0', color: '#10b981', unit: ' µg/m³', iconName: 'CloudRain', yMin: 0, yMax: 50 },
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
        />
      </div>
    </div>
  );
}

export default App;