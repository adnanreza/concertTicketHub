import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('Handle error as reqvalidationerror');
  }
  if (err instanceof DatabaseConnectionError) {
    console.log('Handling error as dbconnectionerror');
  }

  res.status(400).send({
    message: err.message,
  });
};
