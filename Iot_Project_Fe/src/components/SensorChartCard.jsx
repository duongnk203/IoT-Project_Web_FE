import Chart from 'react-apexcharts';
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Zap,
  CloudRain
} from 'lucide-react';

const iconMap = {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Zap,
  CloudRain
};

const getChartOptions = (title, color, yMin, yMax, unit, categories) => ({
  chart: {
    id: title,
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 },
    background: 'transparent',
    sparkline: { enabled: false }
  },
  stroke: { curve: 'smooth', width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100]
    }
  },
  colors: [color],
  xaxis: {
    type: 'datetime',
    categories,
    labels: {
      style: { colors: '#64748b', fontSize: '12px' },
      datetimeUTC: false,
      format: 'HH:mm'
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    min: yMin,
    max: yMax,
    labels: {
      style: { colors: '#64748b', fontSize: '12px' },
      formatter: (val) => val.toFixed(1) + unit
    }
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } }
  },
  tooltip: {
    theme: 'dark',
    x: { format: 'dd MMM HH:mm' },
    y: { title: { formatter: () => title } }
  },
  dataLabels: { enabled: false }
});

export default function SensorChartCard({ config, data }) {
  const value = data.length > 0 ? data[data.length - 1][config.key] || 0 : 0;
  const seriesData = data.map(item => ({
    x: new Date(item.createdAt).getTime(),
    y: item[config.key]
  }));

  const Icon = iconMap[config.iconName];

  return (
    <div className="chart-card">
      <div className="chart-info">
        <div className="chart-label">
          <div className="chart-icon" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
            {Icon ? <Icon /> : null}
          </div>
          <span className="chart-title">{config.title}</span>
        </div>
        <div className="current-value">
          <span className="value-number">{value.toFixed(1)}</span>
          <span className="value-unit">{config.unit}</span>
        </div>
      </div>
      <div className="chart-wrapper">
        <Chart
          options={getChartOptions(config.title, config.color, config.yMin, config.yMax, config.unit, data.map(item => item.createdAt))}
          series={[{ name: config.title, data: seriesData }]}
          type="area"
          height={250}
        />
      </div>
    </div>
  );
}