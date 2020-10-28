import { Component, NgModule, OnInit } from '@angular/core';
import * as speech from '@tensorflow-models/speech-commands';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-speech-recognition',
  templateUrl: './speech-recognition.component.html',
  styleUrls: ['./speech-recognition.component.scss']
})
export class SpeechRecognitionComponent implements OnInit {
  recognizer: speech.SpeechCommandRecognizer;
  words: string[];
  predictions: { score: number, word: string }[] = [];
  recording = false;
  loading = false;

  constructor(private snack: MatSnackBar) { }

  ngOnInit() { }

  initializeRecognizer = async () => {
    try {
      this.loading = true;
      this.snack.open('Initializing recognizer');
      this.recognizer = speech.create('BROWSER_FFT');
      await this.recognizer.ensureModelLoaded();
      this.words = this.recognizer.wordLabels();
      this.recording = true;
      this.snack.open('Recognizer listening');
      this.loading = false;
      this.recognizer.listen(async (result: any) => {
        const scores = Array.from(result.scores).map((s, i) => ({ score: s, word: this.words[i]})) as { score: number, word: string }[];
        scores.sort((s1, s2) => s2.score - s1.score);
        this.predictions.push(scores.splice(0, 1)[0]);
      }, { probabilityThreshold: 0.90 });
    } catch (e) {
      await this.terminateRecognizer();
      this.loading = false;
      throw e;
    }
  }

  terminateRecognizer = async () => {
    await this.recognizer.stopListening();
    this.recording = false;
    this.snack.open('Recognizer terminated');
    this.predictions = [];
  }
}

@NgModule({
  declarations: [ SpeechRecognitionComponent ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: SpeechRecognitionComponent
    }])
]
})
export class SpeechRecognitionModule { }
