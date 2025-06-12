import createHttpError from 'http-errors';

import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  requestResetPassword,
  resetPassword,
} from '../services/auth.js';

export const registerController = async (req, resp) => {
  //   console.log(req.body);
  const data = await registerUser(req.body);

  resp.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const loginController = async (req, resp) => {
  //   console.log(req.body);
  const session = await loginUser(req.body);

  resp.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  resp.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  resp.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
  resp.end();
};

export const refreshController = async (req, resp) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  resp.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  resp.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  resp.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, resp) => {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  resp.clearCookie('sessionId');
  resp.clearCookie('refreshToken');

  resp.status(204).end();
};

export const requestResetPasswordController = async (req, resp) => {
  const { email } = req.body;
  // console.log(email);

  await requestResetPassword(email);

  resp.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, resp) => {
  const { password, token } = req.body;
  resetPassword(password, token);
  resp.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
