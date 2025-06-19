import { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_UMAMI_API_URL,
  headers: {
    'Accept': "application/json",
    'x-umami-api-key': process.env.NEXT_PUBLIC_UMAMI_API_KEY
  },
});

export default function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current date and 30 days ago
        const endAt = Math.floor(Date.now());
        const startAt = endAt - (30 * 24 * 60 * 60 * 1000); // 30 days ago

        const [metricsRes, activeRes] = await Promise.all([
          api.get(`/websites/${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}/stats`, {
            params: {
              startAt,
              endAt,
            }
          }),
          api.get(`/websites/${process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}/active`)
        ]);

        setMetrics(metricsRes.data);
        setActive(activeRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Website Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Stats Cards */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Current Period Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Page Views</p>
                <p className="text-2xl font-bold text-blue-700">
                  {metrics?.pageviews?.value || 0}
                </p>
                <p className="text-xs text-blue-500">
                  {metrics?.data?.pageviews?.prev > metrics?.data?.pageviews?.value ? '↓' : '↑'} 
                  {Math.abs(metrics?.pageviews?.value - metrics?.pageviews?.prev)} from previous
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-green-700">
                  {metrics?.visitors?.value || 0}
                </p>
                <p className="text-xs text-green-500">
                  {metrics?.data?.visitors?.prev > metrics?.data?.visitors?.value ? '↓' : '↑'} 
                  {Math.abs(metrics?.visitors?.value - metrics?.visitors?.prev)} from previous
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Total Visits</p>
                <p className="text-2xl font-bold text-purple-700">
                  {metrics?.visits?.value || 0}
                </p>
                <p className="text-xs text-purple-500">
                  {metrics?.data?.visits?.prev > metrics?.data?.visits?.value ? '↓' : '↑'} 
                  {Math.abs(metrics?.visits?.value - metrics?.visits?.prev)} from previous
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {metrics?.bounces?.value || 0}%
                </p>
                <p className="text-xs text-yellow-500">
                  {metrics?.bounces?.prev > metrics?.bounces?.value ? '↓' : '↑'} 
                  {Math.abs(metrics?.bounces?.value - metrics?.bounces?.prev)}% from previous
                </p>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Active Users</h2>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {active?.visitors || 0}
                </div>
                <p className="text-gray-600">Currently Active</p>
              </div>
            </div>
          </div>

          {/* Time on Site Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Total Time on Site</h2>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  {Math.floor((metrics?.totaltime?.value || 0) / 60)}m {Math.floor((metrics?.totaltime?.value || 0) % 60)}s
                </div>
                <p className="text-gray-600">Total Session Duration</p>
              </div>
            </div>
          </div>

          {/* Growth Indicators */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Growth Indicators</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Page Views Growth</span>
                <span className={`font-semibold ${metrics?.pageviews?.value > metrics?.pageviews?.prev ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics?.pageviews?.value > metrics?.pageviews?.prev ? '↑' : '↓'} 
                  {Math.abs(metrics?.pageviews?.value - metrics?.pageviews?.prev)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Visitor Growth</span>
                <span className={`font-semibold ${metrics?.visitors?.value > metrics?.visitors?.prev ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics?.visitors?.value > metrics?.visitors?.prev ? '↑' : '↓'} 
                  {Math.abs(metrics?.visitors?.value - metrics?.visitors?.prev)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Visit Growth</span>
                <span className={`font-semibold ${metrics?.visits?.value > metrics?.visits?.prev ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics?.visits?.value > metrics?.visits?.prev ? '↑' : '↓'} 
                  {Math.abs(metrics?.visits?.value - metrics?.visits?.prev)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 