import axios from 'axios';

const API_URL = 'https://iot-project-web-sensor.onrender.com/api/home/history';

const sampleData = [
  { temperature: 27, humidity: 62.5, co2: 440.9, pm10: 10, pm25: 16, createdAt: "2026-04-26T08:57:55.723" },
  { temperature: 26.3, humidity: 64, co2: 430, pm10: 9, pm25: 14, createdAt: "2026-04-26T09:57:55.723" }
];

export const fetchHistoryData = async () => {
  try {
    const response = await axios.get(API_URL);
    const historyData = response.data.result || [];
    return historyData.reverse();
  } catch (err) {
    console.error('Error fetching data:', err);
    throw new Error('Could not connect to API. Please ensure the server is running at localhost:7077');
  }
};

export const fetchHistoryDataWithFallback = async () => {
  try {
    return await fetchHistoryData();
  } catch (err) {
    console.warn('Using sample data:', err.message);
    return sampleData;
  }
};