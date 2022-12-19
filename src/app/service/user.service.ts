import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalConstants} from "../util/global-constants";
import {ProfilePicChangeResponse} from "../dto/profile-pic-change-response";
import {SignOutResponse} from "../dto/sign-out-response";

@Injectable()
export class UserService {

  private changeProfilePicUrl: string;
  private logoutUrl: string;
  private checkIfUserExistsUrl: string;
  private checkIfUserExistsUrlWithMail: string;


  constructor(private http: HttpClient) {
    this.changeProfilePicUrl = GlobalConstants.APIURL + "/user/changeProfilePic";
    this.logoutUrl = GlobalConstants.APIURL + "/user/logout";
    this.checkIfUserExistsUrl = GlobalConstants.APIURL + "/user/existsUser";
    this.checkIfUserExistsUrlWithMail = GlobalConstants.APIURL + "/user/existsUserWithMail";
  }

  public changeProfilePic(image: File) {
    var formData: FormData = new FormData()
    formData.append("profilePic", image)
    return this.http.post<ProfilePicChangeResponse>(this.changeProfilePicUrl, formData);
  }

  public logOut() {
    return this.http.get<SignOutResponse>(this.logoutUrl);
  }

  public checkIfUserExists(username: string) {
    return this.http.get<boolean>(this.checkIfUserExistsUrl+"?username="+username);
  }

  checkIfUserExistsWithMail(mail: any) {
    return this.http.get<boolean>(this.checkIfUserExistsUrlWithMail+"?mail="+mail);
  }
}
