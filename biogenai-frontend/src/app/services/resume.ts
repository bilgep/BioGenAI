import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ResumeService {
  private apiUrl = 'http://localhost:3000/api/resumes';

  constructor(private http: HttpClient) {}

  uploadResume(name : string, file: File): Observable<any>{
    const formData = new FormData();
    formData.append('name', name);
    formData.append('resume', file);

    return this.http.post(this.apiUrl, formData);
  }

  // TODO Use an interface for the response type
  /*
  interface ResumeListResponse {
    files: string[];
  }
  */
  getResumes() : Observable<{files: string[]}>{
    return this.http.get<{files : string[]}>(this.apiUrl);
  }

  getDownloadUrl(filename: string): string {
    return `${this.apiUrl}/${filename}`
  }
}
