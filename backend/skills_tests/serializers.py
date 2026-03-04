from rest_framework import serializers
from .models import SkillTest, Question, TestResult, GeneratedExam

class GeneratedExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedExam
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at')

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'content', 'options') # Hide correct_option_index

class MiniSkillTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTest
        fields = ('id', 'title', 'category', 'description', 'duration_minutes')

class SkillTestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = SkillTest
        fields = '__all__'

class TestResultSerializer(serializers.ModelSerializer):
    test_detail = MiniSkillTestSerializer(source='test', read_only=True)
    user_detail = serializers.SerializerMethodField()
    
    class Meta:
        model = TestResult
        fields = '__all__'
        read_only_fields = ('user', 'completed_at')

    def get_user_detail(self, obj):
        from users.serializers import UserMicroSerializer
        return UserMicroSerializer(obj.user).data
