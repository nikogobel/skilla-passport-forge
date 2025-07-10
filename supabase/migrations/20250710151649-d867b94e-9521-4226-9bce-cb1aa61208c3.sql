-- Insert a comprehensive skill passport for Nikolai Göbel
INSERT INTO public.skill_passports (user_id, passport_json, created_at, updated_at)
VALUES (
  '946342d8-2eda-4eeb-9c4b-676b3ea51c5f',
  '{
    "personalInfo": {
      "name": "Nikolai Göbel",
      "title": "Business & Technology Consultant",
      "email": "nikolai.goebel@example.com",
      "location": "Berlin, Germany",
      "summary": "Results-driven professional with dual expertise in business strategy and computer science. Proven track record in consulting, venture capital investment analysis, and startup operations. Passionate about leveraging technology to drive business growth and innovation."
    },
    "education": [
      {
        "degree": "Master of Science in Computer Science",
        "institution": "Technical University of Munich",
        "year": "2019-2021",
        "gpa": "1.3",
        "specialization": "Data Science & Machine Learning"
      },
      {
        "degree": "Bachelor of Science in Business Administration",
        "institution": "University of Mannheim",
        "year": "2016-2019",
        "gpa": "1.5",
        "specialization": "Finance & Strategy"
      }
    ],
    "experience": [
      {
        "company": "McKinsey & Company",
        "position": "Business Analyst",
        "duration": "2021-2023",
        "location": "Munich, Germany",
        "description": "Led digital transformation projects for Fortune 500 clients, focusing on data-driven strategy development and process optimization."
      },
      {
        "company": "Rocket Internet Ventures",
        "position": "Investment Associate",
        "duration": "2023-2024",
        "location": "Berlin, Germany",
        "description": "Conducted due diligence for early-stage startups, built financial models, and supported portfolio companies in scaling operations."
      },
      {
        "company": "TechFlow Startup",
        "position": "Co-Founder & CTO",
        "duration": "2024-Present",
        "location": "Berlin, Germany",
        "description": "Co-founded B2B SaaS platform for supply chain optimization. Responsible for technical architecture and business development."
      }
    ],
    "skills": {
      "business": [
        {
          "name": "Strategic Planning",
          "level": 9,
          "category": "Strategy",
          "experience": "5+ years",
          "verified": true,
          "certifications": ["McKinsey Problem Solving Certification"]
        },
        {
          "name": "Financial Analysis",
          "level": 9,
          "category": "Finance",
          "experience": "4+ years",
          "verified": true,
          "certifications": ["CFA Level II Candidate"]
        },
        {
          "name": "Investment Analysis",
          "level": 8,
          "category": "Finance",
          "experience": "2+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Due Diligence",
          "level": 8,
          "category": "Strategy",
          "experience": "2+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Business Development",
          "level": 8,
          "category": "Sales",
          "experience": "3+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Project Management",
          "level": 9,
          "category": "Management",
          "experience": "4+ years",
          "verified": true,
          "certifications": ["PMP Certification", "Agile/Scrum Master"]
        },
        {
          "name": "Market Research",
          "level": 8,
          "category": "Strategy",
          "experience": "4+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Startup Operations",
          "level": 9,
          "category": "Operations",
          "experience": "2+ years",
          "verified": true,
          "certifications": []
        }
      ],
      "technical": [
        {
          "name": "Python",
          "level": 8,
          "category": "Programming",
          "experience": "4+ years",
          "verified": true,
          "certifications": ["Python Institute PCPP"]
        },
        {
          "name": "SQL",
          "level": 9,
          "category": "Database",
          "experience": "5+ years",
          "verified": true,
          "certifications": ["Microsoft SQL Server Certification"]
        },
        {
          "name": "Data Analysis",
          "level": 9,
          "category": "Analytics",
          "experience": "4+ years",
          "verified": true,
          "certifications": ["Google Data Analytics Certificate"]
        },
        {
          "name": "Machine Learning",
          "level": 7,
          "category": "AI/ML",
          "experience": "3+ years",
          "verified": true,
          "certifications": ["AWS Machine Learning Specialty"]
        },
        {
          "name": "JavaScript",
          "level": 6,
          "category": "Programming",
          "experience": "2+ years",
          "verified": false,
          "certifications": []
        },
        {
          "name": "React",
          "level": 6,
          "category": "Frontend",
          "experience": "1+ years",
          "verified": false,
          "certifications": []
        },
        {
          "name": "AWS Cloud Services",
          "level": 8,
          "category": "Cloud",
          "experience": "3+ years",
          "verified": true,
          "certifications": ["AWS Solutions Architect Associate"]
        },
        {
          "name": "Docker",
          "level": 7,
          "category": "DevOps",
          "experience": "2+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Git",
          "level": 8,
          "category": "Version Control",
          "experience": "4+ years",
          "verified": true,
          "certifications": []
        }
      ],
      "consulting": [
        {
          "name": "Client Management",
          "level": 9,
          "category": "Communication",
          "experience": "3+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Problem Solving",
          "level": 9,
          "category": "Analysis",
          "experience": "5+ years",
          "verified": true,
          "certifications": ["McKinsey Problem Solving Certification"]
        },
        {
          "name": "Process Optimization",
          "level": 8,
          "category": "Operations",
          "experience": "3+ years",
          "verified": true,
          "certifications": ["Lean Six Sigma Green Belt"]
        },
        {
          "name": "Change Management",
          "level": 7,
          "category": "Management",
          "experience": "2+ years",
          "verified": true,
          "certifications": ["Prosci Change Management"]
        },
        {
          "name": "Stakeholder Communication",
          "level": 9,
          "category": "Communication",
          "experience": "4+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Workshop Facilitation",
          "level": 8,
          "category": "Leadership",
          "experience": "3+ years",
          "verified": true,
          "certifications": []
        }
      ],
      "tools": [
        {
          "name": "Excel/Google Sheets",
          "level": 9,
          "category": "Productivity",
          "experience": "6+ years",
          "verified": true,
          "certifications": ["Microsoft Excel Expert"]
        },
        {
          "name": "PowerPoint/Presentation",
          "level": 9,
          "category": "Productivity",
          "experience": "5+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Tableau",
          "level": 8,
          "category": "Analytics",
          "experience": "3+ years",
          "verified": true,
          "certifications": ["Tableau Desktop Specialist"]
        },
        {
          "name": "Power BI",
          "level": 7,
          "category": "Analytics",
          "experience": "2+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Salesforce",
          "level": 7,
          "category": "CRM",
          "experience": "2+ years",
          "verified": true,
          "certifications": ["Salesforce Administrator"]
        },
        {
          "name": "Jira",
          "level": 8,
          "category": "Project Management",
          "experience": "3+ years",
          "verified": true,
          "certifications": []
        },
        {
          "name": "Slack",
          "level": 9,
          "category": "Communication",
          "experience": "4+ years",
          "verified": true,
          "certifications": []
        }
      ]
    },
    "languages": [
      {
        "language": "German",
        "level": "Native",
        "verified": true
      },
      {
        "language": "English",
        "level": "Fluent (C1)",
        "verified": true,
        "certifications": ["TOEFL iBT: 115/120"]
      },
      {
        "language": "Spanish",
        "level": "Intermediate (B2)",
        "verified": false
      }
    ],
    "certifications": [
      "PMP (Project Management Professional)",
      "AWS Solutions Architect Associate",
      "CFA Level II Candidate",
      "Agile/Scrum Master Certification",
      "Lean Six Sigma Green Belt",
      "McKinsey Problem Solving Certification",
      "Google Data Analytics Certificate",
      "Tableau Desktop Specialist",
      "Salesforce Administrator"
    ],
    "achievements": [
      "Co-founded startup that raised €2M in seed funding",
      "Led digital transformation project resulting in 30% cost reduction for Fortune 500 client",
      "Managed investment portfolio of €50M+ in early-stage startups",
      "Published research paper on ML applications in supply chain optimization",
      "Graduated Summa Cum Laude from both university degrees"
    ],
    "interests": [
      "Artificial Intelligence & Machine Learning",
      "Sustainable Technology",
      "Venture Capital & Startups",
      "Digital Transformation",
      "Blockchain & Web3"
    ],
    "lastUpdated": "2024-12-10",
    "skillsOverview": {
      "totalSkills": 28,
      "verifiedSkills": 23,
      "averageLevel": 8.2,
      "topCategories": ["Strategy", "Analytics", "Programming", "Communication"],
      "experienceYears": 5,
      "certificationsCount": 9
    }
  }'::jsonb,
  now(),
  now()
)
ON CONFLICT (user_id) 
DO UPDATE SET
  passport_json = EXCLUDED.passport_json,
  updated_at = now();