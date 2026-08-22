from django.contrib import admin
from .models import Patient, PredictionHistory


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['medical_record_number', 'first_name', 'last_name', 'gender', 'phone', 'created_at']
    search_fields = ['first_name', 'last_name', 'medical_record_number', 'phone', 'email']
    list_filter = ['gender', 'created_at']
    readonly_fields = ['medical_record_number', 'created_at', 'updated_at']


@admin.register(PredictionHistory)
class PredictionHistoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'result', 'probability', 'created_at']
    list_filter = ['result', 'created_at']
    search_fields = ['patient__first_name', 'patient__last_name', 'patient__medical_record_number']
    readonly_fields = ['created_at', 'updated_at']
