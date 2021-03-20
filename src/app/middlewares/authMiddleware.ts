import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth.json';

interface TokenPayload{
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction)
{
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({error: 'No token provided'});
  }

  const token = authorization.replace('Bearer', '').trim(); 

  try {
    const data = jwt.verify(token, authConfig.secret);
    
    const { id } = data as TokenPayload;

    req.userId = id;

    return next();
  } catch {
    
    return res.sendStatus(401);   
  }
}