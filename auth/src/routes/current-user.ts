import express, { Request, Response } from 'express';
import { currentUser } from '@arconcerttickets/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    // Delegate to currentUser middleware to check if current user is logged in
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
