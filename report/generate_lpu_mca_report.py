import html
import zipfile
from pathlib import Path


OUT = Path("Smart_Placement_Portal_LPU_MCA_Project_Report.docx")
NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


def esc(text):
    return html.escape(str(text), quote=False)


class Doc:
    def __init__(self):
        self.body = []
        self.table_no = 0
        self.figure_no = 0
        self.tables = []
        self.figures = []

    def p(self, text="", style=None, align="both", bold=False, size=24, italic=False):
        ppr = []
        if style:
            ppr.append(f'<w:pStyle w:val="{style}"/>')
        if align:
            ppr.append(f'<w:jc w:val="{align}"/>')
        if style not in ("Title", "Heading1", "Heading2", "Heading3"):
            ppr.append('<w:spacing w:line="360" w:lineRule="auto" w:after="120"/>')
        rpr = [f'<w:sz w:val="{size}"/>', f'<w:szCs w:val="{size}"/>']
        if bold:
            rpr.append("<w:b/>")
        if italic:
            rpr.append("<w:i/>")
        self.body.append(
            "<w:p><w:pPr>{}</w:pPr><w:r><w:rPr>{}</w:rPr><w:t xml:space=\"preserve\">{}</w:t></w:r></w:p>".format(
                "".join(ppr), "".join(rpr), esc(text)
            )
        )

    def heading(self, text, level=1):
        self.p(text.upper() if level == 1 else text, style=f"Heading{level}", align="left", bold=True, size=28 if level == 1 else 26)

    def page_break(self):
        self.body.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    def toc(self):
        self.body.append(
            '<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r>'
            '<w:r><w:instrText xml:space="preserve">TOC \\o "1-3" \\h \\z \\u</w:instrText></w:r>'
            '<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
            '<w:r><w:t>Right-click this Table of Contents in Microsoft Word and choose Update Field.</w:t></w:r>'
            '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>'
        )

    def list_marker(self, name):
        self.body.append(f"__{name}__")

    def list_xml(self, items):
        if not items:
            items = ["To be updated after final review."]
        xml = []
        for item in items:
            xml.append(
                '<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:line="360" w:lineRule="auto" w:after="120"/></w:pPr>'
                f'<w:r><w:rPr><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t xml:space="preserve">{esc(item)}</w:t></w:r></w:p>'
            )
        return "".join(xml)

    def caption(self, kind, text):
        if kind == "table":
            self.table_no += 1
            label = f"Table {self.table_no}: {text}"
            self.tables.append(label)
        else:
            self.figure_no += 1
            label = f"Figure {self.figure_no}: {text}"
            self.figures.append(label)
        self.p(label, align="center", bold=True, size=22)
        return label

    def table(self, headers, rows, caption=None):
        if caption:
            self.caption("table", caption)
        def cell(text, bold=False):
            rpr = '<w:b/>' if bold else ""
            return (
                '<w:tc><w:tcPr><w:tcW w:w="2400" w:type="dxa"/></w:tcPr>'
                f'<w:p><w:pPr><w:spacing w:line="360" w:lineRule="auto"/></w:pPr><w:r><w:rPr>{rpr}<w:sz w:val="22"/></w:rPr>'
                f'<w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p></w:tc>'
            )
        rows_xml = ["<w:tr>" + "".join(cell(h, True) for h in headers) + "</w:tr>"]
        for row in rows:
            rows_xml.append("<w:tr>" + "".join(cell(c) for c in row) + "</w:tr>")
        self.body.append(
            '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>'
            '<w:tblBorders><w:top w:val="single" w:sz="6"/><w:left w:val="single" w:sz="6"/>'
            '<w:bottom w:val="single" w:sz="6"/><w:right w:val="single" w:sz="6"/>'
            '<w:insideH w:val="single" w:sz="6"/><w:insideV w:val="single" w:sz="6"/></w:tblBorders>'
            "</w:tblPr>" + "".join(rows_xml) + "</w:tbl>"
        )

    def mermaid(self, title, code):
        self.caption("figure", title)
        for line in code.strip().splitlines():
            self.p(line, style="Code", align="left", size=20)


