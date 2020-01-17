import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';

@Component({
  selector: 'app-tensorflow',
  templateUrl: './tensorflow.component.html',
  styleUrls: ['./tensorflow.component.scss']
})
export class TensorflowComponent implements OnInit {
  @ViewChild('image', { static: false }) image: ElementRef;
  imageSrc: string;
  predictions: any[];
  model: any;
  loading = true;

  constructor() { }

  async ngOnInit() {
    this.model = await mobilenet.load();
    this.loading = false;
  }

  async fileChange(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) { return; }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (res: any): void => {
      this.imageSrc = res.target.result;

      setTimeout(async () => {
        this.predictions = await this.model.classify(this.image.nativeElement);
      });
    };
  }

}
