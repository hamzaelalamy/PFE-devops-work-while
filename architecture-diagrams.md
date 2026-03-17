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

## 11. Schéma d'Architecture AWS Cloud

```mermaid
graph TB
    subgraph "AWS Cloud — us-east-1"
        subgraph "VPC (10.0.0.0/16)"
            subgraph "Public Subnets"
                PubSub1["Public Subnet AZ-a<br/>10.0.0.0/24"]
                PubSub2["Public Subnet AZ-b<br/>10.0.1.0/24"]
            end

            subgraph "Private Subnets"
                PrivSub1["Private Subnet AZ-a<br/>10.0.10.0/24"]
                PrivSub2["Private Subnet AZ-b<br/>10.0.11.0/24"]
            end

            IGW["Internet Gateway"]
            NAT["NAT Gateway"]

            subgraph "Amazon EKS Cluster"
                subgraph "Node Group (t3.small)"
                    FrontPod["Frontend Pod<br/>(Nginx)"]
                    BackPod["Backend Pod<br/>(Node.js)"]
                    MongoPod["MongoDB Pod"]
                    FluentPod["Fluent Bit<br/>(DaemonSet)"]
                end
                HPA["HPA<br/>Auto-scaling"]
                Ingress["Ingress<br/>Controller"]
            end
        end

        ECR["Amazon ECR<br/>Container Registry"]
        SQS["Amazon SQS<br/>Main Queue"]
        DLQ["Amazon SQS<br/>Dead-Letter Queue"]
        CW["Amazon CloudWatch<br/>Logs + Metrics + Alarms"]
        S3["Amazon S3<br/>Terraform State"]
        IAM["AWS IAM<br/>Roles & Policies"]
    end

    Users([Users]) --> IGW
    IGW --> Ingress
    Ingress --> FrontPod
    FrontPod -->|"/api"| BackPod
    BackPod --> MongoPod
    BackPod -->|"Send Messages"| SQS
    SQS -->|"Failed Messages"| DLQ
    FluentPod -->|"Forward Logs"| CW
    HPA --> BackPod
    HPA --> FrontPod
    NAT --> PrivSub1
    NAT --> PrivSub2
    ECR -->|"Pull Images"| BackPod
    ECR -->|"Pull Images"| FrontPod

    style IGW fill:#FF9900
    style NAT fill:#FF9900
    style ECR fill:#FF9900
    style SQS fill:#FF4F8B
    style DLQ fill:#FF4F8B
    style CW fill:#FF4F8B
    style S3 fill:#3F8624
    style IAM fill:#DD344C
```

## 12. Schéma du Pipeline CI/CD

```mermaid
graph LR
    subgraph "Trigger"
        Push["Push to main/master"]
        PR["Pull Request"]
    end

    subgraph "CI — Continuous Integration"
        Checkout["Checkout Code"]
        SetupNode["Setup Node.js 20"]

        subgraph "Backend CI"
            BInstall["npm ci"]
            BTest["Run Tests<br/>(Jest)"]
            BLint["ESLint"]
        end

        subgraph "Frontend CI"
            FInstall["npm ci"]
            FBuild["Build<br/>(Vite)"]
            FLint["ESLint"]
        end
    end

    subgraph "Build & Push (main only)"
        AWSLogin["AWS OIDC Auth"]
        ECRLogin["ECR Login"]
        BuildBack["Build Backend<br/>Docker Image"]
        BuildFront["Build Frontend<br/>Docker Image"]
        PushECR["Push to ECR<br/>(tag: SHA + latest)"]
    end

    subgraph "CD — Deploy (main only)"
        Kubeconfig["Update kubeconfig"]
        CreateNS["Create Namespace<br/>& Secrets"]
        Kustomize["Kustomize<br/>Set ECR Images"]
        Deploy["kubectl apply<br/>-k k8s/overlays/ecr/"]
        Rollout["Wait for Rollout<br/>(backend, frontend)"]
        Status["Show Pod Status"]
    end

    subgraph "Rollback (manual)"
        RBTrigger["workflow_dispatch"]
        RBUndo["kubectl rollout undo"]
        RBWait["Wait for Rollout"]
    end

    Push --> Checkout
    PR --> Checkout
    Checkout --> SetupNode
    SetupNode --> BInstall --> BTest --> BLint
    SetupNode --> FInstall --> FBuild --> FLint
    BLint --> AWSLogin
    FLint --> AWSLogin
    AWSLogin --> ECRLogin
    ECRLogin --> BuildBack --> PushECR
    ECRLogin --> BuildFront --> PushECR
    PushECR --> Kubeconfig --> CreateNS --> Kustomize --> Deploy --> Rollout --> Status
    RBTrigger --> RBUndo --> RBWait

    style Push fill:#2da44e
    style AWSLogin fill:#FF9900
    style Deploy fill:#326CE5
    style RBTrigger fill:#da3633
```

## 13. Schéma Kubernetes (Pods, Services)

