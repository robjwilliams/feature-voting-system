from rest_framework.views import APIView
from rest_framework.response import Response


class MeView(APIView):
    """Returns the currently authenticated user's profile."""

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
        })
