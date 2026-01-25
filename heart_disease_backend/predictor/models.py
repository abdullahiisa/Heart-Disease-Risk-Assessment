from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
class PredictionHistory(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    id = models.AutoField(primary_key=True)
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
    result = models.IntegerField(null=True)