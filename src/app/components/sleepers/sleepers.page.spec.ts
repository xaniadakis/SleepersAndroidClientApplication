import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SleepersPage} from './sleepers.page';

describe('SleepersPage', () => {
  let component: SleepersPage;
  let fixture: ComponentFixture<SleepersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SleepersPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SleepersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
