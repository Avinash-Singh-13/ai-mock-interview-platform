# Build a Production-Grade AI Mock Interview Platform

## Who this is for

I'm a senior full stack engineer building a modern AI-powered mock technical interview platform designed to simulate realistic software engineering interviews at scale.

This is not a tutorial project, beginner coding playground, or simplified CRUD application. The goal is to build a production-grade SaaS interview platform that could realistically be used by engineering organizations, coding bootcamps, universities, hiring teams, and technical interview preparation platforms.

I need another senior engineer (or a highly capable LLM) to architect and implement the entire platform from scratch using modern full stack engineering practices, scalable architecture, secure authentication systems, and production-ready real-time communication workflows.

This document is the complete engineering specification. Read every requirement carefully before generating code. Every requirement defined here is mandatory and should be treated as a production-level engineering requirement, not an optional suggestion.

---

# The Big Picture

The system simulates a realistic online software engineering interview environment where candidates can participate in AI-generated coding interviews using collaborative coding editors, live communication systems, AI-generated evaluation workflows, and interview tracking dashboards.

Think of this as the infrastructure behind a modern technical interview platform used by real engineering companies.

The platform must support:

- AI-generated coding interview sessions
- real-time collaborative coding
- live webcam/audio communication
- interviewer and candidate workflows
- AI-generated feedback generation
- interview analytics and tracking
- persistent interview history
- secure authentication and authorization
- real-time synchronization across multiple clients

The architecture must support multiple concurrent interview rooms while maintaining synchronization consistency, stable Socket.io communication, scalable backend processing, secure authentication workflows, and production-level performance optimization.

The implementation must prioritize:

- scalable architecture
- reusable frontend components
- maintainable code organization
- responsive UI/UX
- clean backend separation
- secure authentication workflows
- fault-tolerant real-time communication
- efficient state management
- optimized API handling
- deployment-ready infrastructure

The implementation must strictly follow the architecture, workflows, and engineering standards defined in this specification.

Every component, API route, database model, authentication layer, Socket.io workflow, Monaco collaboration system, WebRTC communication flow, and AI integration must be fully implemented as part of a cohesive production-grade application.

---

# Fixed Tech Stack

The technology stack is predefined and must not be changed.

## Frontend

Use:

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Monaco Editor
- Socket.io Client

The frontend is responsible for:

- rendering the interview interface
- managing protected routes
- handling authentication state
- maintaining real-time Socket.io connections
- rendering collaborative Monaco editor sessions
- handling AI-generated interview content
- managing interview room workflows
- rendering responsive dashboards
- displaying webcam/audio communication interfaces
- synchronizing real-time interview state

The UI should feel like a modern SaaS engineering platform with responsive layouts, smooth animations, accessible design, clean typography, dark mode support, and production-grade usability.

---

## Backend

Use:

- Node.js
- Express.js or custom Next.js server
- Socket.io
- JWT Authentication
- bcrypt
- dotenv

The backend must handle:

- JWT authentication workflows
- session management
- interview room management
- AI request processing
- Socket.io synchronization
- collaborative editor events
- WebRTC signaling
- dashboard data retrieval
- API validation
- MongoDB persistence
- interview history tracking

The backend architecture must separate:

- route handlers
- business logic
- database operations
- authentication middleware
- Socket.io logic
- AI integration services
- validation logic

---

## Database

Use:

- MongoDB
- Mongoose

MongoDB must persist:

- user accounts
- interview sessions
- coding submissions
- AI-generated feedback
- interviewer notes
- dashboard analytics
- authentication records
- interview metadata

Schema design must remain scalable, maintainable, and production-ready using properly structured Mongoose models and indexed queries.

---

## AI Integration

Use:

- OpenAI API

The AI integration layer must support:

- coding question generation
- AI-generated interview feedback
- interview summaries
- correctness analysis
- optimization suggestions
- time complexity analysis
- space complexity analysis

If the `OPENAI_API_KEY` is unavailable, the system must automatically return fallback mock interview questions and fallback AI feedback so local development continues functioning without external AI access.

---

## Real-Time Communication

Use:

- Socket.io
- WebRTC

Socket.io must handle:

- collaborative editor synchronization
- typing synchronization
- room-based communication
- reconnect handling
- shared interview state updates
- live synchronization events
- collaborative coding workflows

WebRTC must handle:

- webcam access
- microphone access
- peer-to-peer communication
- audio/video streaming
- join/leave room handling
- media permission handling
- connection lifecycle management

---

# Project Structure

Organize the codebase using a clean production-style architecture.

```txt
project-root/
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── interview/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── AuthPanel.tsx
│   ├── CodeRoom.tsx
│   ├── DashboardShell.tsx
│   ├── ThemeToggle.tsx
│   └── VideoPanel.tsx
│
├── lib/
│   ├── ai.ts
│   ├── api.ts
│   ├── auth.ts
│   └── mongodb.ts
│
├── models/
│   ├── Interview.ts
│   └── User.ts
│
├── store/
│   └── useAuth.ts
│
├── types/
│   └── index.ts
│
├── middleware.ts
├── server.js
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── README.md
└── .env.local
```

The architecture must maintain clean separation of concerns between frontend rendering, backend APIs, business logic, real-time communication, authentication workflows, database operations, and AI integrations.

## Candidate Workflow

The platform must allow candidates to:

1. Register and login securely
2. Access their dashboard
3. Select interview category:
- DSA
- Frontend
- Backend
4. Select difficulty:
- Easy
- Medium
- Hard
5. Start an interview session
6. Receive AI-generated coding questions
7. Collaborate inside a shared Monaco editor
8. Communicate through webcam/audio
9. Submit coding solutions
10. Receive AI-generated feedback
11. View previous interview history
12. Interviewer Workflow

