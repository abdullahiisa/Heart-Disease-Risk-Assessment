import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ChevronDown, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import api from '../api';

const INITIAL_FORM = {
  patient_id: '',
  age: '',
  sex: '',
  cp: '',
  trestbps: '',
  chol: '',
  fbs: '',
  restecg: '',
  thalach: '',
  exang: '',
  oldpeak: '',
  slope: '',
  ca: '',
  thal: '',
  notes: '',
};

const VALIDATION_RULES = {
  age: { min: 1, max: 120, label: 'Age' },
  trestbps: { min: 50, max: 300, label: 'Resting BP' },
  chol: { min: 50, max: 600, label: 'Cholesterol' },
  thalach: { min: 50, max: 250, label: 'Max Heart Rate' },
  oldpeak: { min: 0, max: 10, label: 'ST Depression' },
  ca: { min: 0, max: 3, label: 'Major Vessels' },
};

export default function NewAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    api.get('patients/?page_size=100')
      .then((res) => setPatients(res.data.results || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.cp) newErrors.cp = 'Chest pain type is required';
    if (!formData.fbs) newErrors.fbs = 'Fasting blood sugar is required';
    if (!formData.restecg) newErrors.restecg = 'Resting ECG is required';
    if (!formData.exang) newErrors.exang = 'Exercise induced angina is required';
    if (!formData.slope) newErrors.slope = 'ST Slope is required';
    if (!formData.thal) newErrors.thal = 'Thalassemia is required';

    Object.entries(VALIDATION_RULES).forEach(([field, rule]) => {
      const val = parseFloat(formData[field]);
      if (formData[field] === '' || formData[field] === undefined) {
        newErrors[field] = `${rule.label} is required`;
      } else if (isNaN(val) || val < rule.min || val > rule.max) {
        newErrors[field] = `${rule.label} must be between ${rule.min} and ${rule.max}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {};
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'patient_id' || k === 'notes') {
          if (v) payload[k] = v;
        } else {
          payload[k] = Number(v);
        }
      });

      const response = await api.post('predict/', payload);
      setResult(response.data);
      setShowResult(true);
    } catch (error) {
      const detail = error.response?.data?.detail || error.response?.data?.error || 'Prediction failed. Please verify inputs.';
      setErrors({ submit: detail });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setResult(null);
    setShowResult(false);
    setErrors({});
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm transition-colors outline-none ${
      errors[field]
        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-300 focus:ring-2 focus:ring-red-200 focus:border-red-400'
    }`;

  const selectClass = (field) => inputClass(field);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Assessment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter patient clinical parameters for heart disease risk evaluation
        </p>
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-fade-in">
            <div className="p-6 text-center border-b border-gray-100">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  result.prediction === 1 ? 'bg-red-100' : 'bg-green-100'
                }`}
              >
                {result.prediction === 1 ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">Assessment Result</h3>
            </div>

            <div className="p-6 space-y-4">
              <div
                className={`text-center p-4 rounded-xl ${
                  result.prediction === 1 ? 'bg-red-50' : 'bg-green-50'
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    result.prediction === 1 ? 'text-red-700' : 'text-green-700'
                  }`}
                >
                  {result.risk}
                </p>
                {result.probability !== undefined && (
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {Math.round(result.probability * 100)}%
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Input Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Age:</span> {formData.age}</div>
                  <div><span className="text-gray-500">Sex:</span> {formData.sex === '1' ? 'Male' : 'Female'}</div>
                  <div><span className="text-gray-500">BP:</span> {formData.trestbps} mmHg</div>
                  <div><span className="text-gray-500">Cholesterol:</span> {formData.chol} mg/dl</div>
                  <div><span className="text-gray-500">Max HR:</span> {formData.thalach}</div>
                  <div><span className="text-gray-500">Oldpeak:</span> {formData.oldpeak}</div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Medical Disclaimer:</strong> This assessment is generated by a machine learning model
                  and is intended for clinical decision support only. It should not be used as the sole basis
                  for diagnosis or treatment decisions. Always consult with a qualified healthcare professional.
                </p>
              </div>

              <p className="text-xs text-gray-500 text-center">
                {new Date().toLocaleString()}
                {result.assessment_id && ` • Assessment #${result.assessment_id}`}
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                New Assessment
              </button>
              {result.assessment_id && (
                <button
                  onClick={() => navigate(`/assessments/${result.assessment_id}`)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  View Details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Patient Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Patient (Optional)</h3>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            className={inputClass('patient_id')}
          >
            <option value="">No patient selected</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} ({p.medical_record_number})
              </option>
            ))}
          </select>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                className={inputClass('age')}
                placeholder="e.g. 55"
              />
              {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sex *</label>
              <select name="sex" value={formData.sex} onChange={handleChange} className={selectClass('sex')}>
                <option value="">Select</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
              {errors.sex && <p className="text-xs text-red-600 mt-1">{errors.sex}</p>}
            </div>
          </div>
        </div>

        {/* Chest Pain */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Chest Pain</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Chest Pain Type *</label>
            <select name="cp" value={formData.cp} onChange={handleChange} className={selectClass('cp')}>
              <option value="">Select</option>
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
            {errors.cp && <p className="text-xs text-red-600 mt-1">{errors.cp}</p>}
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Vital Signs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Resting BP (mm Hg) *</label>
              <input
                type="number"
                name="trestbps"
                value={formData.trestbps}
                onChange={handleChange}
                className={inputClass('trestbps')}
                placeholder="e.g. 120"
              />
              {errors.trestbps && <p className="text-xs text-red-600 mt-1">{errors.trestbps}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cholesterol (mg/dl) *</label>
              <input
                type="number"
                name="chol"
                value={formData.chol}
                onChange={handleChange}
                className={inputClass('chol')}
                placeholder="e.g. 200"
              />
              {errors.chol && <p className="text-xs text-red-600 mt-1">{errors.chol}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fasting Blood Sugar &gt; 120 *</label>
              <select name="fbs" value={formData.fbs} onChange={handleChange} className={selectClass('fbs')}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors.fbs && <p className="text-xs text-red-600 mt-1">{errors.fbs}</p>}
            </div>
          </div>
        </div>

        {/* ECG & Exercise */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">ECG & Exercise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Resting ECG *</label>
              <select name="restecg" value={formData.restecg} onChange={handleChange} className={selectClass('restecg')}>
                <option value="">Select</option>
                <option value="0">Normal</option>
                <option value="1">ST-T Abnormality</option>
                <option value="2">Left Ventricular Hypertrophy</option>
              </select>
              {errors.restecg && <p className="text-xs text-red-600 mt-1">{errors.restecg}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Heart Rate *</label>
              <input
                type="number"
                name="thalach"
                value={formData.thalach}
                onChange={handleChange}
                className={inputClass('thalach')}
                placeholder="e.g. 150"
              />
              {errors.thalach && <p className="text-xs text-red-600 mt-1">{errors.thalach}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exercise Induced Angina *</label>
              <select name="exang" value={formData.exang} onChange={handleChange} className={selectClass('exang')}>
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors.exang && <p className="text-xs text-red-600 mt-1">{errors.exang}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ST Depression (Oldpeak) *</label>
              <input
                type="number"
                step="0.1"
                name="oldpeak"
                value={formData.oldpeak}
                onChange={handleChange}
                className={inputClass('oldpeak')}
                placeholder="e.g. 1.5"
              />
              {errors.oldpeak && <p className="text-xs text-red-600 mt-1">{errors.oldpeak}</p>}
            </div>
          </div>
        </div>

        {/* Blood Vessels */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Blood Vessels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ST Slope *</label>
              <select name="slope" value={formData.slope} onChange={handleChange} className={selectClass('slope')}>
                <option value="">Select</option>
                <option value="0">Upsloping</option>
                <option value="1">Flat</option>
                <option value="2">Downsloping</option>
              </select>
              {errors.slope && <p className="text-xs text-red-600 mt-1">{errors.slope}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Major Vessels (0–3) *</label>
              <input
                type="number"
                min="0"
                max="3"
                name="ca"
                value={formData.ca}
                onChange={handleChange}
                className={inputClass('ca')}
                placeholder="0-3"
              />
              {errors.ca && <p className="text-xs text-red-600 mt-1">{errors.ca}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thalassemia *</label>
              <select name="thal" value={formData.thal} onChange={handleChange} className={selectClass('thal')}>
                <option value="">Select</option>
                <option value="1">Normal</option>
                <option value="2">Fixed Defect</option>
                <option value="3">Reversible Defect</option>
              </select>
              {errors.thal && <p className="text-xs text-red-600 mt-1">{errors.thal}</p>}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Clinical Notes (Optional)</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none"
            placeholder="Add any relevant clinical observations..."
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Run Assessment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
