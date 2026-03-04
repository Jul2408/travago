from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlacementRequestViewSet

router = DefaultRouter()
router.register(r'requests', PlacementRequestViewSet, basename='placement-requests')

urlpatterns = [
    path('', include(router.urls)),
]
