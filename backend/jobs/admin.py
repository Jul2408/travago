from django.contrib import admin
from .models import JobOffer, Application

@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'contract_type', 'location', 'is_active', 'created_at')
    list_filter = ('contract_type', 'experience_level', 'is_active')
    search_fields = ('title', 'company__name', 'description')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'job_offer', 'status', 'matching_score', 'applied_at')
    list_filter = ('status',)
    search_fields = ('candidate__user__email', 'job_offer__title')
