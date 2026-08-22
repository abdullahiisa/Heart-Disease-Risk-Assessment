from rest_framework import serializers
from .models import Patient, PredictionHistory


class HeartDiseaseInputSerializer(serializers.Serializer):
    """Serializer for heart disease prediction input features."""
    age = serializers.FloatField()
    sex = serializers.FloatField()
    cp = serializers.FloatField()
    trestbps = serializers.FloatField()
    chol = serializers.FloatField()
    fbs = serializers.FloatField()
    restecg = serializers.FloatField()
    thalach = serializers.FloatField()
    exang = serializers.FloatField()
    oldpeak = serializers.FloatField()
    slope = serializers.FloatField()
    ca = serializers.FloatField()
    thal = serializers.FloatField()


class PatientSerializer(serializers.ModelSerializer):
    """Serializer for Patient model."""
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    assessment_count = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'medical_record_number', 'first_name', 'last_name',
            'full_name', 'date_of_birth', 'gender', 'age', 'phone',
            'email', 'address', 'emergency_contact', 'emergency_phone',
            'blood_type', 'allergies', 'medical_history',
            'created_at', 'updated_at', 'assessment_count',
        ]
        read_only_fields = ['id', 'medical_record_number', 'created_at', 'updated_at']

    def get_assessment_count(self, obj):
        return obj.assessments.count()


class PatientListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for Patient list views."""
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    assessment_count = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'medical_record_number', 'first_name', 'last_name',
            'full_name', 'date_of_birth', 'gender', 'age', 'phone',
            'created_at', 'assessment_count',
        ]

    def get_assessment_count(self, obj):
        return obj.assessments.count()


class PredictionHistorySerializer(serializers.ModelSerializer):
    """Serializer for PredictionHistory model with full detail."""
    patient_name = serializers.SerializerMethodField()
    patient_mrn = serializers.SerializerMethodField()
    risk_label = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = PredictionHistory
        fields = [
            'id', 'patient', 'patient_name', 'patient_mrn', 'user', 'user_name',
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal',
            'result', 'risk_label', 'probability', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        return obj.patient.full_name if obj.patient else None

    def get_patient_mrn(self, obj):
        return obj.patient.medical_record_number if obj.patient else None

    def get_risk_label(self, obj):
        return "High Risk" if obj.result == 1 else "Low Risk"

    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return None


class PredictionHistoryListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for assessment list views."""
    patient_name = serializers.SerializerMethodField()
    patient_mrn = serializers.SerializerMethodField()
    risk_label = serializers.SerializerMethodField()

    class Meta:
        model = PredictionHistory
        fields = [
            'id', 'patient', 'patient_name', 'patient_mrn',
            'age', 'sex', 'result', 'risk_label', 'probability',
            'created_at',
        ]

    def get_patient_name(self, obj):
        return obj.patient.full_name if obj.patient else None

    def get_patient_mrn(self, obj):
        return obj.patient.medical_record_number if obj.patient else None

    def get_risk_label(self, obj):
        return "High Risk" if obj.result == 1 else "Low Risk"


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics."""
    total_assessments = serializers.IntegerField()
    high_risk_count = serializers.IntegerField()
    low_risk_count = serializers.IntegerField()
    total_patients = serializers.IntegerField()
    recent_assessments = PredictionHistoryListSerializer(many=True)
    risk_distribution = serializers.ListField()
