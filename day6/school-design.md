# School Database Design

## Table Explanations

-   **students**: Stores individual learner records. Each student has a unique ID and email address. The email is marked UNIQUE to prevent duplicate accounts.
-   **courses**: Stores available academic offerings. Each course has a unique code (e.g., CS101) and credit value. Credits must be positive integers enforced by a CHECK constraint.
-   **enrolments**: A join table linking students to courses. It includes a composite primary key (student_id, course_id) which prevents the same student from enrolling in the same course twice. The grade field is optional since students may not have grades yet.

## Relationships

-   **One-to-Many (Conceptual)**: A student can enroll in many courses, and a course can have many students. However, because this relationship is truly many-to-many, we cannot use a simple foreign key in either the students or courses table.
-   **Many-to-Many (Actual)**: The `enrolments` table serves as the necessary join table. Without it, we would need to store comma-separated course IDs in the students table (violating normalization) or duplicate student records for each course (causing data inconsistency). The join table allows flexible enrollment tracking with additional metadata like grades.

## Index Recommendation

I would add an index on `enrolments(student_id)`:
```sql
CREATE INDEX idx_enrolments_student ON enrolments(student_id);

## SQL vs NoSQL Decision

For this school system, **SQL is the clear choice**. Student-course relationships are highly structured with strict integrity requirements: every enrolment must reference valid students and courses, emails must be unique, and grades must follow academic standards. Relational databases enforce these rules at the schema level through foreign keys, UNIQUE constraints, and CHECK constraints. NoSQL document stores would require application-level validation for these rules, increasing the risk of orphaned records or inconsistent data. Additionally, the reporting queries (counting students per course, finding unenrolled students) rely on JOINs and aggregations where SQL excels. While NoSQL might suit a flexible learning management system with varying content types, a core enrollment registry demands relational integrity above all else.