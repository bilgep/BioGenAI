# Step 2.6: Refactor Backend into Modular Structure

**Purpose:**
Organize your Express backend into a clean, maintainable folder structure before adding more features. Keeping everything in index.ts becomes hard to read, test, and maintain as the project grows.

**What You'll Learn:**
- Express Router — a built-in way to split routes into separate files.
- Separation of concerns — routes define endpoints, controllers handle logic, middleware handles cross-cutting concerns.
- Industry-standard Node.js project structure.

**Best Practices:**
- Keep index.ts minimal — only server startup, middleware registration, and route imports.
- Group routes by resource (e.g., all resume routes in one file).
- Extract reusable middleware (e.g., Multer config) into its own file.
- Use `export default router` to export route modules.

**Alternatives:**
- NestJS: An opinionated framework that enforces this structure automatically (heavier, more to learn).
- Feature-based grouping: Put route + controller + tests in one folder per feature.

---

## 2.6.1: Create Folder Structure

Create these directories inside `biogenai-backend/src/`:
```
src/
  routes/       ← Route definitions (URL + HTTP method)
  controllers/  ← Business logic
  middleware/   ← Multer, auth, logging, etc.
  config/       ← Constants, environment variables
```

## 2.6.2: Extract Multer Configuration to Middleware

Move your Multer setup from index.ts to `src/middleware/upload.ts`.

## 2.6.3: Extract Resume Routes to a Route File

Move all /api/resumes routes to `src/routes/resume.ts` using Express Router.

**Example:**
```typescript
// src/routes/resume.ts
import { Router } from 'express';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', upload.single('resume'), (req, res) => { /* ... */ });
router.get('/', (req, res) => { /* ... */ });

export default router;
```

```typescript
// src/index.ts
import resumeRoutes from './routes/resume';
app.use('/api/resumes', resumeRoutes);
```

## 2.6.4: Test and Verify Refactored Routes

**How to test:**
- Start the backend and hit all existing endpoints (health, upload, list).
- Confirm they still work after refactoring.

## 2.6.5: Extract Health Route

Move /api/health to `src/routes/health.ts`.

## 2.6.6: Clean Up index.ts

index.ts should only contain server startup, middleware registration, and route imports.

## 2.6.7: Final Verification

**How to test:**
- Test all endpoints again.
- Review index.ts to confirm it is clean and minimal.

---

# Step 2.4: Implement Resume Upload from Angular Frontend

**Purpose:**
Enable users to upload their resumes from the Angular UI and send the file to your backend API, completing the end-to-end upload flow.

**What/Why:**
- The frontend must collect the user’s name and file, then send them to the backend using a POST request.
- Angular’s HttpClient and FormData are used to send files as multipart/form-data, which your backend (with Multer) can process.

---
## PREREQUISITE: Register HttpClient in app.config.ts

**Why?**
Angular's `HttpClient` will not work unless `provideHttpClient()` is registered in your app config. Without it, HTTP calls silently fail — no errors, no data, just nothing happens.

**How:**
Open `src/app/app.config.ts` and add `provideHttpClient()` to the providers array:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

**Important:** Do this BEFORE writing any service that uses `HttpClient`.

---
## 1. Generate the Resume Upload Service

**Why?**
A service keeps your HTTP logic separate from your UI, making your code modular and testable.

**How:**
In your Angular project folder, run:
```bash
ng generate service services/resume
```
This creates `src/app/services/resume.ts` (not resume.service.ts in the latest Angular CLI).

---

## 2. Implement the Upload Method in the Service

