import jwt from 'jsonwebtoken';
import config from 'config';

export const signJwt = (payload, options = {}) => {
    const privateKey = Buffer.from(config.get("accessTokenPrivateKey")).toString('ascii')
    return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: 'RS256',
    });
  };

  export const verifyJwt = (token) => {
    try {
      const publicKey = Buffer.from(
        config.get('accessTokenPublicKey'),
        'base64'
      ).toString('ascii');
      return jwt.verify(token, publicKey);
    } catch (error) {
      return null;
    }
  };