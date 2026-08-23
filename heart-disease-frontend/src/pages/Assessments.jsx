import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import { LoadingState, ErrorState, EmptyState } from '../components/States';

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: 15 };
      if (search) params.search = search;
      if (riskFilter) params.risk = riskFilter;
      const res = await api.get('assessments/', { params });
      setAssessments(res.data.results || []);
      setTotalPages(Math.ceil((res.data.count || 0) / 15));
    } catch (err) {
      setError('Failed to load assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [page, riskFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchAssessments();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  if (loading && assessments.length === 0) return <LoadingState message="Loading assessments..." />;
  if (error) return <ErrorState message={error} onRetry={fetchAssessments} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessment History</h1>
        <p className="text-sm text-gray-500 mt-1">View all heart disease risk assessments</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name or MRN..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none"
            >
              <option value="">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assessment List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {assessments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Age</th>
                    <th className="px-6 py-3">Sex</th>
                    <th className="px-6 py-3">Risk Level</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assessments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">#{a.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {a.patient_name || 'Unknown Patient'}
                        </p>
                        {a.patient_mrn && (
                          <p className="text-xs text-gray-500 font-mono">{a.patient_mrn}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{a.age || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {a.sex === 1 ? 'Male' : a.sex === 0 ? 'Female' : '—'}
                      </td>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No assessments found"
            description={search || riskFilter ? 'Try adjusting your filters.' : 'Start by creating a new assessment.'}
            icon={FileText}
            action={
              !search && !riskFilter && (
                <Link
                  to="/assessment/new"
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  New Assessment
                </Link>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
