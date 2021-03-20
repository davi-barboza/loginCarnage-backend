import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from 'yup';
import { AppError } from "../../errors/AppError";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.json';

class AuthController 
{

    async authenticate(request: Request, response: Response){
        const {email,password } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);

        const user = await usersRepository.findOne({
            email
        });

        if (!user) {
            return response.sendStatus(401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return response.sendStatus(401);
        }

        user.password = undefined;

        const generateToken = function generateToken(params = {}) {
            return jwt.sign(params, authConfig.secret, {
                expiresIn: 86400,
            });
        }

        return response.json({
            user,
            token: generateToken({ id: user.id }),
        });
    }
}

export { AuthController };
