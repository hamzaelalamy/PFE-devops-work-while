# WorkWhile Application - Architecture Diagrams

## 1. Modèle Conceptuel de Données (MCD) - Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Job : "posts"
    User ||--o{ Application : "submits"
    User ||--o| Company : "owns"
    User ||--o{ Job : "saves"
    Job ||--o{ Application : "receives"
    Job }o--|| Company : "belongs to"
    Job }o--|| User : "posted by"
    ScrapingLog ||--o{ Job : "generates"

    User {
        ObjectId _id PK
        string firstName
        string lastName
        string email UK
        string password
        enum role "candidate, employer, admin"
        object profile
        array savedJobs FK
        boolean isActive
        boolean emailVerified
        string emailVerificationToken
        string passwordResetToken
        date passwordResetExpires
        date lastLogin
        date createdAt
        date updatedAt
    }

    Job {
        ObjectId _id PK
        string title
        string description
        string location
        enum type "full-time, part-time, contract, etc"
        string category
        enum experienceLevel "entry, mid, senior, executive"
        object salary
        boolean isRemote
        array skills
        array benefits
        array requirements
        date deadlineDate
        enum status "active, paused, closed, draft"
        ObjectId postedBy FK
        ObjectId company FK
        string companyName
        array applications FK
        number viewsCount
        enum urgency "low, medium, high"
        boolean featured
        array tags
        string source "internal, indeed, maroc-annonce, rekrute"
        string originalLink UK
        string externalId
        boolean isScraped
        array embedding "AI vector for similarity"
        date createdAt
        date updatedAt
    }

    Company {
        ObjectId _id PK
        string name
        string description
        enum industry
        enum size "1-10, 11-50, etc"
        string location
        string website
        string email
        string phone
        string logo
        date founded
        ObjectId employer FK
        object socialMedia
        array benefits
        string culture
        boolean isVerified
        boolean isActive
        date createdAt
        date updatedAt
    }

    Application {
        ObjectId _id PK
        ObjectId applicant FK
        ObjectId job FK
        enum status "pending, reviewing, shortlisted, etc"
        string coverLetter
        object resume
        array additionalDocuments
        object personalInfo
        object expectedSalary
        object availability
        object experience
        array skills
        array education
        array languages
        array timeline
        object notes
        array interviews
        array references
        array questionnaire
        enum source
        enum priority
        array tags
        date createdAt
        date updatedAt
    }

    ScrapingLog {
        ObjectId _id PK
        enum source "indeed, maroc-annonce, rekrute, other"
        enum status "running, completed, failed"
        number jobsFound
        number jobsInserted
        array errors
        date startTime
        date endTime
        date createdAt
        date updatedAt
    }
```

## 2. System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Web["React Frontend<br/>(Vite + React 19)"]
        Mobile["Mobile Apps<br/>(Future)"]
    end

    subgraph "API Gateway"
        Gateway["Express.js Server<br/>Port 5000"]
        CORS["CORS Middleware"]
        RateLimit["Rate Limiter"]
        Auth["JWT Authentication"]
    end

    subgraph "Application Layer"
        Routes["API Routes"]
        Controllers["Controllers"]
        Services["Business Logic"]
        Middleware["Middleware"]
    end

    subgraph "Routes Layer"
        AuthR["/api/auth<br/>Authentication"]
        JobR["/api/jobs<br/>Job Management"]
        UserR["/api/users<br/>User Management"]
        AppR["/api/applications<br/>Applications"]
        CompR["/api/companies<br/>Companies"]
        ScrapR["/api/admin/scraping<br/>Job Scraping"]
        AnalR["/api/analytics<br/>Analytics"]
        AdminR["/api/admin<br/>Admin Tools"]
    end

    subgraph "Services Layer"
        AuthS["Auth Service<br/>(JWT, BCrypt)"]
        JobS["Job Service<br/>(CRUD, Search)"]
        EmailS["Email Service<br/>(Nodemailer)"]
        AIS["AI Service<br/>(@xenova/transformers)"]
        ScrapS["Scraping Service<br/>(Puppeteer)"]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB Database)]
        Models["Mongoose Models"]
    end

    subgraph "External Services"
        Cloud["Cloudinary<br/>(File Storage)"]
        Email["Email Server<br/>(SMTP)"]
        AI["AI Model<br/>(all-MiniLM-L6-v2)"]
        Scrapers["External Job Sites<br/>(Indeed, Maroc Annonce, Rekrute)"]
    end

    subgraph "Storage"
        Uploads["Local Uploads<br/>(./uploads)"]
        Logs["Winston Logs<br/>(./logs)"]
    end

    Web --> Gateway
    Mobile --> Gateway
    Gateway --> CORS
    CORS --> RateLimit
    RateLimit --> Auth
    Auth --> Routes

    Routes --> AuthR
    Routes --> JobR
    Routes --> UserR
    Routes --> AppR
    Routes --> CompR
    Routes --> ScrapR
    Routes --> AnalR
    Routes --> AdminR

    AuthR --> Controllers
    JobR --> Controllers
    UserR --> Controllers
    AppR --> Controllers
    CompR --> Controllers
    ScrapR --> Controllers
    AnalR --> Controllers
    AdminR --> Controllers

    Controllers --> Services
    Services --> AuthS
    Services --> JobS
    Services --> EmailS
    Services --> AIS
    Services --> ScrapS

    Services --> Models
    Models --> MongoDB

    JobS --> AIS
    Controllers --> Uploads
    EmailS --> Email
    AIS --> AI
    ScrapS --> Scrapers
    Controllers --> Cloud
    Services --> Logs

    style Web fill:#61dafb
    style MongoDB fill:#47A248
    style Gateway fill:#68a063
    style AIS fill:#FF6B6B
```

## 3. Backend Architecture - Layered Design

```mermaid
graph LR
    subgraph "Presentation Layer"
        API["RESTful API Endpoints"]
    end

    subgraph "Middleware Layer"
        M1["Authentication<br/>(JWT)"]
        M2["Validation<br/>(Express Validator)"]
        M3["Error Handler"]
        M4["Rate Limiter"]
        M5["File Upload<br/>(Multer)"]
        M6["Security<br/>(Helmet, Sanitize)"]
    end

    subgraph "Controller Layer"
        C1["Auth Controller"]
        C2["Job Controller"]
        C3["User Controller"]
        C4["Application Controller"]
        C5["Company Controller"]
        C6["Scraping Controller"]
        C7["Analytics Controller"]
    end

    subgraph "Service Layer"
        S1["Auth Service"]
        S2["Job Service"]
        S3["Email Service"]
        S4["AI Service"]
    end

    subgraph "Data Access Layer"
        D1["User Model"]
        D2["Job Model"]
        D3["Company Model"]
        D4["Application Model"]
        D5["ScrapingLog Model"]
    end

    subgraph "Database"
        DB[(MongoDB)]
    end

    API --> M1
    M1 --> M2
    M2 --> M3
    M3 --> M4
    M4 --> M5
    M5 --> M6
    M6 --> C1 & C2 & C3 & C4 & C5 & C6 & C7
    C1 & C2 & C3 & C4 & C5 & C6 & C7 --> S1 & S2 & S3 & S4
    S1 & S2 & S3 & S4 --> D1 & D2 & D3 & D4 & D5
    D1 & D2 & D3 & D4 & D5 --> DB
```

## 4. Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant AuthService
    participant Database
    participant EmailService

    User->>Frontend: Register/Login
    Frontend->>API: POST /api/auth/register or /login
    API->>AuthService: Validate credentials
    AuthService->>Database: Query User
    Database-->>AuthService: User data
    
    alt Registration
        AuthService->>Database: Create new user
        AuthService->>EmailService: Send verification email
        EmailService-->>User: Verification email
    end
    
    AuthService->>AuthService: Generate JWT token
    AuthService-->>API: Return token + user data
    API-->>Frontend: JWT token + user profile
    Frontend->>Frontend: Store token in Redux + localStorage
    Frontend-->>User: Redirect to dashboard

    Note over Frontend,API: Subsequent requests include JWT in header

    Frontend->>API: GET /api/protected-route<br/>(Header: Authorization: Bearer token)
    API->>API: Verify JWT middleware
    API-->>Frontend: Protected data
```

## 5. Job Application Flow

```mermaid
sequenceDiagram
    participant Candidate
    participant Frontend
    participant JobAPI
    participant AppAPI
    participant Database
    participant EmailService
    participant Employer

    Candidate->>Frontend: Search jobs
    Frontend->>JobAPI: GET /api/jobs?filters
    JobAPI->>Database: Query jobs
    Database-->>JobAPI: Job listings
    JobAPI-->>Frontend: Filtered jobs
    Frontend-->>Candidate: Display results

    Candidate->>Frontend: Apply for job
    Frontend->>AppAPI: POST /api/applications<br/>(job, resume, cover letter)
    AppAPI->>Database: Create application
    Database-->>AppAPI: Application created
    
    AppAPI->>Database: Update job.applications[]
    AppAPI->>EmailService: Notify employer
    EmailService-->>Employer: New application email
    AppAPI->>EmailService: Confirm to candidate
    EmailService-->>Candidate: Application confirmation
    AppAPI-->>Frontend: Success response
    Frontend-->>Candidate: Confirmation message

    Employer->>Frontend: Review applications
    Frontend->>AppAPI: PATCH /api/applications/:id<br/>(update status)
    AppAPI->>Database: Update application status
    AppAPI->>EmailService: Notify candidate of status change
    EmailService-->>Candidate: Status update email
```

## 6. AI-Powered Job Matching

```mermaid
graph TD
    Start([New Job Posted]) --> Generate[Generate Job Embedding<br/>AI Service]
    Generate --> Extract[Extract job text<br/>title + description + skills]
    Extract --> Model[all-MiniLM-L6-v2<br/>Transformer Model]
    Model --> Vector[384-dimension vector]
    Vector --> Store[Store in Job.embedding]
    Store --> Index[(MongoDB with vector)]

    Search([User Searches Jobs]) --> UserQuery[User query + preferences]
    UserQuery --> GenQuery[Generate query embedding]
    GenQuery --> ModelQ[all-MiniLM-L6-v2]
    ModelQ --> VectorQ[Query vector]
    VectorQ --> Compare[Cosine Similarity<br/>Calculation]
    
    Index --> Compare
    Compare --> Rank[Rank jobs by similarity]
    Rank --> Filter[Apply filters<br/>location, salary, type]
    Filter --> Results[Return matched jobs]
    Results --> Display([Display to user])

    style Model fill:#FF6B6B
    style ModelQ fill:#FF6B6B
    style Compare fill:#4ECDC4
```

## 7. Web Scraping Architecture

```mermaid
graph TB
    Start([Admin Triggers Scraping]) --> Select{Select Source}
    
    Select -->|Indeed| Indeed[Indeed Scraper]
    Select -->|Maroc Annonce| MA[Maroc Annonce Scraper]
    Select -->|Rekrute| Rekrute[Rekrute Scraper]
    
    Indeed --> Puppeteer[Puppeteer + Stealth Plugin]
    MA --> Puppeteer
    Rekrute --> Puppeteer
    
    Puppeteer --> Navigate[Navigate to job site]
    Navigate --> Parse[Parse job listings HTML]
    Parse --> Extract[Extract job data]
    Extract --> Transform[Transform to job schema]
    
    Transform --> Validate{Valid job data?}
    Validate -->|Yes| Dedupe{Already exists?}
    Validate -->|No| Error[Log error]
    
    Dedupe -->|New| Create[Create draft job]
    Dedupe -->|Exists| Skip[Skip duplicate]
    
    Create --> DB[(MongoDB)]
    Skip --> Log[Update scraping log]
    Error --> Log
    
    DB --> Log
    Log --> Stats[Update stats<br/>jobsFound, jobsInserted]
    Stats --> End([Scraping Complete])
    
    style Puppeteer fill:#00D4AA
    style DB fill:#47A248
```

## 8. Data Security & Middleware Flow

```mermaid
graph LR
    Request([HTTP Request]) --> TrustProxy[Trust Proxy<br/>ngrok, reverse proxies]
    TrustProxy --> CORS[CORS Check<br/>Origin validation]
    CORS --> Options{OPTIONS<br/>request?}
    
    Options -->|Yes| Preflight[Handle preflight<br/>Return CORS headers]
    Options -->|No| RateLimit
    
    Preflight --> End([200 OK])
    
    RateLimit[Rate Limiting<br/>1000 req/15min] --> BodyParse[Body Parser<br/>JSON/URL-encoded]
    BodyParse --> Sanitize[Mongo Sanitize<br/>Prevent NoSQL injection]
    Sanitize --> Compress[Compression<br/>gzip responses]
    Compress --> RequestID[Generate Request ID]
    RequestID --> Logger[Winston Logger]
    Logger --> Route{Route type?}
    
    Route -->|Public| Public[Public endpoints<br/>/health, /ping]
    Route -->|Auth| AuthRoute[Auth routes<br/>/login, /register]
    Route -->|Protected| Protected[Protected routes]
    
    Public --> Response([Send Response])
    
    AuthRoute --> Validate[Express Validator]
    Validate --> AuthController[Auth Controller]
    AuthController --> Response
    
    Protected --> JWT[JWT Verification]
    JWT -->|Invalid| Unauthorized([401 Unauthorized])
    JWT -->|Valid| RoleCheck{Role check<br/>if needed}
    
    RoleCheck -->|Admin only| AdminCheck{Is admin?}
    RoleCheck -->|Any auth user| Controller[Controller]
    
    AdminCheck -->|No| Forbidden([403 Forbidden])
    AdminCheck -->|Yes| Controller
    
    Controller --> Response
    
    Response --> ErrorHandler{Error occurred?}
    ErrorHandler -->|Yes| ErrorMW[Error Handler Middleware]
    ErrorHandler -->|No| Success([Success Response])
    
    ErrorMW --> ErrorLog[Log error to Winston]
    ErrorLog --> ErrorResponse([Error Response])
    
    style JWT fill:#FFD93D
    style Sanitize fill:#6BCF7F
    style CORS fill:#4ECDC4
```

## 9. Technology Stack

```mermaid
mindmap
  root((WorkWhile<br/>Tech Stack))
    Frontend
      React 19
      Redux Toolkit
      React Router
      Vite
      TailwindCSS 4
      Axios
      Recharts
      Lucide Icons
    Backend
      Node.js
      Express.js
      MongoDB
      Mongoose
      JWT Authentication
      BCrypt
    AI & ML
      Xenova Transformers
      all-MiniLM-L6-v2
      Cosine Similarity
    Web Scraping
      Puppeteer
      Stealth Plugin
    Security
      Helmet
      CORS
      Rate Limiting
      Mongo Sanitize
      Express Validator
    Storage
      Local Uploads
      Cloudinary
    Communication
      Nodemailer
      SMTP
    DevOps
      Winston Logger
      Compression
      Dotenv
    Testing
      Jest
      Supertest
      ESLint
```

## 10. Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend - Vercel"
            FE1["trouvetonjob.vercel.app"]
            FE2["workwhile-front.vercel.app"]
        end
        
        subgraph "Backend - Cloud Server"
            BE["Express API Server<br/>Port 5000"]
            PM2["PM2 Process Manager"]
        end
        
        subgraph "Database - MongoDB Atlas"
            DB[(MongoDB Cluster)]
            Replica[(Replica Sets)]
        end
        
        subgraph "CDN & Storage"
            Cloudinary["Cloudinary CDN<br/>(Images, Resumes)"]
            Static["Static Files<br/>(Local/Volume)"]
        end
        
        subgraph "Email Service"
            SMTP["SMTP Server<br/>(Nodemailer)"]
        end
    end
    
    subgraph "Development Environment"
        DevFE["Vite Dev Server<br/>localhost:5173"]
        DevBE["Nodemon<br/>localhost:5000"]
        DevDB[(Local MongoDB)]
        Ngrok["ngrok<br/>(Testing)"]
    end
    
    Users([Users]) --> FE1
    Users --> FE2
    FE1 --> BE
    FE2 --> BE
    BE --> PM2
    BE --> DB
    DB --> Replica
    BE --> Cloudinary
    BE --> Static
    BE --> SMTP
    
    Dev([Developers]) --> DevFE
    DevFE --> Ngrok
    Ngrok --> DevBE
    DevBE --> DevDB
    
    style FE1 fill:#61dafb
    style DB fill:#47A248
    style BE fill:#68a063
    style Cloudinary fill:#3448C5
```

---

## Summary

This documentation provides comprehensive architectural diagrams for the **WorkWhile** job platform application:

1. **MCD (Entity Relationship Diagram)**: Shows the database schema with 5 main entities (User, Job, Company, Application, ScrapingLog) and their relationships
2. **System Architecture**: High-level overview of all system components and their interactions
3. **Backend Layered Architecture**: Shows the separation of concerns in the backend
4. **Authentication Flow**: Sequence diagram for user registration and login
5. **Job Application Flow**: Complete workflow from job search to application status updates
6. **AI-Powered Matching**: How the application uses transformer models for intelligent job matching
7. **Web Scraping**: Architecture for automated job scraping from external sites
8. **Security & Middleware**: Request processing pipeline with all security layers
9. **Technology Stack**: Complete mind map of all technologies used
10. **Deployment Architecture**: Production and development environment setup

### Key Features

- **Full-stack MERN** application (MongoDB, Express, React, Node.js)
- **AI-powered job matching** using transformer models
- **Automated job scraping** from multiple sources
- **Comprehensive authentication** and authorization
- **Multi-role system** (candidates, employers, admins)
- **Real-time application tracking**
- **Scalable microservices-ready** architecture
