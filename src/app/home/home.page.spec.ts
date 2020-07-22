import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HomePage } from './home.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule],
      providers: [accountService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
  }));

  it('Successfully Created Home Page', () => {
    expect(component).toBeTruthy();
  });

  it('Testing Home Components', () => {
    expect(component.siteLst).toBeUndefined();
    expect(component.loginLabel).toBeDefined();
  });

  it('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.loginLabel).toBe("Login");
  });

  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.loginLabel).toBe("Login");
  });

  it('Testing loginClick()', () => {
    component.loginClick();
  });

  it('Testing sendEmail()', () => {
    component.sendEmail();
    let accountSpy = spyOn(accService, 'sendValidationEmail').and.callThrough();
    expect(accountSpy).toBeDefined();
  });

  it('Testing Home Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.sendEmail).toBeTruthy();
  });
});
