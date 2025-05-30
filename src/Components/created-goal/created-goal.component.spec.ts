import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedGoalComponent } from './created-goal.component';

describe('CreatedGoalComponent', () => {
  let component: CreatedGoalComponent;
  let fixture: ComponentFixture<CreatedGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
