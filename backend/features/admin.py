from django.contrib import admin

from .models import Feature


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "vote_count", "created_at")
    search_fields = ("title", "description", "author__username")
    readonly_fields = ("vote_count", "created_at", "updated_at")
    ordering = ("-vote_count", "-created_at")