```mermaid
graph TB
    subgraph "Namespace: workwhile"
        subgraph "Ingress"
            ING["workwhile-ingress<br/>(nginx IngressClass)"]
        end

        subgraph "Frontend"
            FSvc["frontend Service<br/>(ClusterIP :80)"]
            FDep["frontend Deployment"]
            FPod1["frontend Pod<br/>(nginx:alpine)"]
            FHPA["frontend-hpa<br/>CPU 70% / Mem 80%<br/>1–5 replicas"]
        end

        subgraph "Backend"
            BSvc["backend Service<br/>(ClusterIP :5000)"]
            BDep["backend Deployment<br/>(RollingUpdate)"]
            BPod1["backend Pod<br/>(node:20)"]
            BHPA["backend-hpa<br/>CPU 70% / Mem 80%<br/>1–5 replicas"]
            BPVC["backend-uploads-pvc"]
        end

        subgraph "MongoDB"
            MSvc["mongodb Service<br/>(ClusterIP :27017)"]
            MDep["mongodb Deployment"]
            MPod1["mongodb Pod<br/>(mongo:7)"]
            MPVC["mongodb-pvc"]
        end

        subgraph "Logging"
            FBDS["fluent-bit DaemonSet"]
            FBPod["fluent-bit Pod<br/>(aws-for-fluent-bit)"]
            FBCM["fluent-bit-config<br/>(ConfigMap)"]
        end

        subgraph "Configuration"
            CM["workwhile-config<br/>(ConfigMap)"]
            SEC["workwhile-secrets<br/>(Secret)"]
        end
    end

    CW["CloudWatch Logs"]
    ECR["Amazon ECR"]

    ING -->|"/ → :80"| FSvc
    FSvc --> FDep --> FPod1
    FHPA -->|"scale"| FDep
    FPod1 -->|"/api → :5000"| BSvc
    BSvc --> BDep --> BPod1
    BHPA -->|"scale"| BDep
    BPod1 --> MSvc --> MDep --> MPod1
    BPod1 --- BPVC
    MPod1 --- MPVC
    BPod1 --- CM
    BPod1 --- SEC
    FBDS --> FBPod
    FBPod --- FBCM
    FBPod -->|"logs"| CW
    ECR -->|"pull"| FPod1
    ECR -->|"pull"| BPod1

    style ING fill:#326CE5,color:#fff
    style FSvc fill:#326CE5,color:#fff
    style BSvc fill:#326CE5,color:#fff
    style MSvc fill:#326CE5,color:#fff
    style CW fill:#FF4F8B
    style ECR fill:#FF9900
```

## 14. Schéma Réseau (VPC, Subnets, Sécurité)

```mermaid
graph TB
    Internet([Internet])

    subgraph "AWS VPC — 10.0.0.0/16"
        IGW["Internet Gateway"]

        subgraph "Public Subnet AZ-a — 10.0.0.0/24"
            NAT["NAT Gateway<br/>+ Elastic IP"]
            PubRT1["Route: 0.0.0.0/0 → IGW"]
        end

        subgraph "Public Subnet AZ-b — 10.0.1.0/24"
            PubRT2["Route: 0.0.0.0/0 → IGW"]
        end

        subgraph "Private Subnet AZ-a — 10.0.10.0/24"
            Node1["EKS Worker Node 1"]
            PrivRT1["Route: 0.0.0.0/0 → NAT"]
        end

        subgraph "Private Subnet AZ-b — 10.0.11.0/24"
            Node2["EKS Worker Node 2"]
            PrivRT2["Route: 0.0.0.0/0 → NAT"]
        end

        subgraph "EKS Cluster Security"
            CLSG["Cluster SG<br/>(EKS-managed)"]
            NSG["Node SG<br/>(EKS-managed)"]
        end

        EKS["EKS Control Plane<br/>(AWS-managed)<br/>Public + Private Endpoints"]
    end

    Internet --> IGW
    IGW --> PubRT1
    IGW --> PubRT2
    NAT --> PrivRT1
    NAT --> PrivRT2
    EKS -->|"API"| CLSG
    CLSG -->|"kubelet"| NSG
    NSG --> Node1
    NSG --> Node2
    Node1 -->|"outbound"| NAT
    Node2 -->|"outbound"| NAT

    style IGW fill:#FF9900
    style NAT fill:#FF9900
    style EKS fill:#326CE5,color:#fff
    style CLSG fill:#DD344C,color:#fff
    style NSG fill:#DD344C,color:#fff
```

---

## Summary

This documentation provides comprehensive architectural diagrams for the **WorkWhile** platform:

### Application Diagrams (1–10)
1. **MCD (Entity Relationship)** — 5 entities and their relationships
2. **System Architecture** — High-level component overview
3. **Backend Layered Architecture** — Separation of concerns
4. **Authentication Flow** — Registration and login sequence
5. **Job Application Flow** — Search to status update workflow
6. **AI-Powered Matching** — Transformer model integration
7. **Web Scraping** — Automated job scraping architecture
8. **Security & Middleware** — Request processing pipeline
9. **Technology Stack** — Complete tech mind map
10. **Deployment Architecture** — Production and dev environments

### Infrastructure & DevOps Diagrams (11–14)
11. **AWS Cloud Architecture** — VPC, EKS, ECR, SQS, CloudWatch layout
12. **CI/CD Pipeline** — GitHub Actions: CI → Build → Deploy → Rollback
13. **Kubernetes Topology** — Pods, Services, HPAs, DaemonSets, ConfigMaps
14. **VPC Network** — Subnets, routing, NAT Gateway, security groups

