import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathfindingVizualizerComponent } from './pathfinding-vizualizer.component';

describe('PathfindingVizualizerComponent', () => {
  let component: PathfindingVizualizerComponent;
  let fixture: ComponentFixture<PathfindingVizualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathfindingVizualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathfindingVizualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
