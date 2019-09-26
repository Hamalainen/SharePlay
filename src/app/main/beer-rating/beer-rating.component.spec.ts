import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerRatingComponent } from './beer-rating.component';

describe('BeerRatingComponent', () => {
  let component: BeerRatingComponent;
  let fixture: ComponentFixture<BeerRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeerRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
