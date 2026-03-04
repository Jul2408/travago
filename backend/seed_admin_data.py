import os
import django
import random
from django.utils import timezone
from django.utils.text import slugify
from datetime import timedelta

# Setup Django
import sys
project_path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User, CandidateProfile, CompanyProfile
from jobs.models import JobOffer, Application
from placements.models import PlacementRequest

def seed_data():
    print("Seeding realistic data for Admin Dashboard...")
    
    # Names for generation
    first_names = ["Jean", "Marc", "Sophie", "Marie", "Luc", "Alice", "Thomas", "Pierre", "Camille", "Elodie", "Amadou", "Fatou", "David", "Sarah"]
    last_names = ["Dupont", "Morel", "Koné", "Traoré", "Diop", "Kamara", "Lefebvre", "Lemaire", "Diallo", "Sow"]
    cities = ["Douala", "Yaoundé", "Dakar", "Abidjan", "Casablanca", "Paris", "Bruxelles", "Libreville"]
    tech_titles = ["Développeur FullStack", "Expert IA & Data Science", "Chef de Projet Digital", "Cloud Architect AWS", "UI/UX Designer Senior", "Développeur Mobile Flutter", "Ingénieur DevOps", "Data Analyst"]
    company_names = ["NextGen Tech", "Global Services SARL", "Innov Group", "E-Business Solutions", "Digital Africa", "Cloud Systems", "Avenir RH"]

    # 1. Create Companies
    for i in range(5):
        email = f"contact{i}@company{i}.com"
        username = f"Company_{i}"
        if not User.objects.filter(email=email).exists():
            u = User.objects.create_user(
                username=username,
                email=email,
                password="password123",
                role=User.Role.COMPANY,
                credits=random.randint(500, 2000)
            )
            profile, created = CompanyProfile.objects.get_or_create(
                user=u,
                defaults={
                    "name": random.choice(company_names) + f" {i}",
                    "city": random.choice(cities),
                    "phone": f"+237 6000000{i}",
                    "is_verified": True
                }
            )
            print(f"Created company: {profile.name}")

    # 2. Create Candidates
    for i in range(15):
        email = f"candidate{i}@example.com"
        username = f"User_{i}"
        if not User.objects.filter(email=email).exists():
            u = User.objects.create_user(
                username=username,
                email=email,
                password="password123",
                role=User.Role.CANDIDATE,
                first_name=random.choice(first_names),
                last_name=random.choice(last_names)
            )
            profile, created = CandidateProfile.objects.get_or_create(
                user=u,
                defaults={
                    "title": random.choice(tech_titles),
                    "location": random.choice(cities),
                    "skills": ["Python", "React", "Docker", "IA", "JavaScript", "SQL"][:random.randint(2, 5)],
                    "is_verified": True,
                    "placability_score": random.randint(60, 95)
                }
            )
            print(f"Created candidate: {u.username}")

    # 3. Create Job Offers
    companies = CompanyProfile.objects.all()
    if companies.exists():
        for i in range(15):
            title = random.choice(tech_titles) + f" {i}" # Ensure uniqueness
            slug = slugify(title)
            if not JobOffer.objects.filter(slug=slug).exists():
                job = JobOffer.objects.create(
                    title=title,
                    slug=slug,
                    company=random.choice(companies),
                    sector=JobOffer.Sector.TECH,
                    description="Nous recherchons un talent exceptionnel pour propulser nos projets vers le futur.",
                    missions="Innovation constante, Leadership technique, Travail en équipe.",
                    requirements="Minimum 2 ans d'expérience dans les technologies citées.",
                    location=random.choice(cities),
                    salary_range=f"{random.randint(300, 900)}k XAF",
                    contract_type=random.choice(JobOffer.ContractType.choices)[0],
                    experience_level=random.choice(JobOffer.ExperienceLevel.choices)[0],
                    required_skills=["Python", "React", "Cloud"][:random.randint(1, 3)],
                    is_ia_boosted=True
                )
                print(f"Created job: {job.title}")

    # 4. Create Applications
    candidates = CandidateProfile.objects.all()
    jobs = JobOffer.objects.all()
    if candidates.exists() and jobs.exists():
        for i in range(30):
            c = random.choice(candidates)
            j = random.choice(jobs)
            if not Application.objects.filter(job_offer=j, candidate=c).exists():
                app = Application.objects.create(
                    job_offer=j,
                    candidate=c,
                    status=random.choice(Application.Status.choices)[0],
                    matching_score=random.randint(40, 98)
                )
                # Randomize time in the last 48 hours
                app.applied_at = timezone.now() - timedelta(hours=random.randint(1, 48), minutes=random.randint(0, 59))
                app.save()
                print(f"Created application: {c.user.username} -> {j.title}")

    # 5. Create Placement Requests
    if companies.exists():
        for i in range(6):
            pr = PlacementRequest.objects.create(
                company=random.choice(companies),
                title=f"Placement Urgent : {random.choice(tech_titles)}",
                description="Nous recherchons des profils hautement qualifiés via l'algorithme Travago IA.",
                status=random.choice(PlacementRequest.PlacementStatus.choices)[0],
                progress=random.randint(5, 100)
            )
            # Randomize time
            pr.created_at = timezone.now() - timedelta(hours=random.randint(1, 24))
            pr.save()
            print(f"Created placement request: {pr.title}")

    print("--- SEEDING COMPLETE ---")

if __name__ == "__main__":
    seed_data()
