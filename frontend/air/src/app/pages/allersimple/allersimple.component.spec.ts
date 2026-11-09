import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllerSimpleComponent } from './allersimple.component';

describe('AllerSimpleComponent', () => {
  let component: AllerSimpleComponent;
  let fixture: ComponentFixture<AllerSimpleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllerSimpleComponent]
    });
    fixture = TestBed.createComponent(AllerSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

