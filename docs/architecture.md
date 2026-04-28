# Technical Architecture

## blueprint_technical_architecture

A cloud-native, microservices architecture using a React-based frontend, a Python/AI backend, and a hybrid data storage model to power an AI legal analysis SaaS platform.

**Layers**:
- **presentation**: Next.js (React Framework) — Document Upload & Management Dashboard, Interactive Document Analyzer View, User Authentication Pages (Login, Signup), Account & Subscription Management
- **api**: RESTful API (via FastAPI) — /auth (User registration, login, token refresh), /documents (CRUD operations for documents), /analysis (Endpoints to trigger and retrieve AI analysis)
- **business_logic**: Python (with FastAPI & Hugging Face Transformers) — UserService (Handles user identity and permissions), DocumentProcessingService (Text extraction from various formats), AIAnalysisService (Orchestrates LLM calls for translation, risk identification, and clause suggestion), ComplianceService (Cross-references analysis with a knowledge base of local regulations)
- **data**: PostgreSQL & Pinecone (Vector DB) — Users Table (auth info, subscription status), Documents Table (metadata, link to S3 object), AnalysisResults Table (structured output from AI), ClauseEmbeddings Collection (in Pinecone for similarity search)
- **infrastructure**: AWS & Vercel — Vercel (Frontend Hosting & Deployment), AWS S3 (Secure Document Storage), AWS ECS (Container Orchestration for Python services), AWS RDS for PostgreSQL (Managed Relational Database)

**Auth**: JWT (JSON Web Tokens)

## blueprint_api_contract

**artifactType**: blueprint_api_contract
**summary**: API contract projection from technical architecture

## blueprint_data_model

**artifactType**: blueprint_data_model
**summary**: A cloud-native, microservices architecture using a React-based frontend, a Python/AI backend, and a hybrid data storage model to power an AI legal analysis SaaS platform.

## blueprint_erd_diagram

**artifactType**: blueprint_erd_diagram
**summary**: ERD projection from technical architecture
**diagram format**: logical_only

## blueprint_schema_spec

**artifactType**: blueprint_schema_spec
**summary**: Schema specification projection from technical architecture