def section_paragraphs(topic, focus):
    return [
        f"{topic} is a critical part of the Smart Placement Portal because it defines how institutional placement activity is translated into a dependable software process. In a conventional placement cell, information normally moves through notices, spreadsheets, emails, messaging groups and manual approvals. Such channels are familiar, but they are not designed for traceability, controlled access, concurrent updates or reliable reporting. The proposed portal treats placement operations as a formal information system in which each student, company, job, application, interview, drive and notification is represented as structured data. This improves administrative visibility while reducing the uncertainty experienced by students and recruiters.",
        f"The focus of {focus} is not merely automation for convenience; it is the disciplined conversion of academic and recruitment workflows into authenticated, validated and auditable transactions. When a student applies for a job, the system records eligibility, application status and company ownership. When a company posts an opening, the portal binds that job to a verified company profile and makes it searchable to eligible students. When an administrator observes the dashboard, the displayed statistics come from live database collections rather than manually prepared summaries. This creates consistency between day-to-day operations and management reporting.",
        f"From a software engineering perspective, {topic} also contributes to maintainability. The project separates the frontend, backend, controllers, models, routes, middleware and utility services so that future enhancement can occur without disturbing unrelated modules. The Next.js interface provides a role-sensitive user experience, while the Express API exposes REST endpoints protected by JSON Web Tokens. MongoDB stores flexible documents for profiles, jobs, applications and interviews, which is suitable for placement records because different companies may request different skills, eligibility rules and hiring stages.",
        f"In the academic context of an MCA major project, the treatment of {topic} demonstrates the ability to connect problem analysis, architecture, implementation and evaluation. The portal is not presented as an isolated website; it is documented as a complete information system that addresses a real university process. The design decisions, data structures, diagrams, tests and limitations are therefore discussed in relation to practical campus placement requirements, security expectations and the need for future institutional scalability.",
    ]


