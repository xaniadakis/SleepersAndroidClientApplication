export class GetUserDetailsResponse {
  userDetailsDto: UserDetailsDto;
  message: string;
}

export class UserDetailsDto {
  username: string;
  password: string;
  email: string;
  profilePic: string;
  fullName: string;
  myOccupation: string;
  myHobby: string;
  myQuote: string;
  lastActedAt: string;
}

export class GetUsersResponse {
  uiUserDtos: UiUserDto[];
  message: string;
}

export class UiUserDto {
  id: bigint;
  username: string;
  profilePic: string;
  lastActedAt: string;
}

export class ForgotPasswordResponse {
  // newPassword: string;
  message: string;
}
