import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { of, fromEvent, Observable, merge } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { transition, animate, trigger, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('toolbar', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('150ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  online$: Observable<boolean>;
  route$: Observable<ActivatedRoute>;
  mobileQuery: MediaQueryList;
  darkMode = false;
  route: string;

  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    router: Router
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 1025px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    router.events.pipe(filter(e => e instanceof RoutesRecognized)).subscribe((r: RoutesRecognized) => {
      this.route = r.state.root.firstChild.data.title;
    });
  }

  ngOnInit(): void {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(_ => true)),
      fromEvent(window, 'offline').pipe(map(_ => false))
    );
  }

  toggleDarkMode = () => this.darkMode = !this.darkMode;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
