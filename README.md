# Heart Disease Risk Assessment System

A full-stack machine learning web application for predicting heart disease risk using clinical parameters.  
The system uses a trained machine learning model exported to **ONNX format**, a **Django REST API backend**, and a **React frontend** for user interaction.

---

## Features

- User-friendly clinical data input form
- Machine Learning inference using ONNX Runtime
- RESTful API with Django & Django REST Framework
- Modern React + Tailwind CSS frontend
- Clear risk interpretation (Low Risk / High Risk)
- Suitable for academic, research, and demonstration purposes

---

## Machine Learning Model

- Trained using scikit-learn ( MLP)
- Preprocessing includes scaling and encoding
- Exported to **ONNX** for efficient inference
- Served via backend API

---

## Prerequisites

Ensure the following are installed:

- Python **3.9+**
- Node.js **18+**
- npm or yarn
- pip
- Git

---

## How to Run the Code

To run the application, follow these steps in your terminal:

1.  **Navigate** to the project directory:
    ```bash
    cd Heart-Disease-Risk-Assessment
    ```

2.  **Make the script executable**:
    ```bash
    chmod +x run.sh
    ```

3.  **Execute** the script to start the application:
    ```bash
    ./run.sh
    ```
## Ports

The application will be accessible at the following address(es) once running:

*   **Frontend:** `http://localhost:3000`
*   **API:** `http://localhost:8000`
