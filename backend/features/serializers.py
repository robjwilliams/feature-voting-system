from rest_framework import serializers
from .models import Feature


class FeatureSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    has_voted = serializers.BooleanField(read_only=True)
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

    def get_is_author(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.author_id == request.user.pk
