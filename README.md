# AI Mock Interview Platform

[![Stack: Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square&logo=next.dot.js)](https://nextjs.org/)
[![Stack: Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Stack: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Stack: Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101?style=flat-square&logo=socket.dot.io)](https://socket.io/)

This repository contains a benchmark evaluation project for comparing LLM-generated implementations of a production-style AI Mock Interview Platform. The project includes the original prompt, response comparisons, evaluation justifications, and a complete production-quality reference implementation.

The platform simulates a real technical interview environment with collaborative coding, AI-generated interview questions, WebRTC communication, live synchronization, authentication, and interview analytics.

---

## 📂 Repository Structure

```txt
.
├── prompt.md                   # The core multi-layered prompt used for benchmarking
├── justification.md            # Detailed comparative analysis and grading metrics
├── README.md                   # Main documentation file
│
├── responses/                  # Raw, unaltered outputs from tested LLM models
│   ├── response_a.txt
│   ├── response_b.txt
│   └── better_response.txt
│
├── golden_response/            # The production-ready reference codebase
│   ├── app/                    # Next.js App Router features and routing pages
│   ├── components/             # Reusable UI widgets and atomic layouts
│   ├── lib/                    # Validation schemas, utility helpers, and AI clients
│   ├── models/                 # Database structure configurations and collections
│   ├── store/                  # Zustand global application state managers
│   ├── public/                 # Static graphical assets and public resources
│   ├── package.json            # Active script targets and runtime dependencies
│   ├── tsconfig.json           # Type-checking rules and project absolute aliases
│   ├── server.js               # Dedicated custom Express, WebRTC, and Socket.io gateway
│   ├── .env.example            # Boilerplate configuration template for environment settings
│   └── README.md               # Targeted local running steps for the reference build
│
└── screenshots/                # Visual collection of system layout interfaces

```

---

## 🚀 Project Overview

The **Golden Response** implementation is a full-stack, AI-powered mock interview platform built using modern web technologies.

### Core Features

* **AI-Generated Coding Content:** On-the-fly technical problem synthesis matched to specified difficulty tiers and target roles.
* **Monaco Collaborative Code Editor:** Real-time synchronized developer sandbox with basic multi-cursor awareness.
* **Socket.io Live Sync:** Low-latency continuous state mirroring between candidates and mock reviewers.
* **WebRTC Video & Audio Layers:** P2P media pipes establishing direct peer connections inside the virtual testing room.
* **Secure Session Workflows:** Complete JWT authorization flows baked alongside secure bcrypt password storage schemes.
* **Persistent History Tracking:** Comprehensive MongoDB models capturing candidate answers, time metrics, and performance changes.
* **Automated Feedback Analytics:** AI processing of session history, grading syntax efficiency, edge cases, and architectural choices.

### Evaluation Benchmarking Criteria

The target purpose of this benchmark is to evaluate how different LLMs handle:

1. **Large-scale architecture generation** (multi-file layouts over single large script blocks).
2. **Production-oriented system design** (handling connection pools, detached socket ports, and stream routes).
3. **Maintainability** (reusable UI layers, strongly typed schema definitions, and proper abstraction bounds).
4. **Implementation realism** (avoiding placeholders, truncated scripts, or impossible dummy logic).
5. **Code organization** and logical distribution across structural domains.
6. **Technical correctness** regarding production-ready edge cases.

---

## 🛠️ Technology Stack

| Architecture Layer | Core Selections |
| --- | --- |
| **Frontend Framework** | Next.js, TypeScript, Tailwind CSS, Framer Motion |
| **State Management** | Zustand |
| **Editor Workspace** | Monaco Editor |
| **Backend Core** | Node.js, Express.js, JWT Authentication, bcrypt |
| **Persistence Engine** | MongoDB, Mongoose ODM |
| **Real-Time Network** | Socket.io, WebRTC Peer-to-Peer Protocol |
| **Intelligence Engine** | OpenAI API |

---

## 💻 Running the Golden Response

Follow these instructions to quickly instantiate the reference baseline app locally.

### 1. Install Dependencies

Navigate into the workspace and run the initial setup routine:

```bash
npm install

```

### 2. Environment Setup

Create a `.env.local` configuration file:

```ini
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mock_interview
JWT_SECRET=replace-with-a-long-random-secret
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_APP_URL=http://localhost:3000

```

### 3. Launch Development Server

```bash
npm run dev

```

Open your local browser gateway to evaluate the build interface at: **`http://localhost:3000`**

> [!NOTE]
> * **Local Fallback Operations:** If an active `OPENAI_API_KEY` is not provided, the application uses fallback interview questions and feedback responses for local development.
> * **Database Dependencies:** MongoDB is required for persistent authentication and interview history tracking.
> * **Real-Time Layer:** Socket.io and WebRTC power the real-time collaboration and communication layer.
> * **Design Strategy:** The architecture is intentionally modular and designed for readability, maintainability, and realistic production workflows.
> 
> 

---

## 📊 Evaluation Methodology

The benchmark compares different LLM-generated responses using eight distinct engineering metrics:

* **Correctness:** Free of runtime syntax breaks, logic bugs, or API integration errors.
* **Completeness:** Codeblocks finish naturally without artificial code truncations or lazy code comments.
* **Relevance:** Adherence to specific prompt mandates without unnecessary feature creep.
* **Architecture Quality:** Modular, clean design patterns separating data logic from rendering structures.
* **Maintainability:** Easily understood code structure utilizing standard clean-code patterns.
* **Production Readiness:** Use of connection safeguards, type validations, input sanitization, and basic error catch traps.
* **Edge-Case Handling:** Defensive checking for missing network connections, invalid inputs, and dead server configurations.
* **Clarity & Organization:** Clear documentation, directory trees, and explicit running explanations.

The final evaluation focuses not only on generated code volume, but also on implementation realism, practical usability, and engineering quality.


