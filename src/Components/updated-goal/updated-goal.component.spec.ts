import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedGoalComponent } from './updated-goal.component';

describe('UpdatedGoalComponent', () => {
  let component: UpdatedGoalComponent;
  let fixture: ComponentFixture<UpdatedGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatedGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
