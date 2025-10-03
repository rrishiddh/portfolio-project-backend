import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (payload: TokenPayload): TokenResponse => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET as jwt.Secret, 
    {
      expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h', 
    }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as jwt.Secret,
    {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) || '7d', 
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as jwt.Secret) as TokenPayload;
};
