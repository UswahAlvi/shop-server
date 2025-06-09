import { v4 as uuidv4 } from 'uuid';

export const ensureSession = (req, res, next) => {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'Lax',
    });
  }

  req.sessionId = sessionId;
  next();
};
