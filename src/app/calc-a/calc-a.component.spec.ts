import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcAComponent } from './calc-a.component';

describe('CalcAComponent', () => {
  let component: CalcAComponent;
  let fixture: ComponentFixture<CalcAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
