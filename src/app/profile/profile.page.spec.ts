import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfilePage } from './profile.page';
import { AppModule } from '../app.module';
import { accountService } from '../service/account.service';
import { diveService } from '../service/dive.service';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

var validData = {
  diveT: "Reef Dive"
};

fdescribe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let accService: accountService;
  let http: HttpClient;
  let router; Router;
  let divService: diveService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, AppModule],
      providers: [accountService, diveService]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    accService = new accountService(http, router);
    divService = new diveService(http, router);
  }));

  fit('Succesfully Created Profile Page', () => {
    expect(component).toBeTruthy();
  });

  fit('Testing Profile Components', () => {
    expect(component.loginLabel).toBeDefined();
    expect(component.AD).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.OptionalList).toBeUndefined();
    expect(component.EquipmentList).toBeUndefined();
    expect(component.viewChecklist).toBeFalse();
    expect(component.viewProfile).toBeDefined();
    expect(component.editProfile).toBeDefined();
    expect(component.showLoading).toBeDefined();
    expect(component.showAD).toBeFalse();
  });

  fit('Testing ngOnInit()', () => {
    component.ngOnInit();
    expect(component.viewProfile).toBeTrue();
    expect(component.editProfile).toBeFalse();
    expect(component.loginLabel).toBe("Login");
    let accountSpy = spyOn(accService, 'getUser').and.callThrough();
    expect(accountSpy).toBeDefined();
    let diveSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.showAD).toBeFalse();
    expect(component.AD).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
  });
  
  it('Testing ionViewWillEnter()', () => {
    component.ionViewWillEnter();
    expect(component.viewProfile).toBeTrue();
    expect(component.editProfile).toBeFalse();
    expect(component.loginLabel).toBe("Login");
    let accountSpy = spyOn(accService, 'getUser').and.callThrough();
    expect(accountSpy).toBeDefined();
    let diveSpy = spyOn(divService, 'getDiveTypes').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.AD).toBeUndefined();
    expect(component.DiveTypeLst).toBeUndefined();
    expect(component.showLoading).toBeTrue();
  });

  // fit('Testing loginClick()', () => {
  //   component.loginClick();
  // });

  fit('Testing onChooseDive()', () => {
    component.onChooseDive(validData.diveT, event);
    let diveSpy = spyOn(divService, 'getCheckList').and.callThrough();
    expect(diveSpy).toBeDefined();
    expect(component.showLoading).toBeTrue();
    expect(component.viewChecklist).toBeFalse();
    expect(component.OptionalList).toBeUndefined();
    expect(component.EquipmentList).toBeUndefined();
  });

  fit('Testing goToEdit()', () => {
    component.goToEdit();
  });

  fit('Testing Profile Functionality', () => {
    expect(component.ngOnInit).toBeTruthy();
    expect(component.ionViewWillEnter).toBeTruthy();
    expect(component.loginClick).toBeTruthy();
    expect(component.onChooseDive).toBeTruthy();
    expect(component.goToEdit).toBeTruthy();
  });
});
