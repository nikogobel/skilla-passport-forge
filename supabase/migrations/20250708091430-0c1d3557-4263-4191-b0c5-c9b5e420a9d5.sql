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
('Of those skills you mentioned, which ONE would your colleagues say you''re strongest in?', 5, '{"section": "B", "type": "text"}'),
('Is there a skill you learned recently that you''re proud of?', 6, '{"section": "B", "type": "text"}');

-- C. Per-skill deep-dive (dynamic questions will be generated based on skills from B)
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('On a scale from 1 (novice) to 5 (expert), how confident are you in this skill?', 7, '{"section": "C", "type": "scale", "scale": [1, 2, 3, 4, 5], "dynamic": true}'),
('How often did you use this skill in the past month?', 8, '{"section": "C", "type": "select", "options": ["Daily", "Weekly", "Monthly", "Rarely"], "dynamic": true}'),
('What was the largest or most complex thing you achieved with this skill?', 9, '{"section": "C", "type": "text", "dynamic": true}'),
('When did you last up-skill or train on this skill?', 10, '{"section": "C", "type": "select", "options": ["Less than 6 months ago", "6-12 months ago", "More than 1 year ago", "Never"], "dynamic": true}');

-- D. Tools & tech stack
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Which software tools, programming languages, or platforms do you use at least weekly? You can say none if applicable.', 11, '{"section": "D", "type": "text"}'),
('Are there any tools you''d like to learn but haven''t started yet?', 12, '{"section": "D", "type": "text"}');

-- E. Learning habits & constraints
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Roughly how many hours per week can you realistically dedicate to learning new skills?', 13, '{"section": "E", "type": "select", "options": ["0-1 hours", "2-3 hours", "4-5 hours", "6+ hours"]}'),
('Do you prefer structured courses, bite-sized challenges, or learning by doing on real projects?', 14, '{"section": "E", "type": "text"}'),
('Where do you usually learn — at work, at home, during commute, or elsewhere?', 15, '{"section": "E", "type": "text"}');

-- F. Personal interests & passions
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Outside of work, what activities or hobbies energise you the most?', 16, '{"section": "F", "type": "text"}'),
('Have any of these hobbies ever overlapped with your professional life or side-projects?', 17, '{"section": "F", "type": "text"}'),
('If you could teach a friend one skill you''re passionate about, what would it be?', 18, '{"section": "F", "type": "text"}');

-- G. Career goals (3- to 5-year horizon)
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Imagine it''s three years from now: what role or responsibilities would you love to have?', 19, '{"section": "G", "type": "text"}'),
('Which skills do you believe you''ll need to reach that role?', 20, '{"section": "G", "type": "text"}'),
('How important are leadership or people-management skills to your future plans?', 21, '{"section": "G", "type": "select", "options": ["Not at all", "Somewhat", "Very important"]}');

-- H. Personal long-term aspirations (5- to 10-year horizon)
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('What kind of impact or legacy would you like your work to have?', 22, '{"section": "H", "type": "text"}'),
('Are geographic flexibility, remote work, or entrepreneurship part of your long-term plans?', 23, '{"section": "H", "type": "text"}'),
('On a scale from 1 to 5, how open are you to pivoting into an entirely new field if the opportunity is right?', 24, '{"section": "H", "type": "scale", "scale": [1, 2, 3, 4, 5]}');

-- I. Working style & collaboration preferences
INSERT INTO onboarding_questions (question_text, question_order, metadata) VALUES
('Do you prefer collaborating in real time (calls, chat) or asynchronously (docs, tickets)?', 25, '{"section": "I", "type": "text"}'),
('How comfortable are you with experimenting with AI tools in your daily workflow? On a scale from 1 to 5.', 26, '{"section": "I", "type": "scale", "scale": [1, 2, 3, 4, 5]});