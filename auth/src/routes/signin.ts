import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from "@reach2/sgticketscommon";
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must enter a password')
    ], 
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({email});
        if(!existingUser) {
            throw new BadRequestError('Invalid credentials')
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);
        if(!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        // Generate JWT
        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, 
            process.env.JWT_KEY!
        );

        // Store JWT on session object
        req.session = {
            jwt: userJWT
        };

        res.status(200).send(existingUser);
    }
);

export { router as signInRouter };