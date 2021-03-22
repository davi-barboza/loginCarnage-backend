import { Request, Response } from "express";
import { getConnection, getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.json';
import crypto from 'crypto';
import { resolve } from 'path';
import sendMailService from '../../services/SendMailService'
import { User } from "../models/User";
import * as yup from 'yup';
import { AppError } from "../../errors/AppError";


class AuthController {

    async authenticate(request: Request, response: Response) {
        const { email, password } = request.body;

        const schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required()
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            throw new AppError("E-mail already exists");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new AppError("Invalid Password");
        }

        user.password = undefined;

        const generateToken = function generateToken(params = {}) {
            return jwt.sign(params, authConfig.secret, {
                expiresIn: 86400,
            });
        }

        return response.status(200).json({
            user,
            token: generateToken({ id: user.id }),
        });
    }

    async forgotPassword(request: Request, response: Response) {
        const { email } = request.body;

        const schema = yup.object().shape({
            email: yup.string().email().required(),
        });

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        try {
            const user = await usersRepository.findOne({ email });

            if (!user) {
                throw new AppError("User not found");
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({ password_reset_token: token, password_reset_experies: now })
                .where("id = :id", { id: user.id })
                .execute();

            const npsPath = resolve(__dirname, "..", "..", "views", "emails", "npsMail.hbs");

            const variables = {
                token: token,
            }

            await sendMailService.execute(email, variables, npsPath)

            return response.send();

        } catch (error) {
            // response.status(400).send({ error: 'Error on forgot password, try again' });
            throw new AppError("Error on forgot password, try again");
        }
    }
    
    async resetPassword(request: Request, response: Response) {
        const { email, token, password } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        
        try {
            const user = await usersRepository.findOne({ email });

            if (!user) {
                return response.status(400).send({ error: 'User not found' });
            }

            if (token !== user.password_reset_token) {
                return response.status(400).send({ error: 'Token invalid' });
            }

            const now = new Date();

            if (now > user.password_reset_experies) {
                return response.status(400).send({ error: 'Token expired, generate a new one' });
            }

            user.password = password;
         
            await usersRepository.save(user);

            response.send();

        } catch (err) {
            response.status(400).send({ error: 'Cannot reset password, try again' });
        }
    }
}

export { AuthController };
