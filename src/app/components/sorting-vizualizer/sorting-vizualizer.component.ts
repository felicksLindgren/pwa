import { Component, OnInit } from '@angular/core';
import { SortingService, Bar } from 'src/app/services/sorting.service';

const ANIMATION_SPEED_MS = 2;
const NUMBER_OF_ARRAY_BARS = 200;

@Component({
  selector: 'app-sorting-vizualizer',
  templateUrl: './sorting-vizualizer.component.html',
  styleUrls: ['./sorting-vizualizer.component.scss']
})
export class SortingVizualizerComponent implements OnInit {
  array: number[] = [];
  primaryColor = 'turquoise';
  secondaryColor = 'red';
  maxNumber = 730;
  loading = false;

  constructor(private sortingService: SortingService) { }

  ngOnInit(): void {
    this.resetArray();
  }

  sort() {
    this.loading = true;
    const animations = this.sortingService.evaluate([ ...this.array ]);
    console.log(animations);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars: any = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;

        const color = i % 3 === 0 ? this.secondaryColor : this.primaryColor;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    setTimeout(() => {
      this.loading = false;
    }, animations.length * ANIMATION_SPEED_MS);

  }

  resetArray() {
    const array: number[] = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      array.push(this.randomIntFromInterval(5, this.maxNumber));
    }
    this.array = array;
  }

  // #region Private methods

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // #endregion
}
