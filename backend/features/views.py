from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Feature
from .serializers import FeatureSerializer
from .permissions import IsAuthorOrReadOnly


class FeatureListCreateView(generics.ListCreateAPIView):
    queryset = Feature.objects.select_related('author').prefetch_related('votes')
    serializer_class = FeatureSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class FeatureRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feature.objects.select_related('author').prefetch_related('votes')
    serializer_class = FeatureSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
