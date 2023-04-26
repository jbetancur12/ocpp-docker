import { omit } from 'lodash';
import config from 'config';
import userModel from '../models/user.model';
import { excludedFields } from '../controllers/auth.controller';
import { signJwt } from '../helpers/jwt';
import redisClient from '../helpers/connectRedis';


// CreateUser service
export const createUser = async (input) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Find User by Id
export const findUserById = async (id) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// Find one user by any fields
export const findUser = async (
  query,
  options = {}
) => {
  return await userModel.findOne(query, {}, options).select('+password');
};

// Sign Token
export const signToken = async (user) => {
  // Sign the access token
  const access_token = signJwt(
    { sub: user._id },
    {
      expiresIn: `${config.get('accessTokenExpiresIn')}m`,
    }
  );

  console.log("USER", user)

//   Create a Session
  redisClient.set(user._id, JSON.stringify(user), {
    EX: 15 * 60 * 60
  });

  // Return access token
  return { access_token };
};

