import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalConstants} from "../util/global-constants";
import {ProfilePicChangeResponse} from "../dto/profile-pic-change-response";
import {SignOutResponse} from "../dto/sign-out-response";
import {
  AddFriendResponse,
  ForgotPasswordResponse,
  FriendRequestDto,
  GetUserDetailsResponse,
  GetUsersResponse,
  UiUserDto,
  UnfriendResponse
} from "../dto/get-user-details-response";
import {ModifyPostResponse} from "../dto/modify-post-response";
import {Observable} from "rxjs";
import {NotificationIntentionDto} from "../dto/create-post-response";

@Injectable()
export class UserService {

  private changeProfilePicUrl: string;
  private changeProfilePicV2Url: string;
  private getAllUsersUrl: string;
  private logoutUrl: string;
  private checkIfUserExistsUrl: string;
  private checkIfUserExistsUrlWithMail: string;
  private sendFcmTokenUrl: string;
  private receiveNotificationsIntentionUrl: string;
  private setNotificationsIntentionUrl: string;
  private getUserDetailsUrl: string;
  private modifyUserDetailsUrl: string;
  private forgotPasswordUrl: string;

  private addFriendUrl: string;
  private unfriendUrl: string;
  private friendRequestsUrl: string;
  private friendsUrl: string;
  private nonFriendsUrl: string;

  private handleFriendRequestUrl: string;

  constructor(private http: HttpClient) {
    this.changeProfilePicUrl = GlobalConstants.APIURL + "/user/changeProfilePic";
    this.changeProfilePicV2Url = GlobalConstants.APIURL + "/user/v2/changeProfilePic";
    this.logoutUrl = GlobalConstants.APIURL + "/user/logout";
    this.sendFcmTokenUrl = GlobalConstants.APIURL + "/user/push";
    this.receiveNotificationsIntentionUrl = GlobalConstants.APIURL + "/user/pushIntention";
    this.setNotificationsIntentionUrl = GlobalConstants.APIURL + "/user/setPushIntention";
    this.checkIfUserExistsUrl = GlobalConstants.APIURL + "/user/existsUsername";
    this.checkIfUserExistsUrlWithMail = GlobalConstants.APIURL + "/user/existsMail";
    this.getAllUsersUrl = GlobalConstants.APIURL + "/user/";
    this.getUserDetailsUrl = GlobalConstants.APIURL + "/user/details";
    this.modifyUserDetailsUrl = GlobalConstants.APIURL + "/user/details";
    this.forgotPasswordUrl = GlobalConstants.APIURL + "/user/forgotPassword";

    this.addFriendUrl = GlobalConstants.APIURL + "/user/addFriend";
    this.unfriendUrl = GlobalConstants.APIURL + "/user/unfriend";
    this.friendRequestsUrl = GlobalConstants.APIURL + "/user/friendRequests";
    this.friendsUrl = GlobalConstants.APIURL + "/user/friends";
    this.nonFriendsUrl = GlobalConstants.APIURL + "/user/nonFriends";
    this.handleFriendRequestUrl = GlobalConstants.APIURL + "/user/friendRequest";
  }

  public changeProfilePic(image: File) {
    var formData: FormData = new FormData()
    formData.append("profilePic", image)
    return this.http.post<ProfilePicChangeResponse>(this.changeProfilePicUrl, formData);
  }

  public changeProfilePicV2(image: string) {
    var formData: FormData = new FormData()
    formData.append("profilePic", image)
    return this.http.post<ProfilePicChangeResponse>(this.changeProfilePicV2Url, formData);
  }

  public sendFcmToken(token: string) {
    var formData: FormData = new FormData()
    formData.append("string", token)
    return this.http.post<String>(this.sendFcmTokenUrl, formData);
  }

  public receiveNotificationsIntention() {
    return this.http.get<NotificationIntentionDto>(this.receiveNotificationsIntentionUrl);
  }

  public setNotificationsIntention(intent: boolean) {
    return this.http.get<NotificationIntentionDto>(this.setNotificationsIntentionUrl + "?intention=" + intent);
  }

  public logOut() {
    return this.http.get<SignOutResponse>(this.logoutUrl);
  }

  public getAllUsers(pageNumber: number, pageLimit: number): Observable<GetUsersResponse> {
    return this.http.get<GetUsersResponse>(this.getAllUsersUrl + "?pageNumber=" + pageNumber + "&pageLimit=" + pageLimit);
  }

  public forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.get<ForgotPasswordResponse>(this.forgotPasswordUrl + "?email=" + email);
  }

  public checkIfUserExists(username: string) {
    return this.http.get<boolean>(this.checkIfUserExistsUrl + "?username=" + username);
  }

  checkIfUserExistsWithMail(mail: any) {
    return this.http.get<boolean>(this.checkIfUserExistsUrlWithMail + "?mail=" + mail);
  }

  retrieveUserDetails(userId: bigint): Observable<GetUserDetailsResponse> {
    return this.http.get<GetUserDetailsResponse>(this.getUserDetailsUrl + "?userId=" + userId);
  }

  addFriend(userId: bigint): Observable<AddFriendResponse> {
    return this.http.get<AddFriendResponse>(this.addFriendUrl + "?friendId=" + userId);
  }

  unfriend(userId: bigint): Observable<UnfriendResponse> {
    return this.http.get<UnfriendResponse>(this.unfriendUrl + "?friendId=" + userId);
  }

  getFriendRequests(): Observable<Set<FriendRequestDto>> {
    return this.http.get<Set<FriendRequestDto>>(this.friendRequestsUrl);
  }

  getFriends(): Observable<UiUserDto[]> {
    return this.http.get<UiUserDto[]>(this.friendsUrl);
  }

  getNonFriends(): Observable<UiUserDto[]> {
    return this.http.get<UiUserDto[]>(this.nonFriendsUrl);
  }

  handleFriendRequest(friendRequestId: bigint, accept: boolean): Observable<String> {
    let uri = this.handleFriendRequestUrl + "?id=" + friendRequestId + "&accept=" + accept;
    console.log(uri)
    return this.http.get<String>(uri);
  }

  modifyUserDetails(email: string,
                    nickname: string,
                    fullName: string,
                    myQuote: string,
                    myOccupation: string,
                    myHobby: string,
                    newPassword: string,
                    oldPassword: string) {
    var modifyUser: FormData = new FormData()
    modifyUser.append("email", email)
    modifyUser.append("username", nickname)
    modifyUser.append("fullName", fullName)
    modifyUser.append("myQuote", myQuote)
    modifyUser.append("myOccupation", myOccupation)
    modifyUser.append("myHobby", myHobby)
    modifyUser.append("newPassword", newPassword)
    modifyUser.append("oldPassword", oldPassword)
    return this.http.put<ModifyPostResponse>(this.modifyUserDetailsUrl, modifyUser);
  }
}
