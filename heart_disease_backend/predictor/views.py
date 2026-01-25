import traceback
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import HeartDiseaseInputSerializer
from .onnx_model import predict_heart_disease
from .models import PredictionHistory

class HeartDiseasePredictView(APIView):

    def post(self, request):
        serializer = HeartDiseaseInputSerializer(data=request.data)


        if serializer.is_valid():
            features = list(serializer.validated_data.values())
            prediction = predict_heart_disease(features)

            result = {
                "prediction": int(prediction),
                "risk": "High Risk" if prediction == 1 else "Low Risk"
            }
            try:
                PredictionHistory.objects.create(
                    user = request.user if request.user.is_authenticated else None,
                    sex = request.data["sex"],
                    age = request.data["age"],
                    cp = request.data["cp"],
                    trestbps = request.data["trestbps"],
                    chol = request.data["chol"],
                    fbs = request.data["fbs"],
                    restecg = request.data["restecg"],
                    thalach = request.data["thalach"],
                    exang = request.data["exang"],
                    oldpeak = request.data["oldpeak"],
                    slope = request.data["slope"],
                    ca = request.data["ca"],
                    thal = request.data["thal"],
                    result = result["prediction"]
                )
                print("History saved successfully.")
            except Exception as e:
                print("History save error:", e)
                traceback.print_exc()
            
            return Response(result, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
