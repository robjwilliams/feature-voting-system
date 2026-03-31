from rest_framework import serializers
from .models import Feature


class FeatureSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    has_voted = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()

    class Meta:
        model = Feature
        fields = [
            'id',
            'title',
            'description',
            'author_username',
            'vote_count',
            'has_voted',
            'is_author',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['vote_count', 'created_at', 'updated_at', 'author_username']

    def get_has_voted(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        # votes are prefetch_related'd in the view to avoid N+1
        return any(v.user_id == request.user.pk for v in obj.votes.all())

    def get_is_author(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.author_id == request.user.pk
