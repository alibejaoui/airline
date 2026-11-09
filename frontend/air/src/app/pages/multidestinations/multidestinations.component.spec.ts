import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDestinationsComponent } from './multidestinations.component';

describe('MultiDestinationsComponent', () => {
  let component: MultiDestinationsComponent;
  let fixture: ComponentFixture<MultiDestinationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiDestinationsComponent]
    });
    fixture = TestBed.createComponent(MultiDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

