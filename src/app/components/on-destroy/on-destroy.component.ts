import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-on-destroy',
  template: '',
  styles: ['']
})
export class OnDestroyComponent implements OnDestroy {
  destroy$ = new Subject();

  constructor() { }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