The platform must allow interviewers to:

- join interview rooms
- monitor live code changes
- watch real-time typing activity
- leave interview notes
- review candidate submissions
- access previous interview sessions
- monitor collaborative coding progress
# Data Processing & Application Flow

The application must implement a complete frontend-backend communication architecture.

## Frontend Responsibilities

The frontend must:

- collect authentication credentials
- manage interview room state
- maintain Socket.io connections
- render Monaco editor updates
- display AI-generated questions
- manage WebRTC streams
- synchronize dashboards
- maintain protected routes
- manage Zustand authentication state
- render responsive layouts
## Backend Responsibilities

The backend must:

- validate JWT authentication
- process API requests
- synchronize collaborative editor events
- manage interview sessions
- process AI-generated workflows
- persist interview data
- manage Socket.io rooms
- validate request payloads
- manage MongoDB communication
- generate structured JSON responses
## MongoDB Responsibilities

MongoDB must store:

- registered users
- interview sessions
- coding submissions
- AI-generated feedback
- interviewer notes
- dashboard history
- authentication records
- interview metadata
## Socket.io Responsibilities

Socket.io must manage:

- real-time collaborative editing
- typing synchronization
- room joining/leaving
- reconnect handling
- shared interview state updates
- real-time synchronization between interviewer and candidate
## WebRTC Responsibilities

WebRTC must manage:

- webcam/audio communication
- peer-to-peer streaming
- media permissions
- connection lifecycle handling
- live communication sessions
## Authentication Requirements

Implement:

1. JWT authentication
2. bcrypt password hashing
3. protected routes
4. middleware-based authentication
5. session persistence
6. secure login workflows

Passwords must never be stored in plaintext.

Authentication middleware must protect dashboard and interview routes from unauthorized access.

## Real-Time Coding Requirements

Implement a collaborative Monaco editor with:

1. real-time synchronization
2. shared editing
3. syntax highlighting
4. multi-language support
5. reconnect handling
6. collaborative coding sessions
7. room-based synchronization

The editor must synchronize updates using Socket.io without causing UI lag or state conflicts.

## Video/Audio Requirements

Implement:

1. webcam access
2. microphone access
3. peer-to-peer communication
4. join/leave room handling
5. permission handling
6. real-time video/audio communication

The communication workflow must use WebRTC for low-latency streaming.

## API Requirements

Generate APIs for:

1. authentication
2. interview creation
3. AI question generation
4. AI feedback generation
5. dashboard retrieval
6. interview history
7. session validation

All APIs must:

- return structured JSON responses
- validate incoming requests
- return correct HTTP status codes
- handle invalid requests gracefully
- avoid exposing sensitive server information
## Error Handling & Input Validation

The application must implement robust frontend and backend validation systems.

### Frontend Validation

Frontend validation must handle:

1. empty fields
2. invalid credentials
3. invalid interview sessions
4. disconnected Socket.io events
5. failed media permissions
6. reconnect scenarios
7. invalid API responses

The UI must display user-friendly notifications and fallback states instead of crashing.

### Backend Validation

Backend validation must handle:

1. invalid JWT tokens
2. malformed request payloads
3. unauthorized access
4. invalid MongoDB IDs
5. invalid interview sessions
6. failed Socket.io events
7. OpenAI API failures
8. database connection failures
9. Error Response Requirements

All backend errors must:

- return proper HTTP status codes
- follow structured JSON formatting
- avoid leaking sensitive server information
- provide meaningful developer-friendly messages

Example:
```

{
  "success": false,
  "message": "Interview session not found"
}
```

The platform must gracefully recover from runtime failures without crashing the application.

## UI/UX Requirements

The frontend must:

1. support dark mode
2. be responsive across mobile, tablet, and desktop
3. use smooth Framer Motion animations
4. maintain consistent spacing and typography
5. prioritize usability and accessibility
6. provide production-style SaaS UI design

Landing page must include:

- hero section
- features section
- CTA buttons
- testimonials/stats
- footer

## Deployment Requirements

The application must support:

1. Railway deployment
2. Render deployment
3. MongoDB Atlas
4. environment variable configuration
5. persistent Socket.io runtime

The project must work after:
```
npm install
npm run dev
```
## Documentation Requirements

Generate:

1. README.md
2. setup instructions
3. folder structure explanation
4. environment variable guide
5. deployment instructions
6. API overview
7. architecture explanation
8. development workflow documentation
## Explicit Deliverables

The response MUST generate:

1. Complete folder structure
2. package.json
3. MongoDB schemas
4. JWT authentication system
5. API routes
6. Zustand stores
7. Socket.io logic
8. WebRTC implementation
9. Monaco collaborative editor
10. OpenAI integration layer
11. Dashboard pages
12. Environment configuration
13. README.md
## Strict Constraints

The implementation MUST:

1. use TypeScript except for server.js
2. use Next.js App Router
3. include MongoDB schemas
4. include multiple API routes
5. implement JWT middleware
6. implement Socket.io rooms
7. implement reconnect handling
8. implement AI fallback responses
9. generate runnable code


## Output Format Requirements

Generate BOTH:

- Architecture explanation
- Complete runnable implementation

Output files sequentially using:
```

// file: package.json
// file: app/page.tsx
// file: lib/socket.ts
```
Continue until the repository is fully generated.

## Final Objective

The final result should feel like a realistic modern AI-powered technical interview platform with:

1. production-style architecture
2. maintainable code organization
3. modern SaaS UI/UX
4. AI-powered interview workflows
5. real-time collaboration
6. secure authentication systems
7. deployment-ready infrastructure
8. practical local development setup
9. scalable engineering design
10. readable and extensible codebase
