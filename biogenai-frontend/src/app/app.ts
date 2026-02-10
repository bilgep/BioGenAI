import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResumeUpload } from './components/resume-upload/resume-upload';
import { ResumeList } from './components/resume-list/resume-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResumeUpload, ResumeList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('biogenai-frontend');
}
