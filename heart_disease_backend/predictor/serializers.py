from rest_framework import serializers

class HeartDiseaseInputSerializer(serializers.Serializer):
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
