import express, { Request, Response, request } from 'express';
import { requireAuth } from '@arconcerttickets/common';

const router = express.Router();

/**
 * Route handler to create new ticket
 */
router.post('/api/tickets', requireAuth, (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
