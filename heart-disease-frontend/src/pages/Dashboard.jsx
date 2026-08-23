import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Users,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Clock,
} from 'lucide-react';
import api from '../api';
import StatCard from '../components/StatCard';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('dashboard/stats/');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of heart disease risk assessments
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assessments"
          value={stats.total_assessments}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="High Risk Cases"
          value={stats.high_risk_count}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Low Risk Cases"
          value={stats.low_risk_count}
          icon={ShieldCheck}
          color="green"
        />
        <StatCard
          title="Total Patients"
          value={stats.total_patients}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Risk Distribution + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h2>
          {stats.total_assessments > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">High Risk</span>
                  <span className="font-medium text-green-600">
                    {stats.high_risk_count} ({Math.round((stats.high_risk_count / stats.total_assessments) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.high_risk_count / stats.total_assessments) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Low Risk</span>
                  <span className="font-medium text-green-600">
                    {stats.low_risk_count} ({Math.round((stats.low_risk_count / stats.total_assessments) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.low_risk_count / stats.total_assessments) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No assessment data yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/assessment/new"
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">New Assessment</span>
              </div>
              <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/patients"
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">View Patients</span>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/assessments"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Assessment History</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Assessments</h2>
          <Link to="/assessments" className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All →
          </Link>
        </div>

        {stats.recent_assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Age</th>
                  <th className="px-6 py-3">Risk Level</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recent_assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {a.patient_name || 'Unknown Patient'}
                      </p>
                      {a.patient_mrn && (
                        <p className="text-xs text-gray-500">{a.patient_mrn}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.age || '—'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.result === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {a.risk_label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/assessments/${a.id}`}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No assessments yet"
            description="Start by creating a new heart disease risk assessment."
            action={
              <Link
                to="/assessment/new"
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                New Assessment
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
