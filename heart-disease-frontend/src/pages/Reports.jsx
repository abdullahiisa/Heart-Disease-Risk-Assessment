import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import api from '../api';
import { LoadingState, ErrorState } from '../components/States';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('dashboard/stats/');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingState message="Loading reports..." />;
  if (error) return <ErrorState message={error} />;

  const highPct = stats.total_assessments > 0
    ? Math.round((stats.high_risk_count / stats.total_assessments) * 100)
    : 0;
  const lowPct = stats.total_assessments > 0
    ? Math.round((stats.low_risk_count / stats.total_assessments) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Analytics and insights from assessment data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard
          title="Total Assessments"
          value={stats.total_assessments}
          icon={Activity}
          color="blue"
        />
        <ReportCard
          title="High Risk Rate"
          value={`${highPct}%`}
          icon={TrendingUp}
          color="red"
          subtitle={`${stats.high_risk_count} of ${stats.total_assessments}`}
        />
        <ReportCard
          title="Low Risk Rate"
          value={`${lowPct}%`}
          icon={TrendingUp}
          color="green"
          subtitle={`${stats.low_risk_count} of ${stats.total_assessments}`}
        />
        <ReportCard
          title="Total Patients"
          value={stats.total_patients}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Distribution</h2>
        {stats.total_assessments > 0 ? (
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="flex items-end gap-8 justify-center h-48">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-green-600">{stats.high_risk_count}</span>
                <div
                  className="w-24 bg-green-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${Math.max(20, (stats.high_risk_count / stats.total_assessments) * 160)}px` }}
                />
                <span className="text-xs text-gray-600">High Risk</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-green-600">{stats.low_risk_count}</span>
                <div
                  className="w-24 bg-green-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${Math.max(20, (stats.low_risk_count / stats.total_assessments) * 160)}px` }}
                />
                <span className="text-xs text-gray-600">Low Risk</span>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3 max-w-lg mx-auto">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">High Risk</span>
                  <span className="font-medium text-green-600">{highPct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${highPct}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Low Risk</span>
                  <span className="font-medium text-green-600">{lowPct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${lowPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No assessment data available yet.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Assessments</h2>
        {stats.recent_assessments.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_assessments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {a.patient_name || 'Unknown Patient'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.result === 1 ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'
                    }`}
                >
                  {a.risk_label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No recent assessments.</p>
        )}
      </div>
    </div>
  );
}

function ReportCard({ title, value, icon: Icon, color, subtitle }) {
  const bgClasses = {
    red: 'bg-green-50',
    green: 'bg-green-50',
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
  };
  const iconClasses = {
    red: 'text-green-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bgClasses[color]}`}>
          <Icon className={`w-5 h-5 ${iconClasses[color]}`} />
        </div>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