Open `src/app/services/resume.ts` and add:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private apiUrl = 'http://localhost:3000/api/resumes'; // Adjust if needed

  constructor(private http: HttpClient) {}

  uploadResume(name: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('resume', file);

    return this.http.post(this.apiUrl, formData);
  }
}
```

---

## 3. Update the Resume Upload Component

**Why?**
The component will use the service to send the file and show feedback to the user.

**How:**
- Inject ResumeService in your component.
- Call uploadResume() on form submit.
- Show loading, success, and error messages.


Example (in `src/app/components/resume-upload/resume-upload.ts`):

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume';

@Component({
  selector: 'app-resume-upload',
  imports: [FormsModule, CommonModule],
  templateUrl: './resume-upload.html',
  styleUrl: './resume-upload.css',
})
export class ResumeUpload {
  employeeName: string = '';
  selectedFile: File | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  uploadProgress = 0; // 0-100

  constructor(private resumeService: ResumeService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }

  onUpload() {
    this.errorMessage = '';
    this.successMessage = '';
    this.uploadProgress = 0;

    if (!this.employeeName.trim()) {
      this.errorMessage = 'Please enter your name';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file';
      return;
    }

    this.isLoading = true;

    this.resumeService.uploadResume(this.employeeName, this.selectedFile)
      .subscribe({
        next: () => {
          this.successMessage = 'Resume uploaded!';
          this.employeeName = '';
          this.selectedFile = null;
          this.isLoading = false;
          this.uploadProgress = 0;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Upload failed';
          this.isLoading = false;
          this.uploadProgress = 0;
        }
      });
  }
}
```

---



## 2.4.1: Test and Verify Resume Upload Integration

**Purpose:** Ensure your Angular frontend can successfully upload a file to the backend and receive a response.

**How to test:**
1. Start your backend server (e.g., `npm run dev` in the backend folder).
2. Start your Angular frontend server (e.g., `npm run dev` in the frontend folder).
3. Open your app in the browser.
4. Use the resume-upload form to select and upload a file.
5. Check for a success message in the UI.
6. Verify the file appears in the backend's `uploads` directory.
7. (Optional) Check backend logs for the upload request.

**If you see the success message and the file is saved, your integration works! If not, review error messages and debug as needed.**

---
# Step 2.5: List Uploaded Resumes

**Purpose:**
Enable users to view a list of uploaded resumes by implementing a backend API and connecting it to the Angular frontend.

---

## 2.5.1: Add Backend API Endpoint to List Resumes

**How:**
- In your Express backend, add a GET /api/resumes endpoint that reads the uploads directory and returns a list of filenames.

## 2.5.2: Test and Verify Resume List API

**How to test:**
1. Use Postman, curl, or your browser to call http://localhost:3000/api/resumes.
2. Confirm you receive a JSON list of uploaded files.
3. If you see the expected data, your backend endpoint works!

---

## 2.5.3: Add Angular Service Method to Fetch Resume List

**How:**
- In your ResumeService, add a method to GET /api/resumes and return the list.

## 2.5.4: Test and Verify Angular Service

**How to test:**
1. Temporarily call this method from a component and log the result to the console.
2. Confirm the data matches what the backend returns.

---

## 2.5.5: Build Resume List Component

**How:**
- Create a new Angular component to display the list of resumes.
- Use the service method to fetch and show the data.

**Important: Change Detection Issue**
When loading data in `ngOnInit()` via `.subscribe()`, Angular may not automatically detect that your variables changed inside the HTTP callback. If the UI stays on "Loading..." even though data arrived:
- Use `ChangeDetectorRef.detectChanges()` after setting your variables:
```typescript
import { ChangeDetectorRef } from '@angular/core';

constructor(private resumeService: ResumeService, private cdr: ChangeDetectorRef) {}

this.resumeService.getResumes().subscribe({
  next: (data) => {
    this.files = data.files;
    this.isLoading = false;
    this.cdr.detectChanges(); // Force Angular to re-render
  }
});
```
- **Alternative (cleaner, more advanced):** Use the `async` pipe in the template to bind Observables directly without `.subscribe()`.

## 2.5.6: Test and Verify Resume List UI

**How to test:**
1. Open the UI and confirm the list displays correctly.
2. Upload a new file and check that the list updates.

---

## 2.5.7: Add Download/View Actions (if required)

**How:**
- Add buttons or links to download or view each resume.
- Implement the backend endpoint if needed.

## 2.5.8: Test and Verify Download/View Actions

**How to test:**
1. Click the download/view button and confirm the file is received or displayed.

---

Let me know when you’re ready for the next step, or if you want help with any part of this process!

