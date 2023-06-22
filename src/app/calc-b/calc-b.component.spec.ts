import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcBComponent } from './calc-b.component';

describe('CalcBComponent', () => {
  let component: CalcBComponent;
  let fixture: ComponentFixture<CalcBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
