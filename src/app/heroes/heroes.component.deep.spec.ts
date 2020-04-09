import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { NO_ERRORS_SCHEMA, Directive, Input } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

/**This is actually included in the main angular.io documentation
 * on how to create stubs of directives. Stubbing out routing is
 * pretty common.
 */
@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'SpiderDude', strength: 8 },
      { id: 2, name: 'Wonderful Woman', strength: 24 },
      { id: 3, name: 'SuperDude', strength: 55 }
    ]
    mockHeroService = jasmine.createSpyObj(["getHeroes", "addHero", "deleteHero"]);
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      // schemas: [NO_ERRORS_SCHEMA
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit
    fixture.detectChanges();

    const heroComponentsDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentsDEs.length).toEqual(3);
    for (let i = 0; i < heroComponentsDEs.length; i++) {
      expect(heroComponentsDEs[i].componentInstance.hero.name).toEqual(HEROES[i].name);
    }
  });

  it(`should call heroService.deleteHero when the HeroComponent's
      delete button is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    /**Possibly over the top test, because we're going into the
     * child component and ordering the delete button to be clicked
     */
    // heroComponents[1].query(By.css('button'))
      // .triggerEventHandler('click', {stopPropagation: () => {}});

    /**As opposed to triggering a click event in a child component
     * this just checks to see if the bindings.
     * From a modular standpoint, this maybe makes more sense, since
     * the child component should run it's own tests to check if the
     * events work as expected. This just checks the bindings, which
     * is kind of all we care about.
     */ 
    (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

    /**Not really true deep test, because this doesn't check to see if
     * delete is an actual function in the child component.
     */
    // heroComponents[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();
    const name = "Mr. Ice";
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
    // nativeElement gets you the underlying DOM object
    const inputElement = fixture.debugElement.query(By.css("input")).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});