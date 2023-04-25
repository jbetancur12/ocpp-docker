// import User from '../models/user.model';
// import jwt from 'jsonwebtoken';
// import expressJwt from 'express-jwt';
import config from 'config';
import { createUser, findUser, signToken } from '../services/user.service';
import AppError from '../helpers/appError';

// Exclude this fields from the response
export const excludedFields = ['password', "hashed_password"];

// Cookie options
const accessTokenCookieOptions = {
    expires: new Date(
      Date.now() + config.get('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
  };

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;


export const registerHandler = async (
    req,
    res,
    next
  ) => {
    try {
      const user = await createUser({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      });
  
      res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          status: 'fail',
          message: 'Email already exist',
        });
      }
      next(err);
    }
  };

  export const loginHandler = async (
    req,
    res,
    next
  ) => {
    try {
      // Get the user from the collection
      const user = await findUser({ email: req.body.email });


  
      // Check if user exist and password is correct
      if (
        !user ||
        !(await user.authenticate(req.body.password))
      ) {
        return next(new AppError('Invalid email or password', 401));
      }
  
      // Create an Access Token
      const { accessToken } = await signToken(user);
  
      // Send Access Token in Cookie
      res.cookie('accessToken', accessToken, accessTokenCookieOptions);
      res.cookie('logged_in', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });
  
      // Send Access Token
      res.status(200).json({
        status: 'success',
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  };

// const signin = async (req, res) => {
//   try {
//     let user = await User.findOne({ email: req.body.email });
//     if (!user) return res.status('401').json({ error: 'User not found' });

//     if (!user.authenticate(req.body.password)) {
//       return res
//         .status('401')
//         .send({ error: "Email and password don't match." });
//     }

//     const token = jwt.sign({ _id: user._id }, config.jwtSecret);

//     res.cookie('t', token, { expire: new Date() + 9999 });

//     return res.json({
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     return res.status('401').json({ error: 'Could not sign in' });
//   }
// };

// const signout = (req, res) => {
//   res.clearCookie('t');
//   return res.status('200').json({
//     message: 'signed out',
//   });
// };

// const requireSignin = expressJwt({
//   secret: config.jwtSecret,
//   userProperty: 'auth',
//   algorithms: ['sha1', 'RS256', 'HS256'],
// });

// const hasAuthorization = (req, res, next) => {
//   const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
//   if (!authorized) {
//     return res.status('403').json({
//       error: 'User is not authorized',
//     });
//   }
//   next();
// };

// export default { signin, signout, requireSignin, hasAuthorization };
