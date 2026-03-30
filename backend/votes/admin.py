from django.contrib import admin

from .models import Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("id", "feature", "user", "created_at")
    search_fields = ("feature__title", "user__username")
    readonly_fields = ("created_at",)