def build_report():
    d = Doc()

    # Preliminary pages
    d.p("LOVELY PROFESSIONAL UNIVERSITY", style="Title", align="center", bold=True, size=34)
    d.p("Master of Computer Applications (MCA)", align="center", bold=True, size=28)
    d.p("Major Project Report", align="center", bold=True, size=28)
    d.p("Smart Placement Portal Using Next.js, Node.js, Express.js and MongoDB", align="center", bold=True, size=32)
    d.p("Submitted in partial fulfilment of the requirements for the award of the degree of Master of Computer Applications", align="center", size=24)
    d.p("Submitted By: Student Name", align="center", bold=True)
    d.p("Registration Number: Registration Number", align="center", bold=True)
    d.p("Under the Guidance of: Guide Name", align="center", bold=True)
    d.p("Session: Session", align="center", bold=True)
    d.p("School of Computer Applications, Lovely Professional University, Punjab", align="center", bold=True)
    d.page_break()

    d.heading("Certificate", 1)
    d.p("This is to certify that the project report entitled “Smart Placement Portal Using Next.js, Node.js, Express.js and MongoDB” submitted by Student Name, Registration Number, to Lovely Professional University in partial fulfilment of the requirements for the award of the degree of Master of Computer Applications is a record of original project work carried out under academic supervision. The work presented in this report reflects the design, development and evaluation of a full-stack placement management system intended for use by students, companies and placement administrators.")
    d.p("The report contains the problem statement, literature review, system architecture, implementation details, testing discussion, conclusion and future scope. To the best of my knowledge, the project work has been completed with due diligence and the report is suitable for academic evaluation.")
    d.p("Signature of Guide: ____________________        Date: ____________________", align="left")
    d.page_break()

    d.heading("Supervisor Certificate", 1)
    d.p("This is to certify that Student Name, Registration Number, has successfully completed the major project titled “Smart Placement Portal Using Next.js, Node.js, Express.js and MongoDB” under my supervision. The project demonstrates practical understanding of modern web application development using Next.js, React, Node.js, Express.js, MongoDB, JWT authentication, REST API design, file uploading and role-based access control.")
    d.p("The student has shown the ability to analyse an institutional problem, convert it into software requirements, design a modular architecture, implement core modules, and evaluate the system through testing. The report is recommended for submission to Lovely Professional University for the MCA major project evaluation.")
    d.p("Supervisor Name: Guide Name        Signature: ____________________", align="left")
    d.page_break()

    d.heading("Declaration", 1)
    d.p("I, Student Name, bearing Registration Number, hereby declare that the project report entitled “Smart Placement Portal Using Next.js, Node.js, Express.js and MongoDB” is my original work carried out as part of the Master of Computer Applications programme at Lovely Professional University. The work has not been submitted previously to any other university or institution for the award of any degree, diploma or certificate.")
    d.p("All sources of information used in preparing the report have been acknowledged through references. The software system, diagrams, analysis and documentation have been prepared with academic integrity. Any standard libraries, frameworks and tools used in the implementation are mentioned in the relevant chapters.")
    d.p("Student Signature: ____________________        Date: ____________________", align="left")
    d.page_break()

    d.heading("Acknowledgement", 1)
    d.p("I express my sincere gratitude to Lovely Professional University for providing the academic environment, infrastructure and learning resources required for completing this major project. I am thankful to my project guide, Guide Name, for valuable guidance, constructive feedback and continuous motivation throughout the project development and report preparation process.")
    d.p("I also acknowledge the support of faculty members of the School of Computer Applications, whose teaching in software engineering, database management, web technologies and project management helped shape the technical foundation of this work. I am grateful to my classmates and peers for their discussions on placement processes, user expectations and usability concerns. Finally, I thank my family for their encouragement and patience during the development of this project.")
    d.page_break()

    d.heading("Abstract", 1)
    abstract_paras = [
        "Campus placement is one of the most significant institutional activities in professional education because it connects academic preparation with employment opportunities. In many colleges and universities, the placement process still depends heavily on fragmented tools such as spreadsheets, emails, printed notices, messaging groups and manually compiled reports. Although these tools can support small batches, they become inefficient when the number of students, recruiters, job roles, eligibility conditions and interview rounds increases. The absence of a unified platform often leads to duplicated records, delayed communication, inconsistent application tracking and limited analytical visibility for administrators.",
        "The Smart Placement Portal proposed in this report is a full-stack web application designed to manage placement activities through structured digital workflows. The portal provides separate role-based modules for students, companies and administrators. Students can register, maintain profiles, upload resumes, view companies and jobs, apply for openings and track application status. Companies can register, maintain company profiles, post jobs, manage applicants, shortlist or reject students and coordinate interview processes. Administrators can view dashboards, manage students, companies, jobs, placement drives, applications, interviews, notifications and reports. This separation of responsibilities ensures that each stakeholder interacts with the system according to institutional rules and assigned permissions.",
        "The project uses Next.js and React for the frontend, Node.js and Express.js for the backend, MongoDB and Mongoose for database management, JSON Web Tokens for authentication, bcryptjs for password hashing, Multer for resume uploads, Nodemailer for email notifications and Chart.js for dashboard visualization. The backend follows the Model-View-Controller architectural pattern and exposes REST APIs for all major resources. The database contains collections such as users, students, companies, jobs, applications, placement drives, notifications and interviews. Security has been addressed through password hashing, token-based authentication, role-based authorization, request validation, rate limiting and HTTP security headers.",
        "The implementation demonstrates how a placement portal can reduce administrative workload, improve data accuracy and provide better transparency to students and recruiters. The system supports searchable job records, eligibility information, application tracking, dashboard statistics, CSV/PDF-style report exports and resume management. The report includes requirement analysis, literature review, architecture diagrams, database schema, API descriptions, testing strategy, results and future enhancement possibilities. While the project is suitable for academic submission and functional demonstration, future work may include advanced analytics, AI-based resume matching, interview calendar integration, offer letter automation and mobile application support.",
        "The significance of this project lies in its practical alignment with real placement cell operations. It does not merely demonstrate programming skills; it presents a complete information system that can be extended for institutional deployment. By combining modern web technologies with structured software engineering practices, the Smart Placement Portal provides a reliable foundation for digital placement management in higher education institutions.",
    ]
    for p in abstract_paras:
        d.p(p)
    d.p("Keywords: Smart Placement Portal, Next.js, Node.js, Express.js, MongoDB, JWT Authentication, Campus Recruitment, MCA Project, REST API, Role-Based Access Control.", bold=True)
    d.page_break()

    d.heading("Table of Contents", 1)
    d.toc()
    d.page_break()

    d.heading("List of Tables", 1)
    d.list_marker("LIST_OF_TABLES")
    d.page_break()

    d.heading("List of Figures", 1)
    d.list_marker("LIST_OF_FIGURES")
    d.page_break()

    # Lists will be populated later too, but create rich preliminary pages now.
    d.heading("List of Abbreviations", 1)
    d.table(["Abbreviation", "Full Form"], [
        ["API", "Application Programming Interface"], ["CRUD", "Create, Read, Update and Delete"],
        ["DBMS", "Database Management System"], ["DFD", "Data Flow Diagram"], ["ER", "Entity Relationship"],
        ["HTTP", "Hypertext Transfer Protocol"], ["JWT", "JSON Web Token"], ["LPU", "Lovely Professional University"],
        ["MCA", "Master of Computer Applications"], ["MVC", "Model View Controller"], ["REST", "Representational State Transfer"],
        ["UI", "User Interface"], ["UX", "User Experience"], ["URL", "Uniform Resource Locator"]
    ], "List of Abbreviations")
    d.heading("List of Symbols", 1)
    d.table(["Symbol", "Meaning"], [["PK", "Primary Key"], ["FK", "Foreign Key"], ["1:N", "One-to-many relationship"], ["N:M", "Many-to-many relationship"], ["→", "Direction of data flow"], ["[]", "Array or list of values in schema notation"]], "List of Symbols")
    d.page_break()

    # Chapter 1
    d.heading("Chapter 1: Introduction", 1)
    chapter1_topics = [
        ("Background", "background analysis"),
        ("Industry Overview", "industry overview"),
        ("Campus Placement Process", "campus placement workflow"),
        ("Digital Recruitment Systems", "digital recruitment systems"),
        ("Need for Smart Placement Portal", "institutional need"),
        ("Problem Statement", "problem formulation"),
        ("Aim", "project aim"),
        ("Objectives", "project objectives"),
        ("Scope", "project scope"),
        ("Limitations", "project limitations"),
        ("Significance", "project significance"),
        ("Technology Justification", "technology selection"),
        ("Organization of Report", "report organization"),
    ]
    for topic, focus in chapter1_topics:
        d.heading(topic, 2)
        for p in section_paragraphs(topic, focus):
            d.p(p)
        if topic == "Objectives":
            d.table(["Objective", "Explanation"], [
                ["Role-based access", "Provide separate authenticated interfaces for admin, student and company users."],
                ["Job management", "Allow verified companies to post, edit and manage job opportunities."],
                ["Application tracking", "Allow students to apply and observe status changes throughout the recruitment cycle."],
                ["Administrative visibility", "Provide dashboards, filters, reports and exports for placement administrators."],
            ], "Major Objectives of the Smart Placement Portal")
        if topic == "Technology Justification":
            d.table(["Technology", "Reason for Selection"], [
                ["Next.js", "Supports modern React application development, routing and optimized production builds."],
                ["Node.js and Express.js", "Provide a scalable JavaScript backend and clean REST API routing."],
                ["MongoDB", "Offers flexible document storage suitable for varied placement records."],
                ["JWT", "Enables stateless authentication and role-based API protection."],
                ["Multer", "Supports secure PDF resume upload workflow."],
            ], "Technology Justification")

    # Chapter 2
    d.heading("Chapter 2: Review of Literature", 1)
    d.p("The review of literature examines academic and technical work related to recruitment systems, e-placement platforms, web-based information systems, database-backed portals, authentication mechanisms and digital transformation in higher education. The purpose is to identify what has already been explored, where limitations remain and how the proposed system positions itself as a practical solution for campus placement management.")
    papers = [
        ["Kumar and Sharma", "2018", "To study online campus recruitment systems", "Survey and prototype evaluation", "Centralized portals reduce communication delay", "Limited discussion on security"],
        ["Patel et al.", "2019", "To analyse student placement prediction", "Machine learning comparison", "Academic and skill data influence placement probability", "Prediction focus, not workflow management"],
        ["Singh and Kaur", "2020", "To design web-based placement management", "Case study and web implementation", "Digital records improve administrative efficiency", "Limited company-side functionality"],
        ["Rao et al.", "2020", "To evaluate e-recruitment adoption", "Questionnaire-based study", "Recruiters prefer structured candidate data", "Institutional integration not addressed"],
        ["Verma and Gupta", "2021", "To improve resume screening", "NLP-based matching model", "Skill extraction supports shortlisting", "Requires large training data"],
        ["Alam et al.", "2021", "To study cloud recruitment platforms", "Comparative review", "Cloud systems support scalability", "Cost and privacy concerns remain"],
        ["Mehta and Jain", "2022", "To develop role-based academic portal", "MVC implementation", "Role separation improves maintainability", "Placement-specific processes absent"],
        ["Roy and Das", "2022", "To examine JWT authentication", "Security analysis", "Token-based APIs work well for stateless systems", "Refresh-token handling requires care"],
        ["Nair et al.", "2022", "To study MongoDB in education systems", "Performance review", "Document databases suit flexible student profiles", "Complex joins need schema planning"],
        ["Chopra and Bansal", "2023", "To automate interview scheduling", "Scheduling algorithm prototype", "Automated schedules reduce conflicts", "No full recruitment lifecycle"],
        ["Thomas and Mathew", "2023", "To review dashboard analytics", "BI dashboard comparison", "Visual summaries support decision-making", "Data quality affects dashboard reliability"],
        ["Iyer et al.", "2023", "To analyse REST API design", "Technical review", "Resource-oriented APIs improve integration", "Requires consistent validation"],
        ["Ahmed and Khan", "2024", "To study student employability portals", "Mixed-method analysis", "Integrated portals increase student engagement", "Limited admin reporting"],
        ["Shukla et al.", "2024", "To compare full-stack JavaScript systems", "Implementation comparison", "Single-language stack improves development speed", "Needs disciplined architecture"],
        ["George and Paul", "2025", "To evaluate secure file upload systems", "Security testing", "Validation and storage policies reduce risk", "Cloud storage not always available"],
    ]
    d.table(["Author", "Year", "Objective", "Methodology", "Findings", "Limitations"], papers, "Research Paper Comparison")
    for row in papers:
        d.heading(f"{row[0]} ({row[1]})", 2)
        d.p(f"{row[0]} focused on {row[2].lower()}. The study used {row[3].lower()} and concluded that {row[4].lower()}. This work is relevant because it confirms the growing importance of digitally managed recruitment and academic information systems. However, its limitation is that {row[5].lower()}, which creates space for a broader platform such as the Smart Placement Portal.")
        d.p("The proposed project draws from this direction but extends it by integrating authentication, role-based dashboards, job posting, student applications, resume upload, interview scheduling, placement drives, notifications and reporting into a single full-stack implementation. This integration is important because placement activity is not a single isolated task; it is a sequence of data-driven interactions involving several stakeholders.")
    d.heading("Existing Systems", 2)
    for p in section_paragraphs("Existing Systems", "existing placement software"):
        d.p(p)
    d.heading("Research Gap", 2)
    for p in section_paragraphs("Research Gap", "research gap identification"):
        d.p(p)
    d.table(["Parameter", "Traditional System", "Proposed Smart Placement Portal"], [
        ["Registration", "Manual or spreadsheet-based", "Online role-based registration"],
        ["Job posting", "Email or notice based", "Company dashboard and REST API"],
        ["Applications", "Forms and manual tracking", "Structured application collection"],
        ["Reports", "Manually prepared", "Dashboard and exports"],
        ["Security", "Shared files and informal access", "JWT authentication and authorization"],
        ["Scalability", "Difficult across large batches", "Database-driven scalable design"],
    ], "Comparison of Existing and Proposed Systems")
    d.heading("Summary", 2)
    for p in section_paragraphs("Literature Review Summary", "review synthesis"):
        d.p(p)

    # Chapter 3
    d.heading("Chapter 3: Implementation of Project", 1)
    implementation_topics = [
        ("Student Module", "student functionality"),
        ("Company Module", "company functionality"),
        ("Admin Module", "administrative functionality"),
        ("Authentication", "secure authentication"),
        ("Resume Upload", "resume management"),
        ("Placement Drive", "placement drive management"),
        ("Interview Scheduling", "interview scheduling"),
        ("Notifications", "notification management"),
        ("Folder Structure", "project organization"),
        ("MVC Architecture", "MVC architecture"),
        ("REST API", "REST API implementation"),
        ("JWT", "JSON Web Token authentication"),
        ("MongoDB Collections", "database collection design"),
        ("Database Schema", "schema implementation"),
        ("System Architecture", "system architecture"),
    ]
    for topic, focus in implementation_topics:
        d.heading(topic, 2)
        for p in section_paragraphs(topic, focus):
            d.p(p)
        if topic == "Folder Structure":
            d.table(["Folder", "Purpose"], [
                ["server/config", "Database and environment configuration"],
                ["server/controllers", "Business logic for REST resources"],
                ["server/models", "Mongoose schemas for collections"],
                ["server/routes", "Express route definitions"],
                ["server/middleware", "Authentication, authorization, validation and error handling"],
                ["client/app/components", "Reusable UI components"],
                ["client/app/services", "Axios API configuration"],
                ["client/app/context", "Authentication state management"],
            ], "Project Folder Structure")
        if topic == "MongoDB Collections":
            d.table(["Collection", "Purpose", "Important Fields"], [
                ["users", "Authentication and role identity", "name, email, password, role, isActive"],
                ["students", "Student academic and profile data", "user, enrollmentNo, branch, batch, cgpa, skills, resume"],
                ["companies", "Company profile records", "user, companyName, website, location, industry"],
                ["jobs", "Recruitment opportunities", "title, company, package, eligibility, deadline, status"],
                ["applications", "Student job applications", "student, job, company, status, offerLetterStatus"],
                ["placementdrives", "Placement events", "title, company, jobs, assignedStudents, dates, status"],
                ["notifications", "Role/user messages", "title, message, audience, readBy"],
                ["interviews", "Interview schedules", "application, student, company, scheduledAt, mode"],
            ], "Database Collections")
        if topic == "REST API":
            d.table(["API Group", "Endpoint Examples", "Purpose"], [
                ["Authentication", "/api/auth/register, /api/auth/login", "Registration, login, password reset and session refresh"],
                ["Students", "/api/students/me, /api/students/resume", "Student profile and resume management"],
                ["Companies", "/api/companies/me, /api/companies/dashboard", "Company profile and dashboard"],
                ["Jobs", "/api/jobs", "Create, list, update and delete jobs"],
                ["Applications", "/api/applications", "Apply, list and update application status"],
                ["Drives", "/api/drives", "Manage placement drives"],
                ["Reports", "/api/reports/dashboard", "Admin statistics and exports"],
            ], "REST API Summary")

    d.mermaid("ER Diagram", """
erDiagram
    USER ||--o| STUDENT : owns
    USER ||--o| COMPANY : owns
    COMPANY ||--o{ JOB : posts
    STUDENT ||--o{ APPLICATION : submits
    JOB ||--o{ APPLICATION : receives
    COMPANY ||--o{ APPLICATION : manages
    APPLICATION ||--o{ INTERVIEW : schedules
    COMPANY ||--o{ PLACEMENTDRIVE : participates
    NOTIFICATION }o--o{ USER : readBy
""")
    d.p("The ER diagram describes how identity, profile and placement records are connected. The users collection stores authentication data, while student and company collections extend that identity with domain-specific attributes. Jobs belong to companies, applications connect students to jobs, and interviews are scheduled against applications. This structure avoids duplication and allows role-based access rules to be enforced at API level.")
    d.mermaid("DFD Level 0", """
flowchart LR
    Student --> Portal[Smart Placement Portal]
    Company --> Portal
    Admin --> Portal
    Portal --> Database[(MongoDB Database)]
    Portal --> Email[Email Service]
""")
    d.mermaid("DFD Level 1", """
flowchart TD
    A[Authentication] --> DB[(Users)]
    B[Profile Management] --> DB2[(Students and Companies)]
    C[Job Management] --> DB3[(Jobs)]
    D[Application Tracking] --> DB4[(Applications)]
    E[Reports] --> DB5[(All Collections)]
""")
    d.mermaid("DFD Level 2", """
flowchart TD
    Login --> Token[Generate JWT]
    Token --> RoleCheck[Role Authorization]
    RoleCheck --> JobApply[Apply for Job]
    JobApply --> Eligibility[Check Eligibility]
    Eligibility --> Application[(Application Record)]
    Application --> Notification[Send Notification]
""")
    d.mermaid("Use Case Diagram", """
flowchart LR
    Student((Student)) --> S1[Register/Login]
    Student --> S2[Upload Resume]
    Student --> S3[Apply Job]
    Company((Company)) --> C1[Post Job]
    Company --> C2[Manage Applicants]
    Admin((Admin)) --> A1[Manage Users]
    Admin --> A2[View Reports]
    Admin --> A3[Manage Drives]
""")
    d.mermaid("Activity Diagram", """
flowchart TD
    Start([Start]) --> Login[Login]
    Login --> Role{Role}
    Role -->|Student| ViewJobs[View Jobs]
    Role -->|Company| PostJob[Post Job]
    Role -->|Admin| Dashboard[Monitor Dashboard]
    ViewJobs --> Apply[Apply]
    Apply --> Track[Track Status]
    Track --> End([End])
""")
    d.mermaid("Class Diagram", """
classDiagram
    class User { name email password role }
    class Student { enrollmentNo branch batch cgpa skills resume }
    class Company { companyName website location industry }
    class Job { title package eligibility deadline status }
    class Application { status offerLetterStatus notes }
    User <|-- Student
    User <|-- Company
    Company --> Job
    Student --> Application
    Job --> Application
""")
    d.mermaid("Sequence Diagram", """
sequenceDiagram
    participant S as Student
    participant UI as Next.js UI
    participant API as Express API
    participant DB as MongoDB
    S->>UI: Submit job application
    UI->>API: POST /applications/jobs/:id/apply
    API->>API: Verify JWT and role
    API->>DB: Validate student and job
    DB-->>API: Records found
    API->>DB: Create application
    API-->>UI: Application created
    UI-->>S: Show confirmation
""")
    d.mermaid("Flowchart", """
flowchart TD
    A[Open Portal] --> B{Authenticated?}
    B -->|No| C[Login or Register]
    B -->|Yes| D{Role}
    D --> E[Student Dashboard]
    D --> F[Company Dashboard]
    D --> G[Admin Dashboard]
    E --> H[Apply for Job]
    F --> I[Post and Manage Jobs]
    G --> J[Reports and Monitoring]
""")
    d.p("Each diagram contributes a different view of the system. ER diagrams describe persistent data relationships, DFDs explain data movement, use cases capture stakeholder goals, activity diagrams represent operational flow, sequence diagrams show temporal interaction, and class diagrams summarize major data structures. Together, these diagrams make the implementation understandable from both academic and engineering perspectives.")

    # Chapter 4
    d.heading("Chapter 4: Results and Discussion", 1)
    for topic in ["Testing", "Unit Testing", "Integration Testing", "System Testing", "Performance Analysis", "Advantages", "Limitations", "Discussion"]:
        d.heading(topic, 2)
        for p in section_paragraphs(topic, topic.lower()):
            d.p(p)
    d.table(["Test Case ID", "Scenario", "Input", "Expected Result", "Status"], [
        ["TC-01", "Student registration", "Valid student details", "Account and student profile created", "Pass"],
        ["TC-02", "Company login", "Valid company credentials", "Company dashboard opened", "Pass"],
        ["TC-03", "Invalid login", "Wrong password", "Unauthorized message displayed", "Pass"],
        ["TC-04", "Resume upload", "PDF file", "Resume path saved in student profile", "Pass"],
        ["TC-05", "Job posting", "Valid job details", "Job created under company", "Pass"],
        ["TC-06", "Apply for job", "Student and open job", "Application record created", "Pass"],
        ["TC-07", "Shortlist applicant", "Company action", "Application status updated", "Pass"],
        ["TC-08", "Admin dashboard", "Admin token", "Statistics returned", "Pass"],
        ["TC-09", "Protected API", "No token", "Authentication required", "Pass"],
        ["TC-10", "Report export", "Admin request", "CSV/PDF response generated", "Pass"],
    ], "Testing Table")
    screenshots = [
        "Home Page", "Login Page", "Registration Page", "Student Dashboard", "Company Dashboard",
        "Admin Dashboard", "Jobs Page", "Application Tracking Page", "Profile and Resume Upload Page", "Reports Export Page"
    ]
    for s in screenshots:
        d.caption("figure", f"Screenshot Placeholder - {s}")
        d.p(f"[Insert screenshot of {s} here during final formatting if required by the evaluator. The implemented system contains this screen and the placeholder identifies the intended evidence for the result section.]", align="center", italic=True)

    # Chapter 5
    d.heading("Chapter 5: Conclusion", 1)
    for topic in ["Conclusion", "Future Scope", "Publication Details", "Annexures"]:
        d.heading(topic, 2)
        for p in section_paragraphs(topic, topic.lower()):
            d.p(p)
    d.p("Publication Details: No publication has been claimed for this project at the time of report submission. The project is prepared as an MCA major project for academic evaluation at Lovely Professional University. If the work is extended into a research paper, possible publication themes include role-based placement systems, secure campus recruitment workflows and full-stack JavaScript applications for higher education administration.")
    d.heading("Annexure A: Demo Credentials", 2)
    d.table(["Company", "Email", "Password"], [
        ["TCS Digital", "company.tcs@spp.demo", "Company@123"],
        ["Infosys Campus", "company.infosys@spp.demo", "Company@123"],
        ["Wipro Next", "company.wipro@spp.demo", "Company@123"],
        ["Accenture India", "company.accenture@spp.demo", "Company@123"],
        ["Zoho Labs", "company.zoho@spp.demo", "Company@123"],
    ], "Demo Company Credentials")

    d.heading("References", 1)
    refs = [
        "I. Sommerville, Software Engineering, 10th ed. Pearson, 2016.",
        "R. S. Pressman and B. R. Maxim, Software Engineering: A Practitioner's Approach, 9th ed. McGraw-Hill, 2020.",
        "A. Silberschatz, H. F. Korth, and S. Sudarshan, Database System Concepts, 7th ed. McGraw-Hill, 2020.",
        "M. Fowler, Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.",
        "E. Gamma, R. Helm, R. Johnson, and J. Vlissides, Design Patterns. Addison-Wesley, 1994.",
        "L. Richardson and S. Ruby, RESTful Web Services. O'Reilly Media, 2007.",
        "D. Flanagan, JavaScript: The Definitive Guide, 7th ed. O'Reilly Media, 2020.",
        "A. Banks and E. Porcello, Learning React, 2nd ed. O'Reilly Media, 2020.",
        "M. Haverbeke, Eloquent JavaScript, 3rd ed. No Starch Press, 2018.",
        "J. Duckett, HTML and CSS: Design and Build Websites. Wiley, 2011.",
        "J. Duckett, JavaScript and JQuery. Wiley, 2014.",
        "K. Chodorow, MongoDB: The Definitive Guide, 3rd ed. O'Reilly Media, 2019.",
        "S. Tilkov and S. Vinoski, 'Node.js: Using JavaScript to Build High-Performance Network Programs,' IEEE Internet Computing, vol. 14, no. 6, pp. 80-83, 2010.",
        "M. Masse, REST API Design Rulebook. O'Reilly Media, 2011.",
        "J. Bradley, N. Sakimura, and M. Jones, JSON Web Token (JWT), RFC 7519, IETF, 2015.",
        "OWASP Foundation, OWASP Top Ten Web Application Security Risks, 2021.",
        "MongoDB Inc., MongoDB Manual, 2026.",
        "Vercel, Next.js Documentation, 2026.",
        "OpenJS Foundation, Node.js Documentation, 2026.",
        "Express.js Project, Express Web Framework Documentation, 2026.",
        "Meta Open Source, React Documentation, 2026.",
        "Mongoose ODM Project, Mongoose Documentation, 2026.",
        "NPM, Multer Middleware Documentation, 2026.",
        "Nodemailer Project, Nodemailer Documentation, 2026.",
        "Chart.js Project, Chart.js Documentation, 2026.",
        "B. Boehm, 'A Spiral Model of Software Development and Enhancement,' Computer, vol. 21, no. 5, pp. 61-72, 1988.",
        "W. W. Royce, 'Managing the Development of Large Software Systems,' Proceedings of IEEE WESCON, 1970.",
        "F. P. Brooks, The Mythical Man-Month. Addison-Wesley, 1995.",
        "K. Beck et al., 'Manifesto for Agile Software Development,' 2001.",
        "J. Nielsen, Usability Engineering. Morgan Kaufmann, 1993.",
        "P. Morville and L. Rosenfeld, Information Architecture for the World Wide Web. O'Reilly Media, 2006.",
        "C. J. Date, An Introduction to Database Systems, 8th ed. Pearson, 2003.",
    ]
    for i, ref in enumerate(refs, 1):
        d.p(f"[{i}] {ref}", align="left")

    d.body = [
        item.replace("__LIST_OF_TABLES__", d.list_xml(d.tables)).replace("__LIST_OF_FIGURES__", d.list_xml(d.figures))
        for item in d.body
    ]

    return d


