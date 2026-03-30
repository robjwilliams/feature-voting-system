from rest_framework import generics
from .models import Feature
from .serializers import FeatureSerializer


class FeatureListCreateView(generics.ListCreateAPIView):
    queryset = Feature.objects.select_related('author').prefetch_related('votes')
    serializer_class = FeatureSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FeatureRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feature.objects.select_related('author').prefetch_related('votes')
    serializer_class = FeatureSerializer
