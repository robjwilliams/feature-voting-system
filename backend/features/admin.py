from django.contrib import admin

from .models import Feature


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "status", "vote_count", "created_at")
    list_filter = ("status",)
    search_fields = ("title", "description", "author__username")
    readonly_fields = ("vote_count", "created_at", "updated_at")
    ordering = ("-vote_count", "-created_at")
