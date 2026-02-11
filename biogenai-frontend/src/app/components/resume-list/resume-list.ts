import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume';

@Component({
  selector: 'app-resume-list',
  imports: [CommonModule],
  templateUrl: './resume-list.html',
  styleUrl: './resume-list.css',
})
export class ResumeList implements OnInit {
  files: string[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    public resumeService: ResumeService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadResumes();
  }

  loadResumes() {
    this.isLoading = true;
    this.errorMessage = '';

    this.resumeService.getResumes().subscribe({
      next: (data) => {
        this.files = data.files;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load resumes';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading resumes:', err);
      }
    });
  }
}