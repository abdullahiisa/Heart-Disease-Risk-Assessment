import traceback
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import (
    HeartDiseaseInputSerializer,
    PatientSerializer,
    PatientListSerializer,
    PredictionHistorySerializer,
    PredictionHistoryListSerializer,
    DashboardStatsSerializer,
)
from .onnx_model import predict_heart_disease
from .models import Patient, PredictionHistory


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# ─── Prediction ───────────────────────────────────────────────────────────────

class HeartDiseasePredictView(APIView):
    """Submit heart health inputs and get a risk prediction from the ONNX model."""

    def post(self, request):
        serializer = HeartDiseaseInputSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        features = list(serializer.validated_data.values())

        try:
            prediction = predict_heart_disease(features)
        except Exception as e:
            traceback.print_exc()
            return Response(
                {"error": "Model prediction failed.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        prediction_int = int(prediction)
        # ONNX model returns 0 or 1; derive a confidence-like score
        probability = float(prediction) if 0 <= float(prediction) <= 1 else (0.85 if prediction_int == 1 else 0.15)

        result = {
            "prediction": prediction_int,
            "risk": "High Risk" if prediction_int == 1 else "Low Risk",
            "probability": round(probability, 4),
        }

        # Persist to database
        try:
            patient_id = request.data.get("patient_id")
            patient = None
            if patient_id:
                try:
                    patient = Patient.objects.get(id=patient_id)
                except Patient.DoesNotExist:
                    pass

            assessment = PredictionHistory.objects.create(
                patient=patient,
                user=request.user if request.user.is_authenticated else None,
                sex=request.data.get("sex"),
                age=request.data.get("age"),
                cp=request.data.get("cp"),
                trestbps=request.data.get("trestbps"),
                chol=request.data.get("chol"),
                fbs=request.data.get("fbs"),
                restecg=request.data.get("restecg"),
                thalach=request.data.get("thalach"),
                exang=request.data.get("exang"),
                oldpeak=request.data.get("oldpeak"),
                slope=request.data.get("slope"),
                ca=request.data.get("ca"),
                thal=request.data.get("thal"),
                result=result["prediction"],
                probability=result["probability"],
                notes=request.data.get("notes", ""),
            )
            result["assessment_id"] = assessment.id
        except Exception as e:
            print("History save error:", e)
            traceback.print_exc()

        return Response(result, status=status.HTTP_200_OK)


# ─── Dashboard ────────────────────────────────────────────────────────────────

class DashboardStatsView(APIView):
    """Return aggregated statistics for the dashboard."""

    def get(self, request):
        total_assessments = PredictionHistory.objects.count()
        high_risk = PredictionHistory.objects.filter(result=1).count()
        low_risk = PredictionHistory.objects.filter(result=0).count()
        total_patients = Patient.objects.count()

        recent = PredictionHistory.objects.select_related('patient').order_by('-created_at')[:10]

        risk_distribution = [
            {"name": "High Risk", "value": high_risk},
            {"name": "Low Risk", "value": low_risk},
        ]

        data = {
            "total_assessments": total_assessments,
            "high_risk_count": high_risk,
            "low_risk_count": low_risk,
            "total_patients": total_patients,
            "recent_assessments": PredictionHistoryListSerializer(recent, many=True).data,
            "risk_distribution": risk_distribution,
        }
        return Response(data, status=status.HTTP_200_OK)


# ─── Patients ─────────────────────────────────────────────────────────────────

class PatientListCreateView(generics.ListCreateAPIView):
    """List all patients or create a new patient."""
    queryset = Patient.objects.all()
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'medical_record_number', 'phone', 'email']
    ordering_fields = ['created_at', 'last_name', 'first_name']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PatientSerializer
        return PatientListSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a patient."""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientAssessmentsView(generics.ListAPIView):
    """List all assessments for a specific patient."""
    serializer_class = PredictionHistoryListSerializer
    pagination_class = StandardPagination

    def get_queryset(self):
        patient_id = self.kwargs['pk']
        return PredictionHistory.objects.filter(patient_id=patient_id).order_by('-created_at')


# ─── Assessments ──────────────────────────────────────────────────────────────

class AssessmentListView(generics.ListAPIView):
    """List all assessments with filtering and search."""
    queryset = PredictionHistory.objects.select_related('patient').all()
    serializer_class = PredictionHistoryListSerializer
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patient__first_name', 'patient__last_name', 'patient__medical_record_number']
    ordering_fields = ['created_at', 'result', 'age']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        risk = self.request.query_params.get('risk')
        if risk == 'high':
            qs = qs.filter(result=1)
        elif risk == 'low':
            qs = qs.filter(result=0)
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            qs = qs.filter(patient_id=patient_id)
        return qs


class AssessmentDetailView(generics.RetrieveAPIView):
    """Retrieve a single assessment with full details."""
    queryset = PredictionHistory.objects.select_related('patient').all()
    serializer_class = PredictionHistorySerializer
