import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { ResumeUpload } from './components/resume-upload/resume-upload';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResumeUpload],
=======

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
>>>>>>> 54997c7 (initial commit)
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('biogenai-frontend');
}
