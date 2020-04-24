import { Injectable } from '@angular/core';

export class Bar {
  index: number;
  height: number;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() { }

  evaluate(array: number[]): any[] {
    const animations = [];

    if (array.length <= 1) { return array; }

    const auxiliary = [ ...array ];
    this.helper(array, 0, array.length - 1, auxiliary, animations);
    return animations;
  }

  private helper(
    main: number[],
    start: number,
    end: number,
    auxiliary: number[],
    animations: number[][]
  ): void {
    if (start === end) { return; }

    const middle = Math.floor((start + end) / 2);

    this.helper(auxiliary, start, middle, main, animations);
    this.helper(auxiliary, middle + 1, end, main, animations);

    this.merge(main, start, middle, end, auxiliary, animations);
  }

  private merge(
    main: number[],
    start: number,
    middle: number,
    end: number,
    auxiliary: number[],
    animations: number[][]
  ): void {
    let k = start;
    let i = start;
    let j = middle + 1;

    while (i <= middle && j <= end) {
      // These are the values that we're comparing; we push them once to change their color.
      animations.push([i, j]);
      // These are the values that we're comparing; we push them a second time to revert their color.
      animations.push([i, j]);

      if (auxiliary[i] <= auxiliary[j]) {
        // We overwrite the value at index k in the original array with the value at index i in the auxiliary array.
        animations.push([k, auxiliary[i]]);
        main[k++] = auxiliary[i++];
      } else {
        // We overwrite the value at index k in the original array with the value at index j in the auxiliary array.
        animations.push([k, auxiliary[j]]);
        main[k++] = auxiliary[j++];
      }
    }

    while (i <= middle) {
      // These are the values that we're comparing; we push them once to change their color.
      animations.push([i, i]);
      // These are the values that we're comparing; we push them a second time to revert their color.
      animations.push([i, i]);
      // We overwrite the value at index k in the original array with the value at index i in the auxiliary array.
      animations.push([k, auxiliary[i]]);
      main[k++] = auxiliary[i++];
    }

    while (j <= end) {
      // These are the values that we're comparing; we push them once to change their color.
      animations.push([j, j]);
      // These are the values that we're comparing; we push them a second time to revert their color.
      animations.push([j, j]);
      // We overwrite the value at index k in the original array with the value at index j in the auxiliary array.
      animations.push([k, auxiliary[j]]);
      main[k++] = auxiliary[j++];
    }
  }
}
