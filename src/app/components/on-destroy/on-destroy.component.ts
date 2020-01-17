import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-on-destroy',
  template: '',
  styles: ['']
})
export class OnDestroyComponent implements OnDestroy {
  destroy$ = new Subject();

  ngOnDestroy() {
    this.destroy$.next();
  }
}
