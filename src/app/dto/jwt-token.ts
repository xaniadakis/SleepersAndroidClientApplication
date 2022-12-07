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
