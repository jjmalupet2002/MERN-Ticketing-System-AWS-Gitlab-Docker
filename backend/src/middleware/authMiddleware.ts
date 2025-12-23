import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
    user?: IUser;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

            req.user = await User.findById(decoded.id).select('-password') as IUser;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Agent middleware - allows both agents and admins
const agent = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && (req.user.role === 'agent' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an agent' });
    }
};

export { protect, admin, agent, AuthRequest };
