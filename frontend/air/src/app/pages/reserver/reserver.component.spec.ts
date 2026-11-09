import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserverComponent } from './reserver.component';

describe('ReserverComponent', () => {
  let component: ReserverComponent;
  let fixture: ComponentFixture<ReserverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReserverComponent]
    });
    fixture = TestBed.createComponent(ReserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

