# 📚 BiogenAI - Professional PPTX Bio Generator
## Full-Stack Training Plan 2026 | Angular + Node.js + PostgreSQL

**Version:** Beginner-Focused, No Prior Experience Required

---

## 📋 Quick Navigation
- [Project Purpose](#project-purpose)
- [Tech Stack](#tech-stack-angular--nodejs)
- [Architecture](#architecture-overview)
- [Training Roadmap](#complete-training-roadmap-10-phases)
- [Timeline](#timeline--estimation)
- [Learning Outcomes](#learning-outcomes)

---

## 🎯 Project Purpose

### **What You're Building**
**BiogenAI** = A web app that converts employee resumes into professional PowerPoint presentations (PPTX) using AI.

**User Journey:**
```
1. Employee enters name & uploads resume (TXT/PDF/DOCX)
  ↓
2. System extracts key information (skills, experience)
  ↓
3. OpenAI GPT-4 generates professional bio (removes company names)
  ↓
4. Creates formatted PowerPoint presentation
  ↓
5. User downloads ready-to-use PPTX file
```

### **Why This Project?**
- ✅ **Real value:** Solves an actual business problem
- ✅ **Full-stack:** Learn frontend, backend, database, AI, deployment
- ✅ **Industry skills:** Uses modern technologies companies actually use
- ✅ **Portfolio-worthy:** Shows employers you can build production apps
- ✅ **Teaches fundamentals:** Not just copying tutorials

### **Learning Goals**
By completing this project, you'll understand:
- How modern web applications work (frontend -> backend -> database)
- Building professional Angular components
- Creating REST APIs with Express
- Database design with PostgreSQL
- AI integration (OpenAI API)
- Testing and deployment
- Professional development practices

---

## 🔧 Tech Stack (Angular + Node.js)

### **Frontend (What User Sees)**
| Tech | Version | Purpose |
|------|---------|---------|
| **Angular** | 19+ | Framework for building interactive UI |
| **TypeScript** | 5.6+ | Type-safe JavaScript (catches bugs early) |
| **TailwindCSS** | v4.1 | Easy styling framework |
| **RxJS** | 7.8+ | Handles async data (built into Angular) |
| **Angular Material** | 19+ | Pre-built professional UI components |

**Why Angular?**
- Complete framework (doesn't require 10 separate libraries)
- TypeScript built-in (forces good habits)
- Great learning curve (clear structure)
- Industry standard (Google, Microsoft, IBM use it)
- Tests built-in (Jasmine)

### **Backend (Server/Business Logic)**
| Tech | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20+ LTS | JavaScript runtime (run JS on server) |
| **Express.js** | 5.2+ | Web framework (route requests) |
| **TypeScript** | 5.6+ | Type safety (same as frontend!) |
| **Prisma ORM** | Latest | Type-safe database queries |
| **PostgreSQL** | 16 | Relational database |
| **Docker** | Latest | Container (same environment everywhere) |

**Why this stack?**
- **JavaScript everywhere:** Frontend & backend use same language
- **TypeScript:** Prevents bugs, better IDE support
- **Express:** Minimal, teaches HTTP fundamentals
- **Prisma:** Doesn't hide database complexity, great for learning
- **Docker:** Professional practice, consistent setup

### **AI & Supporting Tools**
| Tool | Purpose |
|------|---------|
| **OpenAI API** | GPT-4 for bio generation |
| **PptxGenJs** | Create PowerPoint files |
| **Jasmine** | Test framework (built into Angular) |
| **Jest** | Backend unit tests |
| **Supertest** | Test API endpoints |
| **Docker Compose** | Run PostgreSQL easily |

---

## 🏗️ Architecture Overview

### **How Everything Connects**
```
+----------------------------------------------------+
|        ANGULAR FRONTEND (localhost:4200)           |
|                                                    |
|  +-----------------+      +------------------+     |
|  |  Upload Form    |      |  Bio Display     |     |
|  |  Component      |      |  Component       |     |
|  +-----------------+      +------------------+     |
|           |                        |               |
|           +-----------+------------+               |
|                       |                            |
|          Angular HttpClient (RxJS)                 |
+----------------------+-----------------------------+
           | HTTP (JSON)
           v
+----------------------------------------------------+
|        EXPRESS BACKEND (localhost:3000)            |
|                                                    |
|   POST /api/resume/upload                           |
|   POST /api/bio/generate                            |
|   GET  /api/bio/:id                                 |
|   GET  /api/employees                               |
|                                                    |
|            Prisma ORM                               |
+----------------------+-----------------------------+
           |
     +--------------+--------------+
     v              v              v
 +-----------+   +-----------+   +----------+
 | Database  |   | OpenAI API|   | PptxGen  |
 | (Docker)  |   |           |   | Library  |
 +-----------+   +-----------+   +----------+
```

### **What Happens When User Uploads Resume**
```
1. Angular form captures name & file
                    ↓
2. Calls Express: POST /api/resume/upload
                    ↓
3. Express validates & stores resume in PostgreSQL
                    ↓
4. Returns resume ID to Angular
                    ↓
5. Angular calls: POST /api/bio/generate (resumeID)
                    ↓
6. Express calls OpenAI API with resume text
                    ↓
7. OpenAI returns professional bio
                    ↓
8. Express generates PPTX and stores in database
                    ↓
9. Returns bio/PPTX to Angular
                    ↓
10. Angular displays and user downloads PPTX
```

---

## 🛡️ Resilience Strategy: "Defense in Depth"

**Goal:** Handle failures gracefully at every layer. Each layer protects the one above.

### **Resilience at Multiple Layers**

```
+----------------------------------------------+
| FRONTEND (Angular 4200)                      |
| Timeout: 30s | Retry: 2x (network)           |
| User sees: Loading spinner, error message    |
+----------------------+-----------------------+
                | HTTP (resilient call)
                v
+----------------------------------------------+
| BACKEND (Express 3000)                       |
| DB Timeout: 5s | DB Retry: 2x                |
| API Timeout: 10s | API Retry: 3x             |
| Circuit Breaker (prevent cascade)            |
+----------------------+-----------------------+
                |
        +----------+----------+
        v          v          v
  +----------------------------------+
  | DOWNSTREAM SERVICES              |
  | - OpenAI API (timeout: 10s)      |
  | - PostgreSQL (timeout: 5s)       |
  | - External services (timeout: 8s)|
  +----------------------------------+
```

### **Layer-by-Layer Strategy**

| Layer | Timeout | Retry | Pattern | When | Example |
|-------|---------|-------|---------|------|---------|
| Angular -> Express | 30s | 2x | HTTP Interceptor | Phase 2 | Network blip |
| Express -> PostgreSQL | 5s | 2x | Prisma error handling | Phase 1 | DB connection timeout |
| Express -> OpenAI API | 10s | 3x | axios + exponential backoff | Phase 4 | API slow/overloaded |
| Express -> Cache/Redis | 1s | 1x | Fail-open (use stale) | Phase 9+ | Cache miss |
| Express Health Check | - | - | Liveness probe | Phase 8 | K8s readiness |

### **Why Multiple Layers?**

- **Frontend timeout (30s):** User can't wait forever
- **Backend -> API timeout (10s):** If external API doesn't respond in 10s, it's probably down
- **Backend -> DB timeout (5s):** DB should be instant; if not, something's wrong
- **Retry strategies differ:** Retry network errors, NOT logic errors (4xx, validation failures)
- **Circuit breaker:** Prevent hammering failing services (stop after 5 failures, wait 1 minute)

---

## 📚 Complete Training Roadmap (10 Phases)

### **PHASE 1: FOUNDATION SETUP (Days 1-2, ~2 hours)**

#### 🎯 Goal
Get Angular frontend, Express backend, and PostgreSQL running locally.

#### What You'll Learn
- How to create an Angular project
- Basic Express server structure
- Docker for running databases
- Database modeling with Prisma
- **Database resilience patterns** (timeouts, retries)
- Git basics for version control

#### Steps (8 detailed steps)

**1.1: Initialize Angular Project (10 min)**
Purpose: Create the Angular app shell and dev server.
Instructions: Install Angular CLI, scaffold the project, and run the dev server.
Best practices: Use routing, keep styles simple, and skip SSR for this app.
```bash
npm install -g @angular/cli  # One-time setup
ng new biogenai-frontend --routing --style=css
cd biogenai-frontend
ng serve  # Runs on localhost:4200
```

**Important Details About This Command:**
- `--routing` = Adds routing module (for multiple pages/components)
- `--style=css` = Use plain CSS (not SCSS or LESS)
- **⚠️ Important:** When prompted "Would you like to add Server Side Rendering (SSR)?", answer **NO**
  - **Why?** SSR is for public websites needing Google SEO. BiogenAI is a business tool.
  - SSR adds complexity and requires a Node.js server just to render Angular
  - You already have Express as your backend - keep it separate from frontend
  - **Learn later:** SSR is useful for blogs, news sites, e-commerce product pages
- **⚠️ Important:** When prompted "Would you like to add routing animations?", you can answer **YES** or **NO** (optional for this project)
- Angular CLI will create a complete project structure (see below)
- Installation takes ~2-3 minutes

**1.2: Initialize Express Backend (10 min)**
Purpose: Create the backend project with Express and TypeScript.
Instructions: Initialize npm and install runtime + dev dependencies.
Best practices: Keep dependencies minimal and type everything from the start.
```bash
mkdir biogenai-backend && cd biogenai-backend
npm init -y
npm install express cors dotenv typescript
npm install -D @types/express @types/node ts-node
```

**1.3: Setup TypeScript Backend Config (10 min)**
Purpose: Enable strict, predictable TypeScript compilation.
Instructions: Create `tsconfig.json` and a `src/` folder.
Best practices: Use strict mode and output to `dist/`.
- Create `tsconfig.json` with proper settings
- Create `src/` folder structure

**1.4: Create Basic Express Server (15 min)**
Purpose: Prove the backend boots and responds to requests.
Instructions: Create `src/index.ts`, add CORS, and expose `/api/health`.
Best practices: Keep startup minimal and log the port on boot.
- `src/index.ts`: Basic Express app with CORS
- Runs on localhost:3000
- Creates `/api/health` endpoint for testing

**1.5: Start PostgreSQL with Docker (15 min)**
Purpose: Run a local database without manual installation.
Instructions: Start the docker-compose stack.
Best practices: Use named volumes for persistence.
```bash
docker-compose up -d  # Starts database in background
```
- Database runs on localhost:5432
- Easy to reset with `docker-compose down`

**1.6: Setup Prisma ORM (20 min)**
Purpose: Add a typed database layer.
Instructions: Install Prisma client + CLI, then initialize Prisma.
Best practices: Keep `schema.prisma` committed and use `.env` for DB URL.
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

**1.7: Create Database Schema (25 min)**
Purpose: Define the data model for employees, resumes, and bios.
Instructions: Add `Employee`, `Resume`, `GeneratedBio` models and relations.
Best practices: Include created/updated timestamps on each model.
- Define 3 tables: `Employee`, `Resume`, `GeneratedBio`
- Set up relationships (one employee -> many resumes)
- Configure timestamps for auditing

**1.8: Run Database Migration (15 min)**
Purpose: Apply the schema to the database and verify it.
Instructions: Run Prisma migration and open Prisma Studio.
Best practices: Use descriptive migration names.
```bash
npx prisma migrate dev --name init
```
- Creates actual tables in PostgreSQL
- Runs Prisma Studio to verify

**1.8a: Add Database Resilience Patterns (20 min) - CRITICAL**
Purpose: Make database calls resilient to transient failures.
Instructions: Add a retry helper and wrap key Prisma calls.
Best practices: Only retry transient errors and log retries.

Database calls can fail (connection timeout, lock timeout, etc.). Add retry logic.

**Create a database utility service:**

```typescript
// src/lib/db-retry.ts
export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  delayMs: 100
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_OPTIONS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;

      // Prisma error codes for retriable errors
      const RETRIABLE_CODES = ['P1008', 'P1009']; // Connection timeout, query timeout
      
      const isRetriable = 
        RETRIABLE_CODES.includes(err.code) || 
        err.message?.includes('timed out') ||
        err.message?.includes('connection');

      if (!isRetriable || attempt === options.maxAttempts) {
        throw err;
      }

      // Exponential backoff: 100ms, 200ms, 400ms
      const delay = options.delayMs * Math.pow(2, attempt - 1);
      console.log(`DB Error: ${err.code}. Retry ${attempt}/${options.maxAttempts} in ${delay}ms`);
      
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw lastError;
}
```

**Use in Express routes:**

```typescript
// src/routes/resume.ts
import { withRetry } from '../lib/db-retry';
import { prisma } from '../db';

app.post('/api/resume/upload', async (req, res) => {
  try {
    const resume = await withRetry(async () => {
      return await prisma.resume.create({
        data: {
          employeeName: req.body.name,
          fileName: req.file.originalname,
          fileBuffer: req.file.buffer
        }
      });
    }, { maxAttempts: 3, delayMs: 100 });

    res.json({ resumeId: resume.id });
  } catch (err) {
    console.error('DB error after retries:', err);
    res.status(503).json({ error: 'Database error. Try again later.' });
  }
});

app.get('/api/employees', async (req, res) => {
  const employees = await withRetry(
    () => prisma.employee.findMany(),
    { maxAttempts: 2, delayMs: 50 }
  );
  res.json(employees);
});
```

**Database Resilience Checklist:**
- ✅ Timeout: 5 seconds (Prisma default is 10s)
- ✅ Retry: 2-3 attempts on transient errors (P1008, P1009)
- ✅ NOT retriable: Logic errors (unique constraint, invalid data)
- ✅ Exponential backoff (100ms, 200ms, 400ms)
- ✅ Log retry attempts for debugging
- ✅ Return 503 (Service Unavailable) to frontend on failure

**Checklist after Phase 1:**
- ✅ Angular running on port 4200
- ✅ Express running on port 3000
- ✅ PostgreSQL running on port 5432
- ✅ Can see database tables in Prisma Studio
- ✅ `/api/health` endpoint responds
- ✅ **Database retry utility created and tested**

---

### **PHASE 2: ANGULAR COMPONENTS (Days 2-3, ~2 hours)**

#### 🎯 Goal
Build professional Angular components for uploading resumes and displaying results.

#### What You'll Learn
- Angular component structure
- Two-way data binding
- Form validation
- Error/success messages
- Component communication

#### Steps (8 detailed steps)

**2.1: Generate Components with Angular CLI (10 min)**
Purpose: Create the core UI building blocks.
Instructions: Generate `resume-upload` and `bio-display` components.
Best practices: Keep components standalone and minimal at first.
```bash
ng generate component components/resume-upload
ng generate component components/bio-display
```

**2.2: Build Resume Upload Component (25 min)**
Purpose: Collect name + resume file and show upload status.
Instructions: Add form fields, file picker, and submit handler.
Best practices: Validate inputs early and show clear errors.
- Implement the resume upload form and component logic.
- Handle file selection and UI state management.

- Add `<app-resume-upload></app-resume-upload>` to your main app template (e.g., `app.html`) for direct preview in Angular 17+ standalone projects.
- Or, add a route in your app routing file (e.g., `app.routes.ts`):
```typescript
import { ResumeUpload } from './components/resume-upload/resume-upload';
export const routes = [
  { path: 'upload', component: ResumeUpload },
  // ...other routes
];
```
- Use `<router-outlet></router-outlet>` in your main template for routing.
- This step ensures you can preview and debug the styling in Step 2.3.

**2.3: Style with TailwindCSS (20 min)**
Purpose: Make the upload UI clean and readable.
Instructions: Install Tailwind and apply utility classes.
Best practices: Keep styles consistent and reusable.
- Run `ng add tailwindcss` in your frontend folder.
- Use Tailwind utility classes in your resume-upload component template for a modern look.

**2.3a: Preview and Debug Styling (5 min)**
Purpose: Confirm the UI renders as expected.
Instructions: Run the dev server and visually inspect the page.
Best practices: Fix layout issues before wiring data.
- Start your dev server (`ng serve` or `npm run dev`).
- Open your browser to `http://localhost:4200/` or the route you configured.
- Confirm the resume-upload component is visible and styled.
- Debug and adjust styling as needed.

**2.3b: Register provideHttpClient() in app.config.ts (CRITICAL)**
Purpose: Enable Angular HttpClient globally.
Instructions: Add `provideHttpClient()` to `app.config.ts` providers.
Best practices: Do this before any service uses HttpClient.
- Angular's `HttpClient` will not work unless `provideHttpClient()` is added to app.config.ts providers.
- Without it, HTTP calls silently fail - no errors, no data.
- Must be done BEFORE any service uses `HttpClient`.
```typescript
import { provideHttpClient } from '@angular/common/http';
// Add provideHttpClient() to the providers array in app.config.ts
```

**2.4: Implement Resume Upload from Angular Frontend (15 min)**
Purpose: Send files from the UI to the backend endpoint.
Instructions: Wire the component to the upload service and test.
Best practices: Show loading/success/error states.
- Wire the upload form to the service and confirm end-to-end upload works from UI to backend.
- See ANGULAR_BEGINNERS_GUIDE.md for the full walkthrough.

**2.5: List Uploaded Resumes (30 min)**
Purpose: Let users see what has been uploaded.
Instructions: Build list endpoint, fetch via service, render in UI.
Best practices: Handle loading, empty, and error states.
- Build the backend list endpoint, add Angular service methods, and render the list UI.
- Includes steps 2.5.1 through 2.5.8 in the detailed guide.

**2.6: Refactor Backend into Modular Structure (20 min)**
Purpose: Keep backend maintainable before adding more features.
Instructions: Split routes, controllers, middleware, config.
Best practices: Keep index.ts minimal.
- Split routes/controllers/middleware/config for maintainability.
- See Step 2.6 in the detailed guide.

**2.7: Implement Reusable Validation Across All Components (20 min) - OPTIONAL**
Purpose: Centralize validation rules across components.
Instructions: Create a validator service and reuse it.
Best practices: Validate on both client and server.
- Centralize validation logic in a service for all file uploads and forms.

**2.8: Create HTTP Error Interceptor (20 min) - OPTIONAL**
Purpose: Apply timeout/retry/error handling to all requests.
Instructions: Build and register a global interceptor.
Best practices: Retry only transient errors.

```typescript
// src/app/interceptors/error.interceptor.ts
- Timeout: 30s for all requests
- Retry: 2 attempts on failure (5xx, network errors)
- Error handling: Classify errors (4xx vs 5xx), log appropriately
- Return error through Observable chain
```

Register in app.config.ts:
```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
};
```

**Why an interceptor?**
- ✅ All HTTP calls automatically get timeout + retry
- ✅ No code repetition in services
- ✅ Global error handling
- ✅ Easy to add more interceptors later (logging, auth, loading state)

**See ANGULAR_BEGINNERS_GUIDE.md for complete interceptor code.**

**Checklist after Phase 2:**
- ✅ `provideHttpClient()` registered in `app.config.ts` (REQUIRED before any HTTP calls)
- ✅ Upload form looks professional
- PENDING: Reusable validation service (Step 2.7 optional)
- ✅ Loading spinner during upload
- ✅ Success/error messages display
- ✅ Services ready for backend connection
- PENDING: HTTP error interceptor (Step 2.8 optional)
- ✅ Resume upload integrated with backend (Step 2.3 detailed guide)
- ✅ Resume list component working (Step 2.5 detailed guide)
- NEXT: Download/view actions (Step 2.5.7 detailed guide)
- PENDING: Backend refactor (Step 2.6 detailed guide)

> **See Detailed Step Guides at end of this document and ANGULAR_BEGINNERS_GUIDE.md for implementation details.**

---

### **PHASE 3: EXPRESS API ROUTES (Days 3-4, ~2 hours)**

#### 🎯 Goal
Create REST API endpoints for all backend operations.

#### What You'll Learn
- REST API design (GET, POST, etc.)
- Express routing
- Error handling
- HTTP status codes
- Database queries with Prisma

#### Steps (6 detailed steps)

**3.1: Create Employee Routes (20 min)**
Purpose: Support CRUD operations for employees.
Instructions: Add list/create/get/delete endpoints.
Best practices: Return clear status codes and messages.
```
POST   /api/employees          Create new employee
GET    /api/employees          List all employees
GET    /api/employees/:id      Get one employee
DELETE /api/employees/:id      Delete employee
```

**3.2: Create Resume Upload Route with Server-Side Validation (25 min)**
Purpose: Accept resumes securely and store metadata.
Instructions: Use Multer + validation checks.
Best practices: Validate size, type, and required fields.
```
POST   /api/resume/upload      Upload resume (validate, store, return ID)
GET    /api/resume/:id         Get resume details
```

**Server-side validation (CRITICAL - never trust client):**

```typescript
// Route: POST /api/resume/upload
// Middleware: multer for streaming + size limits
import multer from 'multer';
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB hard limit

app.post('/api/resume/upload', upload.single('file'), async (req, res) => {
  // 1. Re-validate file presence and size
  if (!req.file) return res.status(400).json({ error: 'File required' });
  if (req.file.size > 5 * 1024 * 1024) return res.status(413).json({ error: 'File too large' });

  // 2. Validate MIME type (check actual type, not just extension)
  const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  // 3. Validate file content (ensure readable, not corrupted)
  try {
    // For TXT: check encoding (UTF-8)
    // For PDF: validate PDF structure/headers
    // For DOCX: verify ZIP structure (DOCX is a ZIP file)
    // Details depend on file type
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or corrupted file' });
  }

  // 4. Validate request fields (name, etc.)
  if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim().length === 0) {
    return res.status(400).json({ error: 'Valid employee name required' });
  }

  // 5. Store safely with metadata, return resumeId for async processing
  const resumeRecord = await prisma.resume.create({
    data: {
      employeeName: req.body.name.trim(),
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileBuffer: req.file.buffer, // or S3 key if using cloud storage
      uploadedAt: new Date()
    }
  });

  // Return resumeId; client can poll or use webhook for processing status
  return res.status(201).json({ 
    resumeId: resumeRecord.id, 
    message: 'Resume uploaded successfully' 
  });
});
```

**Key server-side validation patterns:**
- **Size limit:** Use multer to enforce max size (multer rejects before processing)
- **MIME type:** Verify actual file type, not just extension (defense in depth)
- **Content validation:** Library-specific checks (PDF headers, DOCX ZIP format, text encoding)
- **Input sanitization:** Trim strings, validate lengths, reject unexpected fields
- **Error responses:** Use correct HTTP codes (400 bad request, 413 entity too large, 415 unsupported media type)
- **Async processing:** Store and return ID immediately; process text extraction/AI generation in background
- **Storage strategy:** Use multer + database blob for learning; upgrade to S3/cloud storage for production

**Checklist for Phase 3.2:**
- ✅ Size validation on server (multer limits)
- ✅ MIME type verification
- ✅ Content validation (file integrity check)
- ✅ Input sanitization (names, fields)
- ✅ Proper HTTP status codes
- ✅ Clear error messages
- ✅ Safe file storage
- ✅ Return resumeId for async processing

**3.3: Create Bio Generation Route (25 min)**
Purpose: Generate a bio from stored resume data.
Instructions: Add generate + fetch + download endpoints.
Best practices: Validate inputs and handle timeouts.
```
POST   /api/bio/generate       Generate bio from resume
GET    /api/bio/:id            Retrieve bio
GET    /api/bio/download/:id   Download PPTX file
```

**3.4: Error Handling (20 min)**
Purpose: Prevent crashes and provide user-friendly responses.
Instructions: Use try/catch and consistent error payloads.
Best practices: Map errors to correct HTTP status codes.
- Try-catch blocks
- Proper HTTP status codes
- Meaningful error messages
- Validation errors

**3.5: Test with Postman (15 min)**
Purpose: Validate each API endpoint independently.
Instructions: Create requests for all routes and verify responses.
Best practices: Save a Postman collection for reuse.
- Download Postman (API testing tool)
- Create test requests
- Verify all endpoints work

**3.6: Verify Data in the Database (10 min)**
Purpose: Confirm writes/reads match what the API returns.
Instructions: Use your DB monitoring tool to inspect rows after each write.
Best practices: Compare API response data with DB records.
- Verify a new Resume row is inserted after upload
- Verify relations (Resume -> Employee) are correct
- Verify GET endpoints return the same data you see in the DB

**Checklist after Phase 3:**
- ✅ All endpoints created
- ✅ Error handling in place
- ✅ Tested with Postman
- ✅ DB verification completed (rows + relations)
- ✅ Ready for frontend integration

---

### **PHASE 4: AI INTEGRATION - OpenAI (Days 4-5, ~2 hours)**

#### 🎯 Goal
Integrate OpenAI API to generate professional bios from resumes.

#### What You'll Learn
- API authentication and key management
- Calling external APIs from Node.js
- Prompt engineering (craft good AI prompts)
- Error handling for AI responses

#### Steps (6 detailed steps)

**4.1: Setup OpenAI Account & API Key (10 min)**
Purpose: Authenticate requests to the OpenAI API.
Instructions: Create an API key and add it to `.env`.
Best practices: Never commit secrets to git.
1. Sign up at https://platform.openai.com/
2. Create API key in Settings
3. Add to `.env`: `OPENAI_API_KEY=sk_...`

**Important Security:**
- Never commit `.env` to git
- Use `.env.example` for team

**4.2: Install OpenAI Package (5 min)**
Purpose: Add the SDK to call OpenAI from Node.
Instructions: Install the `openai` package.
Best practices: Pin versions in `package.json`.
```bash
npm install openai
```

**4.3: Create OpenAI Service (20 min)**
Purpose: Isolate OpenAI calls in a reusable service.
Instructions: Build `generateBio()` and handle errors.
Best practices: Keep prompts and API logic centralized.
```typescript
// src/services/openai.service.ts
- Initialize OpenAI client
- Create generateBio(resumeText) function
- Handle API errors
```

**4.4: Write Good Prompts (20 min)**
Purpose: Improve the quality and consistency of bios.
Instructions: Define a clear system prompt with constraints.
Best practices: Be specific about tone, length, and redactions.
```
"Generate a professional biography from this resume that:
- Removes company names and dates
- Emphasizes achievements
- Uses third person
- 150-200 words
- Highlights technical skills"
```

**Good prompts = Good results**
- Be specific
- Give examples
- Set constraints (length, tone, etc.)

**4.5: Integrate into Bio Route with Resilience (20 min)**
Purpose: Call OpenAI safely in your API route.
Instructions: Add retries, timeouts, and error mapping.
Best practices: Retry only transient errors.

Create OpenAI service with timeout + retry + exponential backoff:

```typescript
// src/services/openai.service.ts
import axios from 'axios';

export class OpenAIService {
  private readonly timeout = 10000; // 10s for external API
  private readonly maxRetries = 3;

  async generateBio(resumeText: string): Promise<string> {
    return await this.callWithRetry(async () => {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'Generate a professional bio from a resume. Remove company names and dates. Use 150-200 words. Third person.'
          }, {
            role: 'user',
            content: resumeText
          }],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
          timeout: this.timeout
        }
      );

      return response.data.choices[0].message.content;
    });
  }

  private async callWithRetry(fn: () => Promise<string>): Promise<string> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;

        // Transient errors worth retrying
        const isTransient = 
          err.response?.status >= 500 || // 5xx server error
          err.code === 'ECONNABORTED' ||  // Timeout
          err.code === 'ENOTFOUND' ||     // DNS failure
          err.code === 'ECONNREFUSED';    // Connection refused

        if (!isTransient || attempt === this.maxRetries) {
          throw err; // Not retriable or last attempt
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(
          `OpenAI Error (${err.code || err.response?.status}). ` +
          `Retry ${attempt}/${this.maxRetries} in ${delay}ms`
        );

        await new Promise(r => setTimeout(r, delay));
      }
    }

    throw lastError;
  }
}
```

**Update bio generation route:**

```typescript
// src/routes/bio.ts
import { OpenAIService } from '../services/openai.service';
import { withRetry } from '../lib/db-retry';

const openaiService = new OpenAIService();

app.post('/api/bio/generate', async (req, res) => {
  try {
    const resume = await withRetry(() =>
      prisma.resume.findUnique({ where: { id: req.body.resumeId } })
    );

    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // OpenAI call with resilience (timeout 10s, retry 3x)
    const bio = await openaiService.generateBio(resume.fileBuffer.toString());

    // Save to DB with resilience (timeout 5s, retry 2x)
    const generatedBio = await withRetry(() =>
      prisma.generatedBio.create({
        data: {
          resumeId: req.body.resumeId,
          bioContent: bio
        }
      })
    );

    res.json({ bioId: generatedBio.id, bio });
  } catch (err: any) {
    console.error('Bio generation error:', err);

    if (err.response?.status === 429) {
      // Rate limited
      return res.status(429).json({ error: 'Rate limited. Try again in 1 minute.' });
    }

    if (err.code === 'ECONNABORTED') {
      // Timeout after retries
      return res.status(504).json({ error: 'AI service timeout. Try again.' });
    }

    res.status(503).json({ error: 'Failed to generate bio. Try again later.' });
  }
});
```

**OpenAI Resilience Strategy:**
- ✅ Timeout: 10 seconds (external API, not instant)
- ✅ Retry: 3 attempts on 5xx/network errors (NOT on 4xx)
- ✅ Exponential backoff: 1s, 2s, 4s delays
- ✅ Rate limit handling (429 status -> inform user)
- ✅ Timeout handling (504 status after retries)
- ✅ Don't retry on auth errors (401) or invalid requests (400)

**4.6: Handle API Errors & Rate Limits**
Purpose: Prevent outages from cascading failures.
Instructions: Detect 429/timeouts and return clear errors.
Best practices: Back off when rate limited.
- Rate limit handling: Check X-RateLimit-Remaining header
- Cost tracking: Log tokens used per request
- Fallback: Cache successful bios (Phase 9+)
- Circuit breaker: Stop calling if >5 failures in 1 minute

**Checklist after Phase 4:**
- ✅ OpenAI API integrated with timeout (10s)
- ✅ Retry logic (3x with exponential backoff)
- ✅ Bio generation working
- ✅ Error handling: 5xx, timeout, rate limits
- ✅ Tested with real resumes
- ✅ **Rate limit aware**

---

### **PHASE 5: PPTX GENERATION (Days 5-6, ~2 hours)**

#### 🎯 Goal
Generate professional PowerPoint presentations from generated bios.

#### What You'll Learn
- Creating binary file data (PPTX)
- File streaming in Node.js
- Template formatting
- Storing binary data in database

#### Steps (4 detailed steps)

**5.1: Install PPTX Generation Library (5 min)**
Purpose: Enable PPTX file creation in Node.
Instructions: Install the PPTX library.
Best practices: Keep the library version pinned.
```bash
npm install pptxgen
```

**5.2: Create PPTX Generation Function (30 min)**
Purpose: Build a reusable PPTX builder.
Instructions: Define slides and layout for the bio.
Best practices: Keep styling consistent across slides.
```typescript
// src/services/pptx.service.ts
- Slide 1: Title slide (employee name)
- Slide 2: Professional bio
- Slide 3: Key skills
- Slide 4: Contact/footer
```

Professional touches:
- Company branding (colors, fonts)
- Proper spacing and alignment
- Image support (if available)

**5.3: Update Bio Route to Generate PPTX (20 min)**
Purpose: Generate PPTX after bio creation.
Instructions: Call the PPTX service and store the file.
Best practices: Separate file generation from route logic.
In bio generation endpoint:
1. Generate bio (from Phase 4)
2. Create PPTX from bio
3. Store PPTX binary in database
4. Return download link

**5.4: Create Download Endpoint (15 min)**
Purpose: Let users download the PPTX.
Instructions: Return the file with correct headers.
Best practices: Stream files to avoid memory spikes.
```
GET /api/bio/download/:id
```
- Retrieve PPTX from database
- Send as file attachment
- Proper HTTP headers for download

**Checklist after Phase 5:**
- ✅ PPTX files generated
- ✅ Professional formatting
- ✅ Download working
- ✅ Files stored in database

---

### **PHASE 6: FRONTEND-BACKEND INTEGRATION (Days 6-7, ~1.5 hours)**

#### 🎯 Goal
Connect Angular frontend to Express backend with resilient error handling, retries, and loading states.

#### What You'll Learn
- HTTP requests in Angular (HttpClient)
- RxJS Observables & Promises
- HTTP Interceptors for global resilience
- Loading state management
- Error handling in UI
- Async/await patterns

#### Steps (5 detailed steps)

**6.1: Verify Error Interceptor is Registered (5 min)**
Purpose: Ensure global HTTP resilience is active.
Instructions: Check `app.config.ts` providers.
Best practices: Keep interceptor order consistent.

Ensure the ErrorInterceptor from Phase 2 is active. All HTTP calls will automatically get:
- Timeout: 30 seconds
- Retry: 2 attempts on failure
- Error classification and logging

**See Phase 2.6 and ANGULAR_BEGINNERS_GUIDE.md for interceptor setup.**

**6.2: Create API Service Layer (20 min)**
Purpose: Centralize API calls and reuse routes.
Instructions: Build `ApiService` with upload/generate/download methods.
Best practices: Keep services thin and focused.
```typescript
// src/app/services/api.service.ts
// Keep methods SIMPLE - interceptor handles timeout/retry
// ? Use environment config for URL (no hardcoding!)
// ? Use API_ROUTES constants for paths (no string duplication!)
import { environment } from '../../environments/environment';
import { API_ROUTES } from '../constants/api-routes.constants';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // ? Automatically uses correct URL: localhost:3000 (dev), staging-api.biogenai.com (staging), api.biogenai.com (prod)
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  uploadResume(name: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    // ? Uses API_ROUTES constant
    return this.http.post(`${this.apiUrl}${API_ROUTES.RESUME.UPLOAD}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
    // Interceptor adds: timeout(30s) + retry(2x) automatically!
  }

  generateBio(resumeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.BIO.GENERATE}`, { resumeId });
    // Interceptor wraps this too
  }

  downloadBio(bioId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.BIO.DOWNLOAD(bioId)}`, {
      responseType: 'blob'
    });
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${API_ROUTES.EMPLOYEE.LIST}`);
  }
}
```

**Pattern:** Services stay simple. Interceptor handles cross-cutting concerns.

**6.3: Update Components to Use Service (20 min)**
Purpose: Connect UI actions to API calls.
Instructions: Inject the service and call methods in handlers.
Best practices: Manage loading/error states per action.
```typescript
// resume-upload.component.ts
export class ResumeUploadComponent {
  constructor(
    private apiService: ApiService,
    private fileValidator: FileValidatorService
  ) {}

  async onFileSelected(event: Event) {
    const validation = await this.fileValidator.validateFile(file);
    if (validation.isValid) this.selectedFile = file;
  }

  onUpload() {
    // Interceptor handles timeout/retry automatically
    this.apiService.uploadResume(this.employeeName, this.selectedFile)
      .subscribe({
        next: (event: any) => {
          if (event.type === 4) { // Response
            this.successMessage = 'Uploaded!';
          }
        },
        error: (error) => {
          // Error already retried 2x by interceptor
          this.errorMessage = 'Failed after retries';
        }
      });
  }
}
```

**6.4: Build Bio Display Component (15 min)**
Purpose: Show the generated bio and download link.
Instructions: Render bio content and add a download button.
Best practices: Show empty/loading states.
- Show employee name, generated bio, and a download button for PPTX.
- Wire it to the bio generation and download endpoints.

**6.5: Add Loading & Error States (15 min)**
Purpose: Make the UI responsive to API activity.
Instructions: Toggle flags before/after requests.
Best practices: Reset state on retries.
- Show spinner while waiting for server
- Display error messages if request fails
- Disable buttons while loading
- Clear messages on new request

**6.6: Test Full Workflow (20 min)**
Purpose: Validate end-to-end functionality.
Instructions: Upload, generate, display, download.
Best practices: Test with multiple files and sizes.
1. Upload resume (interceptor retries if network fails)
2. System generates bio (timeout: 60s)
3. Display bio
4. Download PPTX

End-to-end flow with resilience!

**Checklist after Phase 6:**
- ✅ Frontend talks to backend
- ✅ Upload works end-to-end
- ✅ Bio generation works
- ✅ Download works
- ✅ **Error messages shown (from interceptor error handling)**
- ✅ **Requests auto-retry on network failures**
- ✅ **30s timeout prevents hanging requests**
- ✅ Loading states working

---

### **PHASE 7: TESTING (Days 7-8, ~2 hours)**

#### 🎯 Goal
Add unit tests and end-to-end tests for quality assurance.

#### What You'll Learn
- Angular component testing (Jasmine)
- Express API testing (Jest, Supertest)
- Mocking dependencies
- End-to-end testing concepts

#### Steps (4 detailed steps)

**7.1: Write Component Unit Tests (25 min)**
Purpose: Validate UI logic in isolation.
Instructions: Add Jasmine tests for upload component.
Best practices: Test both success and error paths.
```typescript
// resume-upload.component.spec.ts
- Test form validation
- Test file selection
- Test error messages
- Test loading state
```

```bash
ng test  # Runs tests in watch mode
```

**7.2: Write Service Tests (20 min)**
Purpose: Verify API service behavior.
Instructions: Mock HTTP and assert request payloads.
Best practices: Avoid hitting real endpoints in unit tests.
- Mock HTTP requests
- Test error handling
- Test response transformation

**7.3: Write API Tests (25 min)**
Purpose: Confirm backend routes behave correctly.
Instructions: Use Jest + Supertest for route testing.
Best practices: Cover both valid and invalid inputs.
```typescript
// routes/__tests__/resume.test.ts
- Test POST /api/resume/upload
- Test error cases
- Test validation
```

```bash
npm test  # Runs backend tests
```

**7.4: End-to-End Test with Playwright (20 min)**
Purpose: Validate the full user workflow.
Instructions: Script upload -> generate -> download.
Best practices: Use stable selectors and test data.
```typescript
// tests/e2e/upload-bio.spec.ts
- User uploads resume
- System generates bio
- User downloads PPTX
```

**Why Testing?**
- ✅ Catch bugs before production
- ✅ Refactor confidently
- ✅ Professional standard
- ✅ Documentation of behavior

**Checklist after Phase 7:**
- ✅ Unit tests passing
- ✅ API tests passing
- ✅ E2E test passing
- ✅ Good code coverage

---

### **PHASE 8: DEPLOYMENT (Days 8-9, ~1.5 hours)**

#### 🎯 Goal
Containerize the application and deploy to production.

#### What You'll Learn
- Docker containerization
- Docker Compose for multi-service setup
- Environment configuration
- Basic deployment process

#### Steps (4 detailed steps)

**8.1: Create Dockerfile for Backend (15 min)**
Purpose: Containerize the backend API.
Instructions: Build a Node image that runs the server.
Best practices: Use multi-stage builds when possible.
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**8.2: Create Dockerfile for Frontend (15 min)**
Purpose: Build and serve the Angular app as static files.
Instructions: Use a build stage and Nginx runtime stage.
Best practices: Keep runtime images small.
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**8.3: Create docker-compose.yml (20 min)**
Purpose: Run frontend, backend, and database together.
Instructions: Define services and ports.
Best practices: Use volumes for persistent DB data.
```yaml
version: '3.8'
services:
  frontend:
    build: ./biogenai-frontend
    ports:
      - "4200:80"
  
  backend:
    build: ./biogenai-backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://...
      OPENAI_API_KEY: ...
    depends_on:
      - postgres
  
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: biogenai
      POSTGRES_PASSWORD: ...
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

**8.4: Deploy to Cloud (15 min)**
Purpose: Make the app accessible to real users.
Instructions: Push to GitHub and connect a hosting provider.
Best practices: Store secrets in environment variables.

Options:
- **Railway.app** - Simple, GitHub integration
- **Render** - Free tier available
- **AWS/GCP** - More complex but scalable

Basic steps:
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy!

**Checklist after Phase 8:**
- ✅ Docker images created
- ✅ docker-compose working locally
- ✅ Deployed to cloud
- ✅ Live URL working

---

### **PHASE 9: OPTIMIZATION & POLISH (Days 9-10, ~1.5 hours)**

#### Steps

**9.1: Optimize Database Queries**
Purpose: Keep database reads fast as data grows.
Instructions: Add indexes and review slow queries.
Best practices: Index only columns used in filters/sorts.
- Add indexes on frequently queried columns
- Analyze slow queries

**9.2: Improve Frontend Performance**
Purpose: Reduce load time and improve UX.
Instructions: Lazy load and optimize assets.
Best practices: Measure before and after.
- Lazy load components
- Optimize images
- Minify bundles

**9.3: Add Progress Indicators**
Purpose: Make long operations feel responsive.
Instructions: Add upload and processing progress UI.
Best practices: Use incremental feedback, not just spinners.
- Progress bar for file upload
- Processing status updates

**9.4: Enhance Error Messages**
Purpose: Help users recover quickly.
Instructions: Show clear, actionable errors.
Best practices: Avoid technical jargon in UI messages.
- User-friendly error descriptions
- Retry buttons
- Clear next steps

**9.5: Add Logging & Monitoring**
Purpose: Detect issues before users report them.
Instructions: Add error tracking and performance monitoring.
Best practices: Set alerts for high-severity issues.
- Error tracking (Sentry)
- Performance monitoring
- User analytics

---

### **PHASE 10: ADVANCED FEATURES (Optional, ~3 hours)**

**10.1: PDF Upload Support**
Purpose: Accept more resume formats.
Instructions: Parse PDFs and extract text.
Best practices: Validate PDFs before parsing.
- Parse PDF files
- Extract text automatically

**10.2: Multiple Bio Templates**
Purpose: Provide style options for different audiences.
Instructions: Offer template selection in UI.
Best practices: Keep templates consistent in structure.
- Different formatting styles
- User chooses format

**10.3: Batch Processing**
Purpose: Support bulk workflows.
Instructions: Allow multiple uploads and queue processing.
Best practices: Show progress per file.
- Upload multiple resumes
- Generate bios in bulk

**10.4: Admin Dashboard**
Purpose: Provide visibility and control to admins.
Instructions: Add views for bios, stats, and management.
Best practices: Protect admin routes.
- View all generated bios
- Analytics and statistics
- Manage employees

**10.5: Email Delivery**
Purpose: Send results without manual download.
Instructions: Generate and email the PPTX.
Best practices: Use async jobs for email sending.
- Send bio via email
- Schedule generation


---

## Best Practices & Reference Sections

> The following sections cover best practices, environment configuration, and tools that apply across multiple phases.

## 🔧 Environment Configuration: DEV, STAGING, PRODUCTION

**Best Practice:** Never hardcode URLs, API keys, or database connections. Use environment files instead.

### Frontend: Angular Environment Files

Angular automatically swaps environment files during build/serve.

**Create 3 environment files:**

**1. `src/environments/environment.development.ts` (Local Development)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  maxRetries: 2,
  retryDelay: 1000
};
```

**2. `src/environments/environment.staging.ts` (QA Testing)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.biogenai.com/api',
  apiTimeout: 30000,
  maxRetries: 2,
  retryDelay: 1000
};
```

**3. `src/environments/environment.ts` (Production)**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.biogenai.com/api',
  apiTimeout: 30000,
  maxRetries: 2,
  retryDelay: 1000
};
```

**Use in ApiService:**
```typescript
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;  // ? Automatically correct for environment
  
  uploadResume(name: string, file: File): Observable<any> {
    return this.http.post(`${this.apiUrl}/resume/upload`, formData);
  }
}
```

**Run different environments:**
```bash
ng serve                          # Dev: uses environment.development.ts
ng serve --configuration=staging  # Staging: uses environment.staging.ts
ng build                          # Prod: uses environment.ts
```

---

## Feature Management & Runtime Flags

**Goal:** Allow runtime toggling of non-sensitive features (logging, OTEL, UI flags) without rebuilding, and provide guidance for server-side enforcement for sensitive gates.

### Recommended approach (Phase 1)
- Use a small runtime config file `assets/config/features.json` that the frontend loads at startup via `APP_INITIALIZER` (`ConfigService`).
- Keep sensible defaults in `environment.*.ts` for build-time toggles only when necessary.
- For advanced needs (percentage rollouts), integrate a remote feature flag provider (LaunchDarkly/Unleash) later.

### Example `assets/config/features.json`

```json
{
  "logging": true,
  "otel": false,
  "newUi": false
}
```

### `ConfigService` (high-level)

```typescript
// src/app/services/config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private features$ = new BehaviorSubject<Record<string, any>>({});
  features$Observable = this.features$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    const local = localStorage.getItem('features');
    if (local) {
      try { this.features$.next(JSON.parse(local)); return Promise.resolve(); } catch {}
    }
    return this.http.get<Record<string, any>>('/assets/config/features.json')
      .toPromise()
      .then(cfg => this.features$.next(cfg || {}))
      .catch(() => this.features$.next({}));
  }

  isEnabled(key: string): boolean { return !!this.features$.value[key]; }
  override(key: string, value: boolean) { const v = { ...this.features$.value, [key]: value }; this.features$.next(v); localStorage.setItem('features', JSON.stringify(v)); }
}
```

### Wire `APP_INITIALIZER`

Add to `AppModule` or `app.config.ts` so flags load before app bootstrap.

### Backend: enforce sensitive gates
- For any flag that affects data access, billing, or permissions, check the flag on the server (e.g., feature toggles in database or remote provider) and never rely only on the client for enforcement.

### Operational notes
- Document flags, owners, and default values.
- Keep new features disabled by default until verified.
- Provide dev-only UI for quick toggles (persist to `localStorage` only).

---

### Backend: Node.js Environment Variables

Use `.env` file for Node.js configuration:

**Create `.env` in backend root:**
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/biogenai_dev

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# OpenAI
OPENAI_API_KEY=sk-... # Get from https://platform.openai.com/api-keys

# CORS (comma-separated for multiple)
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

**Use in Express:**
```typescript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'];
const openaiKey = process.env.OPENAI_API_KEY;

app.use(cors({ origin: allowedOrigins }));

// In backend routes:
const response = await axios.post('https://api.openai.com/v1/chat/completions', 
  { /* ... */ },
  { headers: { Authorization: `Bearer ${openaiKey}` } }
);
```

**Different `.env` files for different environments:**

**`.env.development` (Local)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/biogenai_dev
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

**`.env.staging` (QA)**
```
DATABASE_URL=postgresql://user:password@staging-db.biogenai.com/biogenai_staging
PORT=3000
NODE_ENV=staging
FRONTEND_URL=https://staging.biogenai.com
ALLOWED_ORIGINS=https://staging.biogenai.com
```

**`.env.production` (Real Users)**
```
DATABASE_URL=postgresql://user:password@prod-db.biogenai.com/biogenai_prod
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://biogenai.com
ALLOWED_ORIGINS=https://biogenai.com
```

**Load correct `.env` file:**
```bash
# Local development
npm start  # Uses .env.development (or NODE_ENV=development npm start)

# Staging
NODE_ENV=staging npm start

# Production
NODE_ENV=production npm start
```

**Or in `package.json`:**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon src/index.ts",
    "staging": "NODE_ENV=staging node dist/index.js",
    "prod": "NODE_ENV=production node dist/index.js"
  }
}
```

### .gitignore: Never Commit Secrets

Add to `.gitignore` so you don't accidentally commit API keys:

```bash
# Environment variables (secrets!)
.env
.env.*.local
.env.production.local

# Dependencies
node_modules/

# Build outputs
dist/
build/

# Logs
*.log

# IDE
.vscode/
.idea/
*.swp
```

**Summary: Environment Configuration Best Practices**

| Aspect | Dev | Staging | Production |
|--------|-----|---------|------------|
| **Frontend URL** | http://localhost:4200 | https://staging.biogenai.com | https://biogenai.com |
| **Backend URL** | http://localhost:3000 | https://staging-api.biogenai.com | https://api.biogenai.com |
| **Database** | Local PostgreSQL | Staging RDS | Production RDS |
| **OpenAI Key** | Test key | Test key | Production key |
| **Logging** | Verbose | Normal | Errors only |
| **Error Details** | Full (for debugging) | Limited | Hidden from users |

---

## 🛣️ API Routes Constants: Best Practice Organization

**Problem:** Hardcoding route paths = easy to typo, hard to refactor globally

**Solution:** Create constants file for all API routes

### Create API Routes Constants

**Location:** `src/app/constants/api-routes.constants.ts`

```typescript
export const API_ROUTES = {
  EMPLOYEE: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`
  },
  RESUME: {
    UPLOAD: '/resume/upload',
    GET: (id: string) => `/resume/${id}`
  },
  BIO: {
    GENERATE: '/bio/generate',
    GET: (id: string) => `/bio/${id}`,
    DOWNLOAD: (id: string) => `/bio/download/${id}`
  },
  HEALTH: '/health'
};
```

### Use in ApiService

**Frontend:** `src/app/services/api.service.ts`

```typescript
import { environment } from '../../environments/environment';
import { API_ROUTES } from '../constants/api-routes.constants';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  uploadResume(name: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    // ? Uses API_ROUTES constant (prevents typos, single source of truth)
    return this.http.post(`${this.apiUrl}${API_ROUTES.RESUME.UPLOAD}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  generateBio(resumeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${API_ROUTES.BIO.GENERATE}`, { resumeId });
  }

  downloadBio(bioId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${API_ROUTES.BIO.DOWNLOAD(bioId)}`, {
      responseType: 'blob'
    });
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${API_ROUTES.EMPLOYEE.LIST}`);
  }
}
```

**Advantages:**
- ✅ **Single source of truth** - change route in one place, propagates everywhere
- ✅ **Prevents typos** - `API_ROUTES.RESUME.UPLOAD` vs `/resume/upload` (easy to misspell)
- ✅ **Type-safe** - IDE autocomplete suggests routes
- ✅ **Consistent** - across all API calls
- ✅ **Easy refactoring** - rename route globally in seconds
- ✅ **Can share with backend team** - document API contract in one place

---

---

## Logging & Observability: Node (Express) + OTEL

**Goal:** Add backend tracing and structured logging so backend spans are correlated with frontend traces.

### Environment variables (backend)
- `OTEL_SERVICE_NAME` (e.g., `biogenai-backend`)
- `OTEL_EXPORTER_OTLP_ENDPOINT` (e.g., `http://localhost:4318/v1/traces`)
- `LOG_LEVEL` (e.g., `info`)

### Install (backend)
```bash
npm install @opentelemetry/sdk-node @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express \
  @opentelemetry/instrumentation-pg pino pino-http
```

### Initialize OTEL before your app code
Create `src/telemetry.ts` and import it at the very top of your start script (`src/index.ts`) BEFORE other imports:

```typescript
// src/telemetry.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
});

const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'biogenai-backend'
  })
});

sdk.start()
  .then(() => console.log('OpenTelemetry initialized'))
  .catch(err => console.error('Error initializing OTEL', err));
```

In `src/index.ts` (or your entry) import it first:

```typescript
import './telemetry'; // must be first
import express from 'express';
// ... rest of your app
```

### Structured logging & trace correlation
- Use `pino` for structured JSON logging and `pino-http` for request logging.
- Add the current trace id to log entries to make it easy to correlate.

Example snippet showing how to include traceId in logs:

```typescript
import pino from 'pino';
import pinoHttp from 'pino-http';
import { trace, context } from '@opentelemetry/api';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

app.use(pinoHttp({ logger }));

function logWithTrace(level: 'info'|'error', msg: string, obj = {}) {
  const span = trace.getSpan(context.active());
  const traceId = span?.spanContext()?.traceId;
  logger[level]({ traceId, ...obj }, msg);
}

// Usage
logWithTrace('info', 'Resume processing started', { resumeId: 'abc' });
```

### Local OTEL Collector (backend)
You can reuse the `docker-compose.yml` described in the Angular guide. Point `OTEL_EXPORTER_OTLP_ENDPOINT` to `http://localhost:4318/v1/traces` for local dev.

### What to instrument
- Express (auto-instrumentation)
- HTTP calls to OpenAI (so AI generation spans show up)
- Database calls (Postgres via `pg` or Prisma)
- Background jobs

### Visualization & debugging
- Run Jaeger locally (docker-compose) and open `http://localhost:16686` to see traces.
- Use logs (pino) and filter by `traceId` for full request trace + logs view.

### LoggerService with configurable log levels (Backend)

**Why:** Control verbosity (debug/info/warn/error) per environment without rebuilding.

**Approach:**
- Store `logLevel` in `process.env.LOG_LEVEL` or runtime configuration.
- Create a `Logger` utility that reads the level and filters output.
- Include traceId in logs so you correlate with OTEL traces.

**Example implementation** (you'll create this in Phase 1):

```typescript
// src/utils/logger.ts
import pino, { Logger as PinoLogger } from 'pino';
import { trace, context } from '@opentelemetry/api';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export class Logger {
  private pino: PinoLogger;
  private level: LogLevel;

  constructor() {
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.pino = pino({ level: this.level });
  }

  private should(logLevel: LogLevel): boolean {
    return ORDER[logLevel] >= ORDER[this.level];
  }

  private traceId(): string | undefined {
    const span = trace.getSpan(context.active());
    return span?.spanContext?.()?.traceId;
  }

  private emit(level: LogLevel, msg: string, ctx?: any): void {
    if (!this.should(level)) return;
    const payload = { msg, traceId: this.traceId(), ...ctx };
    this.pino[level](payload);
  }

  debug(msg: string, ctx?: any) { this.emit('debug', msg, ctx); }
  info(msg: string, ctx?: any) { this.emit('info', msg, ctx); }
  warn(msg: string, ctx?: any) { this.emit('warn', msg, ctx); }
  error(msg: string, ctx?: any) { this.emit('error', msg, ctx); }
}

export const logger = new Logger();
```

**Usage in routes/services:**
```typescript
import { logger } from '../utils/logger';

app.post('/api/resume/upload', async (req, res) => {
  logger.info('Resume upload started', { employeeId: req.body.employeeId });
  // ... handler logic
  logger.debug('Validation complete', { size: file.size });
});
```

**Configuration:**
- Set `LOG_LEVEL=debug|info|warn|error` in `.env` for development.
- Set `LOG_LEVEL=warn|error` in production to reduce noise.

---

## 📊 Timeline & Estimation

| Phase | Days | Hours | Topic |
|-------|------|-------|-------|
| 1 | 1-2 | 2 | Setup (Angular, Express, PostgreSQL) |
| 2 | 2-3 | 2 | Angular Components |
| 3 | 3-4 | 2 | Express Routes |
| 4 | 4-5 | 2 | OpenAI Integration |
| 5 | 5-6 | 2 | PPTX Generation |
| 6 | 6-7 | 1.5 | Frontend-Backend Integration |
| 7 | 7-8 | 2 | Testing |
| 8 | 8-9 | 1.5 | Deployment |
| 9 | 9-10 | 1.5 | Polish & Optimization |
| 10 | Optional | 3 | Advanced Features |
| **TOTAL** | **10 days** | **~17.5h** | **Full Stack App** |

### **Timeline Scenarios**

- **Full-time (5-7 days):** 4-6 hours/day
- **Part-time (2-3 weeks):** 2-3 hours/day
- **Casual (4-6 weeks):** 1-2 hours/day
- **With deep learning (8-10 weeks):** Focus on understanding, lots of practice

---

## 🎓 Learning Outcomes

### **After Completing This Project, You'll Know:**

#### Frontend Skills
- ✅ Angular fundamentals (components, services, routing)
- ✅ TypeScript (types, interfaces, classes)
- ✅ Angular HttpClient for API calls
- ✅ RxJS basics (Observables, subscriptions)
- ✅ Form handling & validation
- ✅ Template syntax & data binding

#### Backend Skills
- ✅ Express.js routing & middleware
- ✅ REST API design principles
- ✅ Database queries with Prisma ORM
- ✅ Error handling & validation
- ✅ TypeScript in Node.js
- ✅ Authentication concepts

#### Database Skills
- ✅ PostgreSQL basics
- ✅ Schema design & relationships
- ✅ Migrations & versioning
- ✅ Data integrity

#### AI & Advanced
- ✅ OpenAI API integration
- ✅ Prompt engineering
- ✅ Handling AI API errors
- ✅ Binary file generation (PPTX)

#### Testing & DevOps
- ? Unit testing with Jasmine/Jest
- ? Mocking and test doubles
- ? Docker basics
- ? Environment configuration
- ? Cloud deployment

#### Professional Practices
- ? Git & version control
- ? Code organization
- ? Error handling patterns
- ? Security (API keys, CORS)
- ? Performance optimization

---

## 🚀 Getting Started Checklist

Before you begin, make sure you have:

- [ ] **Node.js 20+** installed: https://nodejs.org
- [ ] **Git** installed: https://git-scm.com
- [ ] **Docker** installed: https://www.docker.com/products/docker-desktop
- [ ] **Code editor:** VS Code recommended: https://code.visualstudio.com
- [ ] **Terminal/Command line** comfort (basic commands)
- [ ] **OpenAI account** (for Phase 4): https://platform.openai.com
- [ ] **Text editor** (for .env files)

### **Recommended VS Code Extensions**
- Angular Language Service
- Prettier - Code formatter
- Thunder Client (API testing, like Postman)
- Docker
- Prisma

---

## 💡 Tips for Success

1. **Don't Rush Setup:** Phase 1 is foundational. Get comfortable with environment first.

2. **Test Frequently:** Use Postman to verify backend endpoints before building frontend.

3. **Read Error Messages:** They tell you exactly what's wrong. Don't ignore them!

4. **Google is Your Friend:** Exact error messages ? search ? find solutions.

5. **Type Everything:** TypeScript catches bugs early. Don't use `any`.

6. **Keep it Simple:** Start basic, then add features. "Make it work, make it right, make it fast."

7. **Take Breaks:** 1-2 hours coding, 15 min break keeps you sharp.

8. **Build Confidence:** Each phase is a victory. Celebrate them!

9. **Ask for Help:** Stack Overflow, Reddit, Discord communities all exist.

10. **Document Your Learning:** Notes help future you remember why you did something.

---

## 🆘 Common Beginner Issues

| Problem | Solution |
|---------|----------|
| "Port 3000 already in use" | Change port in `.env` or kill other process |
| "Cannot connect to database" | Run `docker-compose up -d` and wait 10 seconds |
| "TypeScript errors everywhere" | Install types: `npm install -D @types/node @types/express` |
| "CORS error in browser" | Add `app.use(cors())` to Express server |
| "Angular component not showing" | Check selector name in component decorator |
| ".env file not working" | Restart server after changing it |
| "Docker container won't start" | Check logs: `docker logs container_name` |

---


---

## 🛡️ Database Resilience Patterns (Best Practice)

**Goal:** Make your backend robust by handling transient database errors (timeouts, connection drops) with retry logic.

**Pattern:**
- Use a utility function to wrap database calls and retry on retriable errors (e.g., Prisma P1008/P1009).
- Use exponential backoff to avoid hammering the DB.
- Only retry on transient errors, not logic/data errors.

**Example (TypeScript):**
```typescript
// src/lib/db-retry.ts
export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  delayMs: 100
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = DEFAULT_OPTIONS
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;

      // Prisma error codes for retriable errors
      const RETRIABLE_CODES = ['P1008', 'P1009']; // Connection timeout, query timeout

      const isRetriable =
        RETRIABLE_CODES.includes(err.code) ||
        err.message?.includes('timed out') ||
        err.message?.includes('connection');

      if (!isRetriable || attempt === options.maxAttempts) {
        throw err;
      }

      // Exponential backoff: 100ms, 200ms, 400ms
      const delay = options.delayMs * Math.pow(2, attempt - 1);
      console.log(`DB Error: ${err.code}. Retry ${attempt}/${options.maxAttempts} in ${delay}ms`);

      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw lastError;
}
```

**Usage:**
```typescript
import { withRetry } from './lib/db-retry';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await withRetry(() => prisma.employee.findMany());
    res.json(employees);
  } catch (err) {
    res.status(503).json({ error: 'Database error. Try again later.' });
  }
});
```

**Checklist:**
- [ ] Timeout: 5 seconds (Prisma default is 10s)
- [ ] Retry: 2-3 attempts on transient errors (P1008, P1009)
- [ ] NOT retriable: Logic errors (unique constraint, invalid data)
- [ ] Exponential backoff (100ms, 200ms, 400ms)
- [ ] Log retry attempts for debugging
- [ ] Return 503 (Service Unavailable) to frontend on failure

---
## 📚 Helpful Resources

### **Angular Learning**
- [Angular Official Tutorial](https://angular.io/tutorial)
- [Angular University YouTube](https://www.youtube.com/c/AngularUniversity)
- [RxJS Basics](https://rxjs.dev/guide/overview)

### **Express/Node.js**
- [Express Official Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### **Database**
- [PostgreSQL Basics](https://www.postgresql.org/docs/)
- [Database Design Fundamentals](https://www.postgresql.org/docs/current/)

### **General Web Dev**
- [MDN Web Docs](https://developer.mozilla.org/)
- [REST API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://http.cat/)

### **Tools**
- [Postman API Testing](https://www.postman.com/)
- [Prisma Studio](https://www.prisma.io/studio)
- [Docker Getting Started](https://docs.docker.com/get-started/)

---

## 🧠 Important Concepts to Understand (Even if Not Used in BiogenAI)

### **Angular Advanced Concepts**

**1. Route Guards** (Control who can access which pages)
```typescript
// Prevents unauthorized users from accessing admin page
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return !!localStorage.getItem('token');
  }
}
// In routing:
{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
```
- **When to use:** Authentication, authorization, role-based access
- **Important for:** Enterprise apps (like real BiogenAI)

**2. HTTP Interceptors** (Modify all API requests/responses, add resilience globally)

**Simple Resilience Interceptor (Phase 1/2):**
```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req, next) {
    return next.handle(req).pipe(
      timeout(30000),              // Kill request after 30s
      retry({ count: 2, delay: 1000 }), // Retry 2x with 1s delay
      catchError(err => {
        // Classify errors, log, rethrow
        if (err instanceof HttpErrorResponse) {
          if (err.status >= 500) console.error('Server error');
          else if (err.status === 0) console.error('Network error');
        }
        return throwError(() => err);
      })
    );
  }
}
```

**Advanced: Multiple Interceptors Stack (Production):**
```typescript
// 1. Auth: Add token to every request
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req, next) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    return next.handle(req);
  }
}

// 2. Logging: Log all requests/responses
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req, next) {
    console.log(`API: ${req.method} ${req.url}`);
    return next.handle(req).pipe(
      tap(() => console.log('? Success')),
      catchError(err => { console.error('? Failed'); return throwError(() => err); })
    );
  }
}

// 3. Error & Retry: Timeout + resilience
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req, next) {
    return next.handle(req).pipe(
      timeout(30000),
      retry({ count: 2, delay: 1000 }),
      catchError(err => { /* handle */ return throwError(() => err); })
    );
  }
}

// Register all in order (auth ? logging ? error)
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
]
```

**Why interceptors?**
- ? **DRY:** Write resilience once, apply to ALL requests
- ? **Consistent:** Same timeout/retry rules everywhere
- ? **Maintainable:** Change behavior in one place
- ? **Composable:** Stack auth + logging + error handling
- ? **Production-ready:** Standard Angular pattern

**For BiogenAI Phase 1:** Implement ErrorInterceptor with timeout (30s) + retry (2x). See ANGULAR_BEGINNERS_GUIDE.md for complete code.

**3. Change Detection Strategy (OnPush)** (Performance optimization)
```typescript
@Component({
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {}
```
- **When to use:** Large apps with many components (performance)
- **Default:** Angular checks ALL components for changes (slow on big apps)
- **OnPush:** Only checks when @Input changes (much faster)

**4. Lazy Loading Modules** (Load code only when needed)
```typescript
// Instead of loading all routes at startup:
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
```
- **When to use:** Large apps (reduces initial load time)
- **Important for:** Performance on slow networks

**5. Memory Leaks with Observables** (Critical bug to avoid)
```typescript
// ? BAD: Memory leak!
ngOnInit() {
  this.apiService.getData().subscribe(data => this.data = data);
}

// ? GOOD: Properly unsubscribe
ngOnDestroy() {
  this.subscription.unsubscribe();
}

// ? BETTER: Using takeUntil pattern
private destroy$ = new Subject<void>();
ngOnInit() {
  this.apiService.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data);
}
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```
- **Critical:** Not unsubscribing causes memory leaks and crashes
- **For BiogenAI:** Keep track of subscriptions

---

### **Node.js / Express Advanced Concepts**

**1. Environment Variables Management**
```bash
# .env file (NEVER commit to git!)
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk_...
NODE_ENV=development
PORT=3000
```
- **Why:** Different settings for dev vs production
- **Example:** Your local database vs production database

**2. Middleware Order Matters** (In Express)
```typescript
// First: Parse body
app.use(express.json());

// Second: CORS
app.use(cors());

// Third: Authentication
app.use(authMiddleware);

// Last: Routes
app.use('/api', routes);
```
- **If order wrong:** Requests might not parse correctly
- **Important:** Middleware runs in order!

**3. Error Handling Middleware**
```typescript
// Must be LAST route
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});
```
- **Catches errors from all routes** automatically
- **Production requirement:** Always have this

**4. Rate Limiting** (Prevent API abuse)
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});

app.use('/api/', limiter);
```
- **Why:** Prevents brute force attacks, DoS attacks
- **For production:** Essential

**5. Request Validation** (Before processing)
```typescript
// Bad data gets rejected before touching database
app.post('/api/employee', (req, res) => {
  if (!req.body.email || !req.body.name) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // ... process request
});
```
- **Critical:** Never trust user input!
- **Always validate on backend** (client validation is not enough)

**5a. Circuit Breaker Pattern** (Prevent cascading failures)

When external services fail, stop calling them temporarily to prevent cascade:

```typescript
// src/lib/circuit-breaker.ts
export class CircuitBreaker {
  private failureCount = 0;
  private isOpen = false;
  private lastFailureTime: number | null = null;

  private readonly failureThreshold = 5;   // Open after 5 failures
  private readonly timeout = 60000;        // 1 minute

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen) {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.isOpen = false; // Try again
      } else {
        throw new Error('Circuit breaker open: Service unavailable');
      }
    }

    try {
      const result = await fn();
      this.failureCount = 0;
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.failureThreshold) {
        this.isOpen = true;
      }
      throw err;
    }
  }

  getState(): 'closed' | 'open' {
    return this.isOpen ? 'open' : 'closed';
  }
}
```

**Usage:**
```typescript
const breaker = new CircuitBreaker();

app.post('/api/bio/generate', async (req, res) => {
  try {
    const bio = await breaker.call(() => openaiService.generateBio(text));
    res.json({ bio });
  } catch (err) {
    if (err.message.includes('Circuit breaker open')) {
      res.status(503).json({ error: 'AI service temporarily unavailable' });
    }
  }
});
```

**For BiogenAI Phase 4+:** Add circuit breaker to OpenAI calls.

**File upload validation example (Express + multer)**
```typescript
// Use multer or similar to limit upload size and handle streaming
import multer from 'multer';
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

app.post('/api/resume/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File required' });
  // Check MIME type and basic content
  if (!['text/plain','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Unsupported file type' });
  }
  // Continue with safe processing: store metadata, stream to storage, queue heavy work
});
```

**6. Centralized Validation Pattern (Angular Best Practice)**

Extract validation logic into reusable services, not inline in components:

```typescript
// ? BAD: Validation mixed in component
onFileSelected(event) {
  const file = event.target.files[0];
  if (file.size > 5000000) { /* handle */ }
  if (!allowedTypes.includes(file.type)) { /* handle */ }
  // Hard to test, can't reuse
}

// ? GOOD: Dedicated validator service
@Injectable({ providedIn: 'root' })
export class FileValidatorService {
  async validateFile(file: File): Promise<ValidationError> {
    // Checks size, type, content in one reusable place
  }
}

// Component uses service
export class ResumeUploadComponent {
  constructor(private validator: FileValidatorService) {}
  async onFileSelected(event) {
    const error = await this.validator.validateFile(file);
    if (!error.isValid) this.errorMsg = error.message;
  }
}
```

**Validation strategy:**
- **Client-side (UX):** Quick checks in validators service (size, MIME, empty file)
- **Server-side (Security):** Re-validate everything, check content integrity, sanitize inputs
- **Never skip server validation** - client is not secure
- **Pattern:** Validator service ? Inject into components ? Call async validateFile()

---

### **Database Concepts**

**1. Indexes** (Speed up queries)
```prisma
model Employee {
  id String @id @default(cuid())
  email String @unique  // ? Creates index automatically
  name String
}
```
- **Without index:** Searching 1 million employees is slow
- **With index:** Same search is instant
- **For BiogenAI:** Not critical yet, but important for scaling

**2. Transactions** (Atomic operations)
```typescript
// Either BOTH succeed or BOTH fail (not one and one fails)
await prisma.$transaction([
  prisma.employee.create({ data: {...} }),
  prisma.resume.create({ data: {...} })
]);
```
- **Why:** Prevents partial updates (data inconsistency)
- **Example:** Transfer money from account A to B - both must succeed

**3. Connection Pooling** (Reuse database connections)
```
Without pooling: Open/close connection for each query (slow)
With pooling: Keep 10 connections open, reuse them (fast)
```
- **PostgreSQL default:** Good pooling built-in
- **For production:** May need PgBouncer for thousands of requests

---

### **DevOps / Docker Concepts**

**1. Docker Volumes** (Persistent storage)
```yaml
volumes:
  postgres_data:/var/lib/postgresql/data  # Data survives container restart
```
- **Without volume:** Stop container = lose all data
- **With volume:** Data persists on host machine

**2. Health Checks** (Ensure services are ready)
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```
- **Why:** Ensures database is ready before app connects
- **For BiogenAI:** Already in docker-compose.yml

**3. Multi-stage Docker Builds** (Smaller images)
```dockerfile
FROM node:20 as builder
RUN npm build  # Large build step

FROM node:20   # Fresh image (smaller)
COPY --from=builder /app/dist ./dist  # Only copy final output
```
- **Why:** Build images are huge, runtime images should be small
- **For production:** Can reduce image size by 80%

**4. Environment Configuration in Containers**
```bash
docker run -e DATABASE_URL="..." -e OPENAI_API_KEY="..." myapp
```
- **Never bake secrets into images!**
- **Always pass via environment variables**

---

### **Security Concepts**

**1. CORS (Cross-Origin Resource Sharing)**
```typescript
// ? Use environment config for CORS origins
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://biogenai.com']
  : process.env.NODE_ENV === 'staging'
  ? ['https://staging.biogenai.com']
  : ['http://localhost:4200'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```
- **Why:** Prevent malicious websites from calling your API
- **Dev:** localhost:4200 (Angular dev server)
- **Staging:** https://staging.biogenai.com
- **Production:** https://biogenai.com
- **For BiogenAI:** Already configured

**2. API Keys & Secrets** (Never expose!)
```typescript
// ? BAD: Exposed in code!
const apiKey = 'sk_live_abc123...';

// ? GOOD: From environment
const apiKey = process.env.OPENAI_API_KEY;
```
- **Rule:** Anything sensitive goes in .env
- **Never commit .env to git!**

**3. Input Validation** (Prevent injection attacks)
```typescript
// ? BAD: User input directly in SQL
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ? GOOD: Parameterized queries (Prisma does this)
const user = await prisma.employee.findUnique({
  where: { email: email }
});
```
- **Why:** Prevents SQL injection
- **Prisma:** Automatically safe from this

**4. Rate Limiting & Throttling**
```typescript
// Limit to 100 requests per 15 minutes
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```
- **Why:** Prevent brute force, DoS attacks
- **For production:** Essential

---

## 🎯 Success Metric

By the end of this 10-phase journey, you'll have:

? A working web application deployed to the cloud  
? 17.5 hours of hands-on experience with modern stack  
? Portfolio project to show employers  
? Understanding of full-stack architecture  
? Confidence to build other web applications  
? Professional development skills  

---

## 📞 Need Help?

- **Stuck on Phase 1?** Check the Docker installation
- **Component errors?** Run `ng generate component` again
- **API not responding?** Test with Postman first
- **Database issues?** Use Prisma Studio to inspect
- **Deployment problems?** Check environment variables

---

**Ready to build BiogenAI? Start with Phase 1 ? Setup! ??**

---

# Detailed Step Guides (Phase 2)

> **Note:** These detailed guides expand on the Phase 2 Roadmap above.
> The Roadmap gives a high-level overview (steps 2.1-2.7).
> These guides cover the hands-on implementation in depth.
> Step numbering here follows the detailed implementation order, not the Roadmap overview.
> Step 2.4 (Implement Resume Upload from Angular Frontend) is in ANGULAR_BEGINNERS_GUIDE.md.

---

# What is Multer?

Multer is a middleware for Node.js/Express that handles multipart/form-data, which is the encoding type used for file uploads in web forms.

**Why use Multer?**
- Express does not handle file uploads natively.
- Multer makes it easy to accept, validate, and store files securely.
- You can control where files are stored, their size, and which types are allowed.

**How does Multer work?**
- Parses incoming requests with file uploads (e.g., from Angular forms).
- Saves uploaded files to disk or memory.
- Adds the file info to `req.file` (for single file) or `req.files` (for multiple files) in your route handler.

**Best Practices:**
- Always validate file type and size.
- Never trust uploaded files blindly - consider virus scanning and cloud storage for production.

**Example:**
```typescript
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

app.post('/api/resumes', upload.single('resume'), (req, res) => {
  // req.file contains file info, req.body contains other form fields
});
```

---

# Step 2.3: Integrate Resume Upload with Backend API

**Purpose:**
Enable users to upload their resumes from the Angular frontend and store them on the server using a secure, robust API. This step connects your frontend form to your backend, allowing real file uploads and data persistence.

**What we'll use:**
- Multer (Node.js/Express middleware) to handle file uploads on the backend.
- Angular HttpClient and FormData to send files from the frontend.
- Best practices for validation, error handling, and user feedback.

**What you'll achieve:**
- A working end-to-end file upload flow, with files sent from the browser and received by your server.


## 1. Ensure Backend API Endpoint Exists

Your Node.js/Express backend should have an endpoint to handle file uploads, e.g.:

```typescript
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

app.post('/api/resumes', upload.single('resume'), (req, res) => {
  const { name } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // You can add DB logic here if needed
  res.json({ message: 'Resume uploaded successfully', file, name });
});
```

**Training Note:**
- Use `multer` for file uploads in Express.
- Always validate and sanitize inputs.

---

## 2. Generate Angular Service for Upload

Generate a service (if you don't have one):

```sh
ng generate service services/resume
```

---

## 3. Implement the Upload Method in the Service

```typescript
// src/app/services/resume.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private apiUrl = 'http://localhost:3000/api/resumes'; // Adjust as needed

  constructor(private http: HttpClient) {}

  uploadResume(name: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('resume', file);

    return this.http.post(this.apiUrl, formData);
  }
}
```

**Training Note:**
- Use `FormData` for file uploads.
- Set the backend URL as needed for your environment.

---

## 4. Use the Service in Your Component

```typescript
// src/app/components/resume-upload/resume-upload.ts
import { Component } from '@angular/core';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-resume-upload',
  standalone: true,
  templateUrl: './resume-upload.html',
  styleUrl: './resume-upload.css'
})
export class ResumeUpload {
  employeeName = '';
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private resumeService: ResumeService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload() {
    if (!this.employeeName || !this.selectedFile) {
      this.errorMessage = 'Please provide a name and select a file.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.resumeService.uploadResume(this.employeeName, this.selectedFile)
      .subscribe({
        next: (res) => {
          this.successMessage = 'Resume uploaded successfully!';
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Upload failed.';
          this.isLoading = false;
        }
      });
  }
}
```

---

## 5. Update the Template (if needed)

Your template already has the form and bindings. Just ensure the form calls `onUpload()` and file input calls `onFileSelected($event)`.

---

## 6. Test the End-to-End Flow

- Start your backend server.
- Start your Angular frontend (`npm run dev`).
- Fill the form, select a file, and upload.
- Check for success or error messages.

---

## Best Practices & Training Notes

- Always validate file type and size on both frontend and backend.
- Show clear feedback to users (loading, success, error).
- Use environment variables for API URLs in production.
- Secure your backend upload endpoint (authentication, file validation).

---

# Step 2.5: List Uploaded Resumes

**Purpose:**
Enable users to view a list of uploaded resumes by implementing a backend API and connecting it to the Angular frontend.

## 2.5.1: Add Backend API Endpoint to List Resumes

## 2.5.2: Test and Verify Resume List API

**How to test:**
- Use Postman or curl to call GET /api/resumes and ensure it returns the expected data.

## 2.5.3: Add Angular Service Method to Fetch Resume List

## 2.5.4: Test and Verify Angular Service

**How to test:**
- Call the service method and log the result to verify correct data retrieval.

## 2.5.5: Build Resume List Component

- Create a new Angular component to display the list of resumes.
- Use the service method to fetch and show the data.

**Important: Change Detection Issue**
- When loading data in `ngOnInit()` via `.subscribe()`, Angular may not detect variable changes inside the HTTP callback.
- If the UI stays on "Loading..." even though data arrived, use `ChangeDetectorRef.detectChanges()` after updating variables.
- Alternative: Use the `async` pipe in template to avoid `.subscribe()` entirely.

## 2.5.6: Test and Verify Resume List UI

**How to test:**
- Check the UI to confirm the list displays and updates as expected.

## 2.5.7: Add Download/View Actions (if required)

## 2.5.8: Test and Verify Download/View Actions

**How to test:**
- Test that files are received or displayed correctly when clicking download/view.

---

# Step 2.6: Refactor Backend into Modular Structure

**Purpose:**
Organize your Express backend into a clean, maintainable folder structure (routes, controllers, middleware, config) before adding more features in Phase 3. This prevents your index.ts from becoming unmanageable and follows industry best practices.

**What You'll Learn:**
- Express Router for modular route files
- Separation of concerns (routes vs controllers vs middleware)
- How to split a monolithic file into a scalable project structure

## 2.6.1: Create Folder Structure

- Create `src/routes/`, `src/controllers/`, `src/middleware/`, `src/config/` directories.

## 2.6.2: Extract Multer Configuration to Middleware

- Move Multer setup from index.ts to `src/middleware/upload.ts`.

## 2.6.3: Extract Resume Routes to a Route File

- Move all /api/resumes routes from index.ts to `src/routes/resume.ts` using Express Router.

## 2.6.4: Test and Verify Refactored Routes

**How to test:**
- Start the backend and hit all existing endpoints (health, upload, list) to confirm they still work after refactoring.

## 2.6.5: Extract Health Route

- Move /api/health to `src/routes/health.ts`.

## 2.6.6: Clean Up index.ts

- index.ts should only contain server startup, middleware registration, and route imports.

## 2.6.7: Final Verification

**How to test:**
- Test all endpoints again to confirm nothing is broken.
- Review index.ts to confirm it is clean and minimal.

---

# Advanced Configuration (Recommended for Production)

## Step 2.3a: Scan Uploaded Files for Viruses (ClamAV)

**Purpose:**
Ensure all uploaded files are safe and free from malware by scanning them with an antivirus engine before further processing or storage.

**What/Why:**
- Uploaded files can contain viruses or malware, posing a risk to your system and users.
- Scanning files with ClamAV (an open-source antivirus engine) helps protect your application and infrastructure.

**How:**
1. Install ClamAV on your server and ensure the clamd service is running.
2. Install a Node.js wrapper for ClamAV:
   ```sh
   npm install clamscan
   ```
3. In your Express route, after Multer saves the file, scan it before further processing:
   ```typescript
   import NodeClam from 'clamscan';

   const clam = await new NodeClam().init();

   app.post('/api/resumes', upload.single('resume'), async (req, res) => {
     const { name } = req.body;
     const file = req.file;
     if (!file) {
       return res.status(400).json({ error: 'No file uploaded' });
     }

     // Scan the uploaded file
     try {
       const { isInfected, viruses } = await clam.isInfected(file.path);
       if (isInfected) {
         // Optionally, delete the infected file here
         return res.status(400).json({ error: 'File is infected', viruses });
       }
     } catch (err) {
       return res.status(500).json({ error: 'Error scanning file' });
     }

     res.json({ message: 'Resume uploaded and clean', file, name });
   });
   ```

**Best Practices:**
- Always scan files before processing or storing them.
- Delete infected files immediately.
- For production, consider managed virus scanning or cloud storage with built-in scanning.

## Step 2.3b: Validate File Type and Size

**Purpose:**
Protect your application and users by ensuring only allowed file types and sizes are accepted during upload.

**What/Why:**
- Accepting any file type or size can lead to security risks, storage issues, and application errors.
- Validating file type and size helps prevent malicious uploads and resource abuse.

**How:**
1. Use Multer's configuration to set file size limits and filter allowed file types.
2. Example for PDF files up to 5MB:
   ```typescript
   const upload = multer({
     dest: 'uploads/',
     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
     fileFilter: (req, file, cb) => {
       if (!file.mimetype.startsWith('application/pdf')) {
         return cb(new Error('Only PDF files are allowed!'), false);
       }
       cb(null, true);
     }
   });
   ```

**Best Practices:**
- Always validate file type and size on the backend, even if you check on the frontend.
- Provide clear error messages to users if validation fails.
- Log validation failures for monitoring and security review.
---

**Document Version:** 2026 Beginner Edition | TypeScript + Angular + Node.js + PostgreSQL
