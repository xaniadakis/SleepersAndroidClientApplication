export class SignUpResponse {
  jwt: string;
  message: string;
  admin: boolean;
  profilePic: string;
}

export class SignInResponse {
  jwt: string;
  message: string;
  admin: boolean;
  profilePic: string;
}

export class SignOutResponse {
  message: string;
}

export class JwtTokenHeader{
    typ: string;
    alg: string;
}

export class JwtTokenPayload{
  iat: bigint;
  exp: bigint;
  name: string;
  email: string;
  sub: string;
}
