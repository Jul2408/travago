from django.contrib import admin
from .models import PlacementRequest

@admin.register(PlacementRequest)
class PlacementRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'status', 'progress', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'company__name')
