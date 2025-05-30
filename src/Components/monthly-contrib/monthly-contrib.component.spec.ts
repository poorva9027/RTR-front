import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthlyContribComponent } from './monthly-contrib.component';

describe('MonthlyContribComponent', () => {
  let component: MonthlyContribComponent;
  let fixture: ComponentFixture<MonthlyContribComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyContribComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyContribComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render initial current and expected monthly savings', () => {
    component.animatedActualValue = 1000;
    component.animatedRecommendedValue = 2000;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('p.text-\\[24px\\]')[0].textContent).toContain('$1000');
    expect(compiled.querySelectorAll('p.text-\\[24px\\]')[1].textContent).toContain('$2000');
  });

  it('should update displayed values when animated values change', () => {
    component.animatedActualValue = 1000;
    component.animatedRecommendedValue = 2000;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('p.text-\\[24px\\]')[0].textContent).toContain('$1000');
    expect(compiled.querySelectorAll('p.text-\\[24px\\]')[1].textContent).toContain('$2000');

    component.animatedActualValue = 3000;
    component.animatedRecommendedValue = 4000;
    fixture.detectChanges();
    expect(compiled.querySelectorAll('p.text-\\[24px\\]')[0].textContent).toContain('$3000');
    expect(compiled.querySelectorAll('p.text-\\[24px\\]')[1].textContent).toContain('$4000');
  });

  it('should render images correctly', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const images = compiled.querySelectorAll('img');
    expect(images.length).toBe(2);
    expect(images[0].getAttribute('src')).toBe('images/target.png');
    expect(images[1].getAttribute('src')).toBe('images/target-1.png');
    expect(images[0].getAttribute('alt')).toBe('logo');
    expect(images[1].getAttribute('alt')).toBe('logo');
  });

  it('should have divs with specific background colors', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const divs = compiled.querySelectorAll('div[class*="bg-"]');
    expect(divs.length).toBeGreaterThanOrEqual(2);

    let div1Found = false;
    let div2Found = false;

    divs.forEach(div => {
      if (div.classList.contains('bg-[#E6ECFE]')) {
        div1Found = true;
      }
      if (div.classList.contains('bg-[#CFEDFF]')) {
        div2Found = true;
      }
    });

    expect(div1Found).toBe(true);
    expect(div2Found).toBe(true);
  });
});
