from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillTestViewSet, TestResultViewSet, GeneratedExamViewSet

router = DefaultRouter()
router.register(r'tests', SkillTestViewSet)
router.register(r'results', TestResultViewSet, basename='test-results')
router.register(r'exams', GeneratedExamViewSet, basename='generated-exams')

urlpatterns = [
    path('', include(router.urls)),
]
