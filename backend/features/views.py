from django.db.models import Exists, OuterRef
from rest_framework import generics
from votes.models import Vote
from .models import Feature
from .serializers import FeatureSerializer


class FeatureListCreateView(generics.ListCreateAPIView):
    serializer_class = FeatureSerializer

    def get_queryset(self):
        return Feature.objects.select_related('author').annotate(
            has_voted=Exists(
                Vote.objects.filter(feature=OuterRef('pk'), user=self.request.user)
            )
        )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
