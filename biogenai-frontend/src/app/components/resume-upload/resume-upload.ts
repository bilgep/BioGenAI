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
    console.log("onUpload worked")

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

    this.resumeService.uploadResume(this.employeeName, this.selectedFile).subscribe({
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
    })


    // TODO: Implement upload logic
    // On success:
    // this.successMessage = 'Resume uploaded!';
    // this.employeeName = '';
    // this.selectedFile = null;
    // this.isLoading = false;
    // this.uploadProgress = 0;
    // On error:
    // this.errorMessage = 'Upload failed';
    // this.isLoading = false;
    // this.uploadProgress = 0;

  }
}
