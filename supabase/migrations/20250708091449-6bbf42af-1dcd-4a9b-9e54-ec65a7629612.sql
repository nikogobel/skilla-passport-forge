-- Clear existing questions and add the new structured questionnaire
DELETE FROM onboarding_questions;

-- A. Quick profile (warm-up)
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('What do you do in your day-to-day job? Feel free to describe your role in one or two sentences.', 1, '{"section": "A", "type": "text"}'),
('Which industry does your company operate in?', 2, '{"section": "A", "type": "text"}'),
('Roughly how many years of full-time work experience do you have?', 3, '{"section": "A", "type": "select", "options": ["0-1 years", "2-4 years", "5-9 years", "10-14 years", "15+ years"]}');

-- B. Self-declared top skills
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Name up to five skills or subject areas you rely on most at work. You can list them one by one.', 4, '{"section": "B", "type": "text"}'),
('Of those skills you mentioned, which ONE would your colleagues say you are strongest in?', 5, '{"section": "B", "type": "text"}'),
('Is there a skill you learned recently that you are proud of?', 6, '{"section": "B", "type": "text"}');

-- D. Tools & tech stack
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Which software tools, programming languages, or platforms do you use at least weekly? You can say none if applicable.', 11, '{"section": "D", "type": "text"}'),
('Are there any tools you would like to learn but have not started yet?', 12, '{"section": "D", "type": "text"}');

-- E. Learning habits & constraints
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Roughly how many hours per week can you realistically dedicate to learning new skills?', 13, '{"section": "E", "type": "select", "options": ["0-1 hours", "2-3 hours", "4-5 hours", "6+ hours"]}'),
('Do you prefer structured courses, bite-sized challenges, or learning by doing on real projects?', 14, '{"section": "E", "type": "text"}'),
('Where do you usually learn — at work, at home, during commute, or elsewhere?', 15, '{"section": "E", "type": "text"}');