import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Printer, Download, AlertTriangle, CheckCircle2,
  User, Calendar, Activity, FileText,
} from 'lucide-react';
import api from '../api';
import { LoadingState, ErrorState } from '../components/States';

const FEATURE_LABELS = {
  age: 'Age',
  sex: 'Sex',
  cp: 'Chest Pain Type',
  trestbps: 'Resting Blood Pressure',
  chol: 'Cholesterol',
  fbs: 'Fasting Blood Sugar > 120',
  restecg: 'Resting ECG',
  thalach: 'Max Heart Rate',
  exang: 'Exercise Induced Angina',
  oldpeak: 'ST Depression (Oldpeak)',
  slope: 'ST Slope',
  ca: 'Major Vessels (0-3)',
  thal: 'Thalassemia',
};

const CP_LABELS = { 0: 'Typical Angina', 1: 'Atypical Angina', 2: 'Non-anginal Pain', 3: 'Asymptomatic' };
const SEX_LABELS = { 0: 'Female', 1: 'Male' };
const FBS_LABELS = { 0: 'No', 1: 'Yes' };
const ECG_LABELS = { 0: 'Normal', 1: 'ST-T Abnormality', 2: 'Left Ventricular Hypertrophy' };
const EXANG_LABELS = { 0: 'No', 1: 'Yes' };
const SLOPE_LABELS = { 0: 'Upsloping', 1: 'Flat', 2: 'Downsloping' };
const THAL_LABELS = { 1: 'Normal', 2: 'Fixed Defect', 3: 'Reversible Defect' };

function formatValue(key, value) {
  if (value === null || value === undefined) return '—';
  switch (key) {
    case 'sex': return SEX_LABELS[value] || value;
    case 'cp': return CP_LABELS[value] || value;
    case 'fbs': return FBS_LABELS[value] || value;
    case 'restecg': return ECG_LABELS[value] || value;
    case 'exang': return EXANG_LABELS[value] || value;
    case 'slope': return SLOPE_LABELS[value] || value;
    case 'thal': return THAL_LABELS[value] || value;
    case 'trestbps': return `${value} mmHg`;
    case 'chol': return `${value} mg/dl`;
    default: return value;
  }
}

export default function AssessmentDetail() {
  const { id } = useParams();
  const printRef = useRef(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`assessments/${id}/`);
        setAssessment(res.data);
      } catch (err) {
        setError('Failed to load assessment.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingState message="Loading assessment..." />;
  if (error) return <ErrorState message={error} />;
  if (!assessment) return <ErrorState message="Assessment not found." />;

  const isHighRisk = assessment.result === 1;

  return (
    <div className="space-y-6">
      {/* Header (no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Link to="/assessments" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment #{assessment.id}</h1>
            <p className="text-sm text-gray-500">
              {new Date(assessment.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Printable Report */}
      <div ref={printRef} className="print:shadow-none">
        {/* Report Header */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Heart Disease Risk Assessment Report</h2>
                <p className="text-green-100 text-sm">Assessment #{assessment.id}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Patient</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {assessment.patient_name || 'Unknown Patient'}
                  </p>
                  {assessment.patient_mrn && (
                    <p className="text-xs text-gray-500 font-mono">{assessment.patient_mrn}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                  <p className="text-sm text-gray-900">
                    {new Date(assessment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Assessed By</p>
                  <p className="text-sm text-gray-900">{assessment.user_name || 'System'}</p>
                </div>
              </div>
            </div>

            {/* Risk Result */}
            <div
              className={`rounded-xl p-6 mb-6 ${isHighRisk ? 'bg-green-50 border border-green-200' : 'bg-green-50 border border-green-200'
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${isHighRisk ? 'bg-green-100' : 'bg-green-100'
                    }`}
                >
                  {isHighRisk ? (
                    <AlertTriangle className="w-7 h-7 text-green-600" />
                  ) : (
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Risk Assessment</p>
                  <p
                    className={`text-2xl font-bold ${isHighRisk ? 'text-green-700' : 'text-green-700'
                      }`}
                  >
                    {assessment.risk_label}
                  </p>
                  {assessment.probability !== null && assessment.probability !== undefined && (
                    <p className="text-sm text-gray-600 mt-1">
                      Model Confidence: {Math.round(assessment.probability * 100)}%
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Clinical Parameters */}
            <h3 className="text-base font-semibold text-gray-900 mb-4">Clinical Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {formatValue(key, assessment[key])}
                  </p>
                </div>
              ))}
            </div>

            {/* Notes */}
            {assessment.notes && (
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Clinical Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                  {assessment.notes}
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Medical Disclaimer</p>
                  <p className="text-xs text-amber-700 mt-1">
                    This assessment is generated by a machine learning model and is intended for clinical
                    decision support only. It should not be used as the sole basis for diagnosis or treatment
                    decisions. The model's predictions are based on statistical patterns in training data and
                    may not account for all relevant clinical factors. Always consult with a qualified healthcare
                    professional for medical decisions. This report does not constitute medical advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <p>CardioAssess — Heart Disease Risk Assessment System</p>
              <p>Generated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
