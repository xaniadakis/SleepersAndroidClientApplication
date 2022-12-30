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
}

export class GetUsersResponse {
  uiUserDtos: UiUserDto[];
  message: string;
}

export class UiUserDto {
  id: bigint;
  username: string;
  profilePic: string;
  isOnline: string;
}
