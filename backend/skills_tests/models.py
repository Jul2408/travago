from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User

class SkillTest(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    duration_minutes = models.IntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    test = models.ForeignKey(SkillTest, on_delete=models.CASCADE, related_name="questions")
    content = models.TextField()
    options = models.JSONField(help_text="Liste des choix possibles")
    correct_option_index = models.IntegerField()

    def __str__(self):
        return f"Q: {self.content[:50]}"

class TestResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="test_results")
    test = models.ForeignKey(SkillTest, on_delete=models.CASCADE)
    score = models.IntegerField() # Percentage
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.test.title} - {self.score}%"

class GeneratedExam(models.Model):
    title = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    level = models.CharField(max_length=50) # Junior, Medior, Senior, Expert
    content = models.JSONField(help_text="Structure complète de l'examen (Sections, Questions, Barème)")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Examen: {self.role} ({self.level})"
