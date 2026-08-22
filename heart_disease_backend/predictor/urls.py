from django.urls import path
from . import views

urlpatterns = [
    # Prediction
    path("predict/", views.HeartDiseasePredictView.as_view(), name="predict"),

    # Dashboard
    path("dashboard/stats/", views.DashboardStatsView.as_view(), name="dashboard-stats"),

    # Patients
    path("patients/", views.PatientListCreateView.as_view(), name="patient-list"),
    path("patients/<int:pk>/", views.PatientDetailView.as_view(), name="patient-detail"),
    path("patients/<int:pk>/assessments/", views.PatientAssessmentsView.as_view(), name="patient-assessments"),

    # Assessments
    path("assessments/", views.AssessmentListView.as_view(), name="assessment-list"),
    path("assessments/<int:pk>/", views.AssessmentDetailView.as_view(), name="assessment-detail"),
]
