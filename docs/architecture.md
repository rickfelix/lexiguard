# Technical Architecture

## blueprint_technical_architecture

A serverless architecture leveraging Vercel for hosting and Supabase for data and auth, designed to power an AI-driven legal document analysis platform for freelancers and small businesses.

**Layers**:
- **presentation**: React + Vite + Tailwind — Document Editor/Uploader, Analysis Dashboard, User Profile Management, Clause & Template Library
- **api**: REST via Vercel Functions — /documents (CRUD for documents), /analysis (Endpoints to trigger AI processing), /users (User profile and settings management), /clauses (Access to clause library)
- **business_logic**: Node.js (TypeScript) — Document Parsing Service, AI Analysis Service (integrates with external AI model), Risk Identification Service, Clause Suggestion Service
- **data**: PostgreSQL via Supabase — Users Table, Documents Table, Analysis_Results Table (using JSONB for AI output), Clauses Table
- **infrastructure**: Vercel + Replit + Supabase — Vercel Hosting (Frontend & Serverless Functions), Supabase Cloud (Database & Authentication), External AI Model API (e.g., OpenAI, Anthropic), Replit Development Environment

**Auth**: Supabase Auth

## blueprint_data_model

**artifactType**: blueprint_data_model
**summary**: A serverless architecture leveraging Vercel for hosting and Supabase for data and auth, designed to power an AI-driven legal document analysis platform for freelancers and small businesses.

## blueprint_erd_diagram

**artifactType**: blueprint_erd_diagram
**summary**: ERD projection from technical architecture
**diagram format**: logical_only

## blueprint_api_contract

**artifactType**: blueprint_api_contract
**summary**: API contract projection from technical architecture

## blueprint_schema_spec

**artifactType**: blueprint_schema_spec
**summary**: Schema specification projection from technical architecture
