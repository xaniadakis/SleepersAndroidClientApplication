import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FriendRequestsPage} from './friend-requests.page';

describe('FriendRequestsPage', () => {
  let component: FriendRequestsPage;
  let fixture: ComponentFixture<FriendRequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendRequestsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FriendRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
