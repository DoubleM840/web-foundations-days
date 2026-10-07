-- Enable foreign keys in SQLite
PRAGMA foreign_keys = ON;

-- ==========================================
-- SCHEMA DEFINITION
-- ==========================================

CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    credits INTEGER NOT NULL CHECK(credits > 0)
);

CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ==========================================
-- SAMPLE DATA
-- ==========================================

INSERT INTO students (name, email) VALUES 
('Amina Otieno', 'amina@example.com'),
('Brian Kamau', 'brian@example.com'),
('Catherine Wanjiku', 'catherine@example.com');

INSERT INTO courses (title, code, credits) VALUES 
('Web Foundations', 'CS101', 4),
('Database Systems', 'CS201', 3),
('System Design', 'CS301', 3);

INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'),   -- Amina -> Web Foundations
(1, 2, 'B+'),  -- Amina -> Database Systems
(2, 1, 'A-'),  -- Brian -> Web Foundations
(2, 3, 'B'),   -- Brian -> System Design
(3, 2, 'A');   -- Catherine -> Database Systems

-- ==========================================
-- REQUIRED QUERIES
-- ==========================================

-- 1. All courses for one student (by name)
SELECT c.title, c.code, e.grade
FROM enrolments e
JOIN courses c ON e.course_id = c.id
JOIN students s ON e.student_id = s.id
WHERE s.name = 'Amina Otieno';

-- 2. All students on one course
SELECT s.name, s.email, e.grade
FROM enrolments e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id
WHERE c.title = 'Web Foundations';

-- 3. Number of students per course
SELECT c.title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- 4. Students who have no enrolments
SELECT s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.student_id IS NULL;

-- 5. Update one enrolment's grade
UPDATE enrolments 
SET grade = 'A' 
WHERE student_id = 2 AND course_id = 1;