import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalConstants} from "../util/global-constants";
import {ProfilePicChangeResponse} from "../dto/profile-pic-change-response";
import {SignOutResponse} from "../dto/sign-out-response";
import {GetUserDetailsResponse, GetUsersResponse} from "../dto/get-user-details-response";
import {ModifyPostResponse} from "../dto/modify-post-response";
import {Observable} from "rxjs";

@Injectable()
export class UserService {

  private changeProfilePicUrl: string;
  private getAllUsersUrl: string;
  private logoutUrl: string;
  private checkIfUserExistsUrl: string;
  private checkIfUserExistsUrlWithMail: string;
  private sendFcmTokenUrl: string;
  private getUserDetailsUrl: string;
  private modifyUserDetailsUrl: string;


  constructor(private http: HttpClient) {
    this.changeProfilePicUrl = GlobalConstants.APIURL + "/user/changeProfilePic";
    this.logoutUrl = GlobalConstants.APIURL + "/user/logout";
    this.sendFcmTokenUrl = GlobalConstants.APIURL + "/user/push";
    this.checkIfUserExistsUrl = GlobalConstants.APIURL + "/user/existsUsername";
    this.checkIfUserExistsUrlWithMail = GlobalConstants.APIURL + "/user/existsMail";
    this.getAllUsersUrl = GlobalConstants.APIURL + "/user/";
    this.getUserDetailsUrl = GlobalConstants.APIURL + "/user/details";
    this.modifyUserDetailsUrl = GlobalConstants.APIURL + "/user/details";
  }

  public changeProfilePic(image: File) {
    var formData: FormData = new FormData()
    formData.append("profilePic", image)
    return this.http.post<ProfilePicChangeResponse>(this.changeProfilePicUrl, formData);
  }

  public sendFcmToken(token: string) {
    var formData: FormData = new FormData()
    formData.append("string", token)
    return this.http.post<String>(this.sendFcmTokenUrl, formData);
  }

  public logOut() {
    return this.http.get<SignOutResponse>(this.logoutUrl);
  }

  public getAllUsers(pageNumber: number, pageLimit: number): Observable<GetUsersResponse> {
    return this.http.get<GetUsersResponse>(this.getAllUsersUrl + "?pageNumber=" + pageNumber + "&pageLimit=" + pageLimit);
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
