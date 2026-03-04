from django.apps import AppConfig


class SkillsTestsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'skills_tests'

    def ready(self):
        import skills_tests.signals