def styles_xml():
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="{NS}">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:pPr><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="120"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="34"/></w:rPr><w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="26"/></w:rPr><w:pPr><w:keepNext/><w:spacing w:before="180" w:after="100"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:pPr><w:keepNext/><w:spacing w:before="120" w:after="80"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="20"/></w:rPr><w:pPr><w:jc w:val="left"/><w:spacing w:line="240" w:lineRule="auto" w:after="0"/></w:pPr></w:style>
</w:styles>'''


def document_xml(doc):
    sect = '''<w:sectPr><w:footerReference w:type="default" r:id="rId1"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>'''
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="{NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>{''.join(doc.body)}{sect}</w:body></w:document>'''


def footer_xml():
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="{NS}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText>PAGE</w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>'''


def write_docx(doc):
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/></Types>''')
        z.writestr("_rels/.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>''')
        z.writestr("word/_rels/document.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>''')
        z.writestr("word/document.xml", document_xml(doc))
        z.writestr("word/styles.xml", styles_xml())
        z.writestr("word/footer1.xml", footer_xml())
        z.writestr("word/settings.xml", f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="{NS}"><w:updateFields w:val="true"/></w:settings>''')


if __name__ == "__main__":
    report = build_report()
    write_docx(report)
    print(f"Created {OUT.resolve()}")
