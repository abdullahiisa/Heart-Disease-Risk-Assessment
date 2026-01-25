import onnxruntime as ort
import numpy as np
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "ml_models",
    "heart_disease_pipeline.onnx"
)

session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])

def predict_heart_disease(features: list):
    input_name = session.get_inputs()[0].name
    input_array = np.array([features], dtype=np.float32)
    output = session.run(None, {input_name: input_array})
    return output[0][0]
