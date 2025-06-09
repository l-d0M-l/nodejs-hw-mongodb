import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const registerUser = async (payload) => {
  console.log(payload);

  //check if the user is already there
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email is already registered'); //409 error
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  console.log(`user ${user}`);

  return User.create(payload);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  // console.log(`user found ${user}`);

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is invalid'); //401 error
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch === false) {
    throw new createHttpError.Unauthorized('Email or password is invalid'); //401 error
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findOne({ _id: sessionId });

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found'); //401 error
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid'); //401 error
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired'); //401 erroe
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
