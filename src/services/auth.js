import path from 'node:path';
import * as fs from 'node:fs';
import crypto from 'node:crypto';

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8',
);

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
    throw new createHttpError.Unauthorized('Refresh token is expired'); //401 error
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

export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });
  console.log(user);

  if (user === null) {
    throw new createHttpError.NotFound('User not found'); //404 error
  }

  const token = jwt.sign(
    {
      sub: user._id,
      name: user.name,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

  try {
    await sendMail(
      user.email,
      'Reset password',
      template({
        link: `http://localhost:3000/auth/reset-pwd/?token=${token}`,
      }),
    );
  } catch (error) {
    console.error('Email sending error:', error);
    throw new createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw new createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is expired or invalid.');
    }
    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired or invalid.');
    }
    throw error;
  }
};
