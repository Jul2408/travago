import re
import pdfplumber
import docx
from typing import Dict, Any, List

class CVProcessor:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error extracting PDF: {e}")
        return text

    @staticmethod
    def extract_text_from_docx(file_path: str) -> str:
        text = ""
        try:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
        return text

    @staticmethod
    def parse_cv_data(text: str) -> Dict[str, Any]:
        """
        Analyse le texte pour extraire les informations clés.
        V1: Heuristiques et Regex.
        V2: Intégration IA (OpenAI/Mistral).
        """
        data = {
            "name": "",
            "email": "",
            "phone": "",
            "skills": [],
            "experience_years": 0,
            "title": "",
            "summary": ""
        }

        # Email Extraction
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            data["email"] = email_match.group(0)

        # Phone Extraction (Cameroon format or generic)
        phone_match = re.search(r'(\+237|237)?\s?[6]\d{2}\s?\d{2}\s?\d{2}\s?\d{2}', text)
        if phone_match:
            data["phone"] = phone_match.group(0)

        # Basic Title Extraction (first lines often contain the title)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if lines:
            # We skip the name if possible, but for now we take a guess
            data["title"] = lines[1] if len(lines) > 1 else lines[0]

        # Skills Extraction (Keyword matching)
        common_skills = [
            'Python', 'Java', 'JavaScript', 'React', 'Next.js', 'Django', 'SQL', 
            'PHP', 'Laravel', 'C++', 'C#', 'Swift', 'Kotlin', 'Docker', 'Kubernetes',
            'AWS', 'Azure', 'GCP', 'DevOps', 'CI/CD', 'Terraform', 'Management', 
            'Vente', 'Comptabilité', 'Ressources Humaines', 'Marketing Digital', 
            'Design UX/UI', 'Photoshop', 'Excel', 'Word', 'Finance', 'Logistique',
            'Data Science', 'Machine Learning', 'AI', 'Node.js', 'TypeScript', 'Tailwind',
            'Project Management', 'Agile', 'Scrum', 'Audit', 'Fiscalité'
        ]
        
        found_skills = []
        for skill in common_skills:
            if re.search(rf'\b{re.escape(skill)}\b', text, re.IGNORECASE):
                found_skills.append(skill)
        data["skills"] = found_skills

        # Experience years estimation
        years = re.findall(r'(\d+)\s*(ans|year)', text, re.IGNORECASE)
        if years:
            data["experience_years"] = max([int(y[0]) for y in years])

        return data

    def process(self, file_path: str, file_type: str) -> Dict[str, Any]:
        if file_type == 'pdf':
            text = self.extract_text_from_pdf(file_path)
        elif file_type in ['doc', 'docx']:
            text = self.extract_text_from_docx(file_path)
        else:
            return {"error": "Format non supporté"}

        return self.parse_cv_data(text)
