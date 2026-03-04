from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobOfferViewSet, ApplicationViewSet

router = DefaultRouter()
router.register(r'offers', JobOfferViewSet)
router.register(r'my-applications', ApplicationViewSet, basename='my-applications')

urlpatterns = [
    path('', include(router.urls)),
]
