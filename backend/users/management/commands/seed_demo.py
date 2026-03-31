from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

USERS = [
    ('alice',  'alice'),
    ('bob',    'bob'),
    ('carol',  'carol'),
    ('dave',   'dave'),
    ('eva',    'eva'),
    ('frank',  'frank'),
    ('grace',  'grace'),
    ('henry',  'henry'),
    ('iris',   'iris'),
]

FEATURES = [
    (
        'Two-factor authentication',
        'Add TOTP-based 2FA to protect user accounts from unauthorized access.',
        'bob',
    ),
    (
        'Dark mode',
        'Offer a dark color scheme to reduce eye strain during night-time use.',
        'alice',
    ),
    (
        'Mobile app',
        'Native iOS and Android apps with push notifications and offline support.',
        'dave',
    ),
    (
        'Roadmap view',
        'A timeline-style view showing planned, in-progress, and shipped features.',
        'alice',
    ),
    (
        'Slack integration',
        'Post feature updates and new votes automatically to a Slack channel.',
        'frank',
    ),
    (
        'Comment threads',
        'Let users leave threaded comments on feature requests to discuss details.',
        'carol',
    ),
    (
        'Email notifications',
        'Notify authors by email when their feature receives a new vote or comment.',
        'eva',
    ),
    (
        'Multi-language support',
        'Internationalize the UI with i18n so teams worldwide can use it in their language.',
        'henry',
    ),
    (
        'Advanced search & filters',
        'Filter and sort features by author, date range, vote count, or keyword.',
        'grace',
    ),
    (
        'Export to CSV',
        'Download the full feature list as a CSV for offline analysis or reporting.',
        'iris',
    ),
    (
        'Custom dashboards',
        'Let users pin and arrange widgets to build a personalized overview.',
        'alice',
    ),
    (
        'API documentation',
        'Publish interactive Swagger/OpenAPI docs so third-party developers can integrate easily.',
        'bob',
    ),
    (
        'Bulk import',
        'Import a list of feature requests from a CSV or JSON file in one step.',
        'carol',
    ),
    (
        'Keyboard shortcuts',
        'Add keyboard shortcuts for power users to vote, navigate, and submit without a mouse.',
        'dave',
    ),
    (
        'Audit logs',
        'Track all create, edit, and delete actions with timestamps and actor info.',
        'eva',
    ),
]

# Maps feature title -> list of usernames that vote for it.
# Authors never vote on their own feature.
VOTES = {
    'Two-factor authentication':    ['alice', 'carol', 'dave', 'eva', 'frank', 'grace', 'henry', 'iris'],  # 8 voters (bob is author)
    'Dark mode':                    ['bob', 'carol', 'dave', 'eva', 'frank', 'grace', 'henry', 'iris'],    # 8 voters (alice is author)
    'Mobile app':                   ['alice', 'bob', 'carol', 'eva', 'frank', 'grace', 'henry'],           # 7 (dave is author)
    'Roadmap view':                 ['bob', 'carol', 'dave', 'eva', 'frank', 'grace', 'henry'],            # 7 (alice is author)
    'Slack integration':            ['alice', 'bob', 'carol', 'dave', 'eva', 'grace'],                     # 6 (frank is author)
    'Comment threads':              ['alice', 'bob', 'dave', 'eva', 'frank'],                              # 5 (carol is author)
    'Email notifications':          ['alice', 'bob', 'carol', 'dave', 'frank'],                            # 5 (eva is author)
    'Multi-language support':       ['alice', 'bob', 'carol', 'dave'],                                     # 4 (henry is author)
    'Advanced search & filters':    ['alice', 'bob', 'carol', 'eva'],                                      # 4 (grace is author)
    'Export to CSV':                ['alice', 'bob', 'carol'],                                             # 3 (iris is author)
    'Custom dashboards':            ['bob', 'carol'],                                                      # 2 (alice is author)
    'API documentation':            ['alice', 'carol'],                                                    # 2 (bob is author)
    'Bulk import':                  ['alice'],                                                             # 1 (carol is author)
    'Keyboard shortcuts':           ['alice'],                                                             # 1 (dave is author)
    'Audit logs':                   [],                                                                    # 0
}


class Command(BaseCommand):
    help = 'Seed demo users, features, and votes for local development.'

    def handle(self, *args, **options):
        from features.models import Feature
        from votes.models import Vote

        users_created = 0
        user_map = {}

        for username, password in USERS:
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password(password)
                user.save()
                users_created += 1
            user_map[username] = user

        features_created = 0
        feature_map = {}

        for title, description, author_username in FEATURES:
            author = user_map[author_username]
            feature, created = Feature.objects.get_or_create(
                title=title,
                defaults={'description': description, 'author': author},
            )
            if created:
                features_created += 1
            feature_map[title] = feature

        votes_created = 0

        for title, voter_usernames in VOTES.items():
            feature = feature_map.get(title)
            if not feature:
                continue
            for username in voter_usernames:
                voter = user_map.get(username)
                if not voter:
                    continue
                _, created = Vote.objects.get_or_create(feature=feature, user=voter)
                if created:
                    votes_created += 1

        self.stdout.write(self.style.SUCCESS(
            f'Seed complete — '
            f'{users_created} users created, '
            f'{features_created} features created, '
            f'{votes_created} votes created.'
        ))
