import onnxruntime as ort
import numpy as np
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "../../models",
    "heart_disease_logistic_regression_pipeline.onnx"
)

session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])


def predict_heart_disease(features: list):
    """
    Run heart disease prediction using the ONNX model.

    Args:
        features: List of 13 clinical feature values in order:
            [age, sex, cp, trestbps, chol, fbs, restecg,
             thalach, exang, oldpeak, slope, ca, thal]

    Returns:
        int: 0 (low risk) or 1 (high risk)
    """
    input_name = session.get_inputs()[0].name
    input_array = np.array([features], dtype=np.float32)
    output = session.run(None, {input_name: input_array})
    return output[0][0]
