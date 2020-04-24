import { Component, OnInit } from '@angular/core';
import { SortingService } from 'src/app/services/sorting.service';

const ANIMATION_SPEED_MS = 2;
const NUMBER_OF_ARRAY_BARS = 200;
const PRIMARY_COLOR = 'turquoise';
const SECONDARY_COLOR = 'red';
const MAX_NUMBER = 730;

@Component({
  selector: 'app-sorting-vizualizer',
  templateUrl: './sorting-vizualizer.component.html',
  styleUrls: ['./sorting-vizualizer.component.scss']
})
export class SortingVizualizerComponent implements OnInit {
  array: number[] = [];
  loading = false;

  constructor(private sortingService: SortingService) { }

  ngOnInit(): void {
    this.resetArray();
  }

  sort() {
    this.loading = true;
    const animations = this.sortingService.evaluate([ ...this.array ]);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars: any = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;

        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
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
      array.push(this.randomIntFromInterval(5, MAX_NUMBER));
    }
    this.array = array;
  }

  // #region Private methods

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // #endregion
}
