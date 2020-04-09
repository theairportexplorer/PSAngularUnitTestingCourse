import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      // double-edged sword - only use when you absolutely need to
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3};

    expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
  });

  it("should render the hero name in an anchor tag", () => {
    fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3};
    fixture.detectChanges();

    // debugElement gets the wrapper around the anchor tag, but it also
    // exposes some other Angular hooks
    let deA = fixture.debugElement.query(By.css('a'));
    expect(deA.nativeElement.textContent).toContain('SuperDude');

    // fixture.nativeElement retrieves the browser DOM
    // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
  });
});