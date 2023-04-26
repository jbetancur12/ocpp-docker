import jwt from 'jsonwebtoken';
import config from 'config';

export const signJwt = (payload, options = {}) => {
    // const privateKey = Buffer.from(config.get("accessTokenPrivateKey")).toString('ascii')
    const privateKey = config.get("jwtSecret")
    return jwt.sign(payload, privateKey, {
      ...(options && options)
    });
  };

  export const verifyJwt = (token) => {
    try {
    //   const publicKey = Buffer.from(
    //     config.get('accessTokenPublicKey'),
    //     'base64'
    //   ).toString('ascii');
      const publicKey = config.get("jwtSecret")
      return jwt.verify(token, publicKey);
    } catch (error) {
      return null;
    }
  };