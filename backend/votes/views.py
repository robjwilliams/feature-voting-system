from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from features.models import Feature
from .models import Vote


class VoteToggleView(APIView):
    def post(self, request, feature_id):
        feature = get_object_or_404(Feature, pk=feature_id)

        if feature.author_id == request.user.pk:
            return Response(
                {'detail': 'You cannot vote on your own feature request.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        vote, created = Vote.objects.get_or_create(
            feature=feature,
            user=request.user,
        )

        if not created:
            vote.delete()
            feature.refresh_from_db(fields=['vote_count'])
            return Response({'voted': False, 'vote_count': feature.vote_count})

        feature.refresh_from_db(fields=['vote_count'])
        return Response({'voted': True, 'vote_count': feature.vote_count}, status=status.HTTP_201_CREATED)
