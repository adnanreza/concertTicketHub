import express, { Request, Response, request } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@arconcerttickets/common';

const router = express.Router();

/**
 * Route handler to create new ticket
 */
router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
