import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (payload: object, options: SignOptions = {}) => {
  const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

  if (!accessTokenPrivateKey) {
    throw new Error('ACCESS_TOKEN_PRIVATE_KEY is not define in .env config');
  }

  const privateKey = Buffer.from(accessTokenPrivateKey, 'base64').toString('ascii');

  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    const accessTokenPublicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY;

    if (!accessTokenPublicKey) {
      throw new Error('ACCESS_TOKEN_PUBLIC_KEY is not define in .env config');
    }

    const publicKey = Buffer.from(accessTokenPublicKey, 'base64').toString('ascii');

    return jwt.verify(token, publicKey) as T;
  } catch (error) {
    return null;
  }
};
