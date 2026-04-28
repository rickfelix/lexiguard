# LexiGuard — Specification

## Problem Statement

## Problem & Value Proposition

**Problem**: Average individuals and small business owners cannot afford bespoke legal services for common contracts, forcing them to use generic, ill-fitting templates or sign documents without understanding the risks.

**Value Proposition**: An affordable, AI-powered personal legal counsel for everyday contracts.

**Target Market**: Individuals and small business owners, starting with freelancers in specific verticals like software development.

LexiGuard is an AI-powered SaaS platform that helps individuals and small businesses draft, analyze, and understand legal documents. It uses a specialized AI to translate complex legalese into plain language, identify potential risks, suggest tailored clauses, and ensure compliance with local regulations for common contracts.

## Competitive Landscape

- **LegalZoom** (Threat: H): The dominant market leader for online legal services, offering business formation, legal document templates, and access to attorneys. They are the established, trusted brand for individuals and SMBs seeking to handle legal matters without hiring a traditional law firm.
- **Rocket Lawyer** (Threat: H): A direct competitor to LegalZoom, positioning itself as a more accessible, subscription-based platform for ongoing legal needs. They target families and small businesses with a simple, all-in-one membership model for documents, attorney questions, and e-signatures.
- **Spellbook** (Threat: M): An AI-native legal software tool that functions as a copilot for legal professionals within Microsoft Word. It focuses exclusively on using advanced generative AI (GPT-4) to help draft, review, and negotiate contracts more efficiently.

## Product Roadmap

- **MVP Launch for Freelance Developers** (now): Core AI model for legalese-to-plain-language translation, Risk analysis feature for common software development contracts (MSA, SOW), Template library with customizable service agreements for freelancers
- **Feature Enhancement and User Feedback Integration** (next): AI-powered clause suggestion engine based on user inputs, Integration with a major e-signature platform (e.g., DocuSign), Enhanced compliance checks for a key jurisdiction (e.g., California)
- **SMB Market Expansion** (later): Support for new document types (e.g., partnership agreements, non-disclosure agreements), Multi-user team accounts for small businesses, Localization for a second English-speaking market (e.g., United Kingdom)

## User & Brand Identity

## Customer Personas

### Devan the Developer
- **Role**: Freelance Software Engineer / Consultant
- **Goals**: Secure high-value contracts with clear terms; Protect intellectual property and minimize liability; Reduce administrative time spent on non-coding tasks
- **Pain Points**: Traditional legal fees are prohibitively expensive for reviewing individual project contracts.; Generic online templates feel risky and don't cover software-specific clauses (IP, scope creep, acceptance criteria).; Wastes valuable billable hours trying to understand complex legal jargon.

### Sarah the SMB Owner
- **Role**: Founder / Owner
- **Goals**: Grow the business sustainably; Manage operational costs, including legal expenses; Protect the company from legal and financial liability
- **Pain Points**: A full-time legal counsel or retainer is not financially viable.; Needs various types of contracts (client, vendor, employment) but each feels like a major, unpredictable expense.; Feels intimidated by legal processes and fears making a costly mistake due to misunderstanding a contract.

### Alex the Individual
- **Role**: Renter / Side Hustler / Creative
- **Goals**: Understand a one-off contract (e.g., rental lease, freelance gig) before signing.; Ensure their personal rights are protected without a major cost.; Feel confident and informed when entering an agreement.
- **Pain Points**: Cannot justify hiring a lawyer for a small-scale contract.; Feels powerless and at a disadvantage when presented with a formal document.; Online searches for legal advice are often confusing, contradictory, or not specific to their situation.

## Brand Genome

- **Values**: Clarity, Accessibility, Empowerment
- **Archetype**: The Sage

## Product Name

**Selected**: LexiGuard

LexiGuard is the highest-scoring candidate, demonstrating the strongest and most balanced appeal across all personas and brand criteria. It effectively combines the concepts of law ('Lex') and security ('Guard') into a memorable, professional, and empowering name that directly addresses the core user needs for protection and clarity.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Trust Blue) | `#1D4ED8` | Logo, primary CTAs, headings, key UI elements, links. |
| Secondary (Clarity Gold) | `#FBBF24` | Highlighting key insights, callouts, accents in illustrations, secondary buttons. |
| Neutral (Deep Slate) | `#1F2937` | Body text, paragraphs, secondary information. |
| Background (Light Grey) | `#F9FAFB` | Main background color for the application and website. |

## Typography

- **heading**: Merriweather
- **body**: Inter
- **rationale**: The combination of Merriweather, a highly readable serif font, for headings and Inter, a clean sans-serif, for body text creates a perfect balance. Merriweather projects authority and trustworthiness (The Sage), while Inter ensures clarity and accessibility, embodying the brand's 'authoritative yet 

## Brand Expression

- **Tagline**: "Legal Clarity. On Your Terms."

## Technical Architecture

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

## Screen Layouts

_No wireframe data available._
