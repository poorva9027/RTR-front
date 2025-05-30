import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopBtnComponent } from './pop-btn.component';

describe('PopBtnComponent', () => {
  let component: PopBtnComponent;
  let fixture: ComponentFixture<PopBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
