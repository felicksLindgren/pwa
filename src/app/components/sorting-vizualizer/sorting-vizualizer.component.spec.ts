import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingVizualizerComponent } from './sorting-vizualizer.component';

describe('SortingVizualizerComponent', () => {
  let component: SortingVizualizerComponent;
  let fixture: ComponentFixture<SortingVizualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingVizualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingVizualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
