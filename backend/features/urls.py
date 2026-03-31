from django.urls import path
from .views import FeatureListCreateView
from votes.views import VoteToggleView

urlpatterns = [
    path('', FeatureListCreateView.as_view(), name='feature-list-create'),
    path('<int:feature_id>/vote/', VoteToggleView.as_view(), name='feature-vote'),
]
