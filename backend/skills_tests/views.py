from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SkillTest, Question, TestResult, GeneratedExam
from .serializers import SkillTestSerializer, TestResultSerializer, GeneratedExamSerializer


class SkillTestViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillTest.objects.all()
    serializer_class = SkillTestSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def recommend(self, request):
        """
        AI Logic: Looks at user's candidate profile title and finds/creates a matching test.
        """
        user = request.user
        if not user.is_candidate:
            return Response({"detail": "Only candidates get AI recommendations."}, status=400)
        
        profile = user.candidate_profile
        user_title = (profile.title or "Généraliste").strip()
        
        # Try to find an existing test that matches the title
        test = SkillTest.objects.filter(title__icontains=user_title).first()
        
        if not test:
            # AI GENERATION MOCK/LOGIC
            # If no test exists, the "AI" creates one on the fly for this specific role
            test = SkillTest.objects.create(
                title=f"Évaluation Expertise : {user_title}",
                description=f"Test généré par l'IA Travago pour valider vos compétences en {user_title}.",
                category="IA Générée",
                duration_minutes=15
            )
            
            # Create AI Questions based on the title keywords
            questions_data = [
                {
                    "content": f"Quelle est la meilleure pratique pour un {user_title} senior ?",
                    "options": ["Approche réactive", "Approche proactive et analytique", "Délégation totale", "Standardisation stricte"],
                    "correct_option_index": 1
                },
                {
                    "content": f"Quel outil est indispensable pour la performance en {user_title} ?",
                    "options": ["Outils legacy", "IA et Automatisation", "Processus manuels", "Papier/Crayon"],
                    "correct_option_index": 1
                },
                {
                    "content": f"Comment optimiser la productivité dans le domaine : {user_title} ?",
                    "options": ["Travailler plus d'heures", "Utiliser des frameworks modernes", "Réduire les effectifs", "Ignorer les KPIs"],
                    "correct_option_index": 1
                }
            ]
            
            for q in questions_data:
                Question.objects.create(test=test, **q)
        
        serializer = self.get_serializer(test)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        test = self.get_object()
        answers = request.data.get('answers', []) # List of selected indices
        
        # Calculate score
        questions = test.questions.all()
        correct_count = 0
        for i, q in enumerate(questions):
            if i < len(answers) and answers[i] == q.correct_option_index:
                correct_count += 1
        
        score = int((correct_count / len(questions)) * 100) if questions else 0
        
        result = TestResult.objects.create(
            user=request.user,
            test=test,
            score=score
        )
        
        # Update placability score
        if request.user.is_candidate:
            profile = request.user.candidate_profile
            profile.save() # This triggers calculate_placability_score
            # Note: We should probably add logic to include test results in the score
            
        return Response(TestResultSerializer(result).data, status=status.HTTP_201_CREATED)

class TestResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TestResult.objects.filter(user=self.request.user)

class GeneratedExamViewSet(viewsets.ModelViewSet):
    queryset = GeneratedExam.objects.all().order_by('-created_at')
    serializer_class = GeneratedExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        try:
            role = request.data.get('role', 'Généraliste')
            level = request.data.get('level', 'Intermédiaire')
            skills = request.data.get('skills', [])

            # Mock AI Generation - Structured Exam
            structure = {
                "meta": {
                    "duration": "90 minutes",
                    "max_score": 100,
                    "sections_count": 3
                },
                "sections": [
                    {
                        "title": "Partie 1: QCM Technique",
                        "description": f"Questions à choix multiples pour valider les bases en {role}.",
                        "score": 30,
                        "questions": [
                            {
                                "id": 1,
                                "type": "qcm",
                                "text": f"Dans le contexte d'un poste de {role} {level}, quelle est l'approche recommandée pour la gestion des erreurs critiques ?",
                                "options": ["Ignorer et continuer", "Logger et notifier", "Arrêter le système", "Blâmer l'utilisateur"],
                                "correct": 1
                            },
                            {
                                "id": 2,
                                "type": "qcm",
                                "text": "Quelle méthodologie favorise le mieux l'amélioration continue ?",
                                "options": ["Waterfall", "Agile/Scrum", "V-Cycle", "Chaos"],
                                "correct": 1
                            },
                             {
                                "id": 3,
                                "type": "qcm",
                                "text": f"Sur une échelle de 1 à 10, l'importance de la documentation pour un {role} est de :",
                                "options": ["1", "5", "8", "10 (Crucial)"],
                                "correct": 3
                            }
                        ]
                    },
                     {
                        "title": "Partie 2: Questions Ouvertes & Mise en Situation",
                        "description": "Réponses courtes pour évaluer le raisonnement et l'expérience.",
                        "score": 40,
                        "questions": [
                            {
                                "id": 4,
                                "type": "open",
                                "text": f"Décrivez une situation complexe que vous avez rencontrée en tant que {role} et comment vous l'avez résolue.",
                                "lines": 10
                            },
                            {
                                "id": 5,
                                "type": "open",
                                "text": "Un client insatisfait change les spécifications à la dernière minute. Quelle est votre réaction ?",
                                "lines": 8
                            }
                        ]
                    },
                    {
                        "title": "Partie 3: Étude de Cas Pratique",
                        "description": "Analyse approfondie d'un scénario réaliste.",
                        "score": 30,
                        "questions": [
                            {
                                "id": 6,
                                "type": "case_study",
                                "text": f"L'entreprise ABC souhaite digitaliser l'ensemble de son processus de {role}. Proposez un plan d'action en 3 étapes clés, en précisant les risques et les KPIs à surveiller.",
                                "lines": 20
                            }
                        ]
                    }
                ]
            }

            exam = GeneratedExam.objects.create(
                title=f"Évaluation Technique - {role}",
                role=role,
                level=level,
                content=structure,
                created_by=request.user
            )

            return Response(GeneratedExamSerializer(exam).data)
        
        except Exception as e:
            import traceback
            print(f"Error generating exam: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {"error": f"Erreur lors de la génération: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

