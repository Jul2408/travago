import os
import django

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from skills_tests.models import SkillTest, Question

def create_demo_tests():
    print("🚀 Création des tests de démonstration IA Travago...")

    # 1. Test de Logique
    logic_test, created = SkillTest.objects.get_or_create(
        title="Logique & Raisonnement",
        defaults={
            'description': "Évaluez vos capacités d'analyse et de déduction logique.",
            'category': "Psychotechnique",
            'duration_minutes': 10
        }
    )
    if created:
        questions = [
            {
                'content': "Si tous les A sont des B, et que certains B sont des C, alors certains A sont forcément des C ?",
                'options': ["Vrai", "Faux", "On ne peut pas savoir"],
                'correct_option_index': 1
            },
            {
                'content': "Complétez la suite : 2, 4, 8, 16, ...",
                'options': ["20", "24", "32", "64"],
                'correct_option_index': 2
            }
        ]
        for q_data in questions:
            Question.objects.create(test=logic_test, **q_data)
        print("✅ Test de Logique créé.")

    # 2. Test React.js
    react_test, created = SkillTest.objects.get_or_create(
        title="Expertise React & Next.js",
        defaults={
            'description': "Validez vos compétences sur le développement frontend moderne.",
            'category': "Technique",
            'duration_minutes': 15
        }
    )
    if created:
        questions = [
            {
                'content': "Quel hook est utilisé pour gérer les effets de bord dans un composant fonctionnel ?",
                'options': ["useState", "useEffect", "useContext", "useReducer"],
                'correct_option_index': 1
            },
            {
                'content': "Dans Next.js, quel répertoire est utilisé pour le nouveau système de routage (App Router) ?",
                'options': ["pages/", "src/", "app/", "routes/"],
                'correct_option_index': 2
            },
            {
                'content': "Comment passer une donnée d'un composant parent à un enfant en React ?",
                'options': ["Via le State", "Via les Props", "Via une API", "Via Redux uniquement"],
                'correct_option_index': 1
            }
        ]
        for q_data in questions:
            Question.objects.create(test=react_test, **q_data)
        print("✅ Test React créé.")

    print("\n✨ Terminé ! Vous pouvez maintenant rafraîchir votre Centre de Tests sur le dashboard.")

if __name__ == "__main__":
    create_demo_tests()
