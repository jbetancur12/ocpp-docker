import AppError from '../helpers/appError';

export const restrictTo =
  (...allowedRoles) =>
  (req, res, next) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError('You are not allowed to perform this action', 403)
      );
    }

    next();
  };

