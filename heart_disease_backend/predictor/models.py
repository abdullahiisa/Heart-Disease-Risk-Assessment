from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Patient(models.Model):
    """Patient profile for heart disease risk assessments."""
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    id = models.AutoField(primary_key=True)
    medical_record_number = models.CharField(max_length=20, unique=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_patients')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.medical_record_number})"

    def save(self, *args, **kwargs):
        if not self.medical_record_number:
            last = Patient.objects.order_by('-id').first()
            next_num = (last.id + 1) if last else 1
            self.medical_record_number = f"MRN-{next_num:06d}"
        super().save(*args, **kwargs)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None


class PredictionHistory(models.Model):
    """Heart disease risk assessment record."""
    RISK_CHOICES = [
        (0, 'Low Risk'),
        (1, 'High Risk'),
    ]

    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, null=True, blank=True, on_delete=models.SET_NULL, related_name='assessments')
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='assessments')

    # Clinical inputs
    age = models.FloatField(null=True)
    sex = models.FloatField(null=True)
    cp = models.FloatField(null=True)
    trestbps = models.FloatField(null=True)
    chol = models.FloatField(null=True)
    fbs = models.FloatField(null=True)
    restecg = models.FloatField(null=True)
    thalach = models.FloatField(null=True)
    exang = models.FloatField(null=True)
    oldpeak = models.FloatField(null=True)
    slope = models.FloatField(null=True)
    ca = models.FloatField(null=True)
    thal = models.FloatField(null=True)

    # Results
    result = models.IntegerField(null=True, choices=RISK_CHOICES)
    probability = models.FloatField(null=True, help_text="Model confidence score (0-1)")
    notes = models.TextField(blank=True, help_text="Clinical notes for this assessment")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        patient_name = self.patient.full_name if self.patient else "Unknown"
        risk = "High Risk" if self.result == 1 else "Low Risk"
        return f"{patient_name} - {risk} ({self.created_at.strftime('%Y-%m-%d')})"
