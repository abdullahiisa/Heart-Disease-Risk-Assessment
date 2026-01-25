import React, { useState } from "react";
import api from "../api";

const HeartDiseaseForm = () => {
    const [formData, setFormData] = useState({
        age: "",
        sex: "",
        cp: "",
        trestbps: "",
        chol: "",
        fbs: "",
        restecg: "",
        thalach: "",
        exang: "",
        oldpeak: "",
        slope: "",
        ca: "",
        thal: "",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, Number(v)])
            );

            const response = await api.post("predict/", payload);
            setResult(response.data);
            setShowModal(true);
        } catch (error) {
            alert("Prediction failed. Please verify inputs.");
        } finally {
            setLoading(false);
        }
    };

    const isHighRisk = result?.risk === 1;

    return (
        <>
            {/* MAIN FORM */}
            <div className="max-w-3xl mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
                    Heart Disease Risk Assessment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="border border-gray-300 rounded-lg p-4">
                        <legend className="text-lg font-semibold">Patient Information</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block font-medium mb-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    min="1"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Sex</label>
                                <select
                                    name="sex"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">Select</option>
                                    <option value="1">Male</option>
                                    <option value="0">Female</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Chest Pain */}
                    <fieldset className="border border-gray-300 rounded-lg p-4">
                        <legend className="text-lg font-semibold">Chest Pain</legend>
                        <div className="mt-4">
                            <label className="block font-medium mb-1">Chest Pain Type</label>
                            <select
                                name="cp"
                                required
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                <option value="">Select</option>
                                <option value="0">Typical Angina</option>
                                <option value="1">Atypical Angina</option>
                                <option value="2">Non-anginal Pain</option>
                                <option value="3">Asymptomatic</option>
                            </select>
                        </div>
                    </fieldset>

                    {/* Vital Signs */}
                    <fieldset className="border border-gray-300 rounded-lg p-4">
                        <legend className="text-lg font-semibold">Vital Signs</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block font-medium mb-1">Resting BP (mm Hg)</label>
                                <input
                                    type="number"
                                    name="trestbps"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Cholesterol (mg/dl)</label>
                                <input
                                    type="number"
                                    name="chol"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Fasting Blood Sugar &gt; 120</label>
                                <select
                                    name="fbs"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* ECG & Exercise */}
                    <fieldset className="border border-gray-300 rounded-lg p-4">
                        <legend className="text-lg font-semibold">ECG & Exercise</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block font-medium mb-1">Resting ECG</label>
                                <select
                                    name="restecg"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">Select</option>
                                    <option value="0">Normal</option>
                                    <option value="1">ST-T Abnormality</option>
                                    <option value="2">Left Ventricular Hypertrophy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Max Heart Rate</label>
                                <input
                                    type="number"
                                    name="thalach"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Exercise Induced Angina</label>
                                <select
                                    name="exang"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-medium mb-1">ST Depression (Oldpeak)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="oldpeak"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Vessels */}
                    <fieldset className="border border-gray-300 rounded-lg p-4">
                        <legend className="text-lg font-semibold">Blood Vessels</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label className="block font-medium mb-1">ST Slope</label>
                                <select
                                    name="slope"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">Select</option>
                                    <option value="0">Upsloping</option>
                                    <option value="1">Flat</option>
                                    <option value="2">Downsloping</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Major Vessels (0–3)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="3"
                                    name="ca"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Thalassemia</label>
                                <select
                                    name="thal"
                                    required
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <option value="">Select</option>
                                    <option value="1">Normal</option>
                                    <option value="2">Fixed Defect</option>
                                    <option value="3">Reversible Defect</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
                    >
                        {loading ? "Predicting..." : "Predict Risk"}
                    </button>
                </form>
            </div>

            {/* RESULT MODAL */}
            {showModal && result && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center animate-fade-in">
                        <h3
                            className={`text-2xl font-bold mb-4 ${isHighRisk ? "text-red-600" : "text-green-600"
                                }`}
                        >
                            Prediction Result
                        </h3>

                        <div
                            className={`text-lg font-semibold mb-6 ${isHighRisk ? "text-red-700" : "text-green-700"
                                }`}
                        >
                            {isHighRisk
                                ? "High Risk of Heart Disease Detected"
                                : "Low Risk of Heart Disease"}
                        </div>

                        <p className="text-gray-600 mb-6">
                            This result is generated using a machine learning
                            model based on clinical parameters provided.
                        </p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HeartDiseaseForm;

