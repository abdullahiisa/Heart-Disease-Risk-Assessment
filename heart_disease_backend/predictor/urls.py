from django.urls import path
from .views import HeartDiseasePredictView

urlpatterns = [
    path("predict/", HeartDiseasePredictView.as_view(), name="predict"),
]
