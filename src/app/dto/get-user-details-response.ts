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

export class FriendRequestDto{
  id: bigint;

  fromUser: UiUserDto;

  toUser: UiUserDto;
}

export class AddFriendResponse{
  message: string;
  friendId: bigint;
  status: FriendRequestStatusEnum;
}

export enum FriendRequestStatusEnum{
  SENT,
  PENDING,
  FAILED
}

export class UnfriendResponse{
  message: string;
  unfriendId: bigint;
}
