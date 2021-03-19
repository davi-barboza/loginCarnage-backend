import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from 'yup';
import { AppError } from "../errors/AppError";

class UserController 
{
    async create(request: Request, response: Response){
        const {email,password } = request.body;

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

        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if (userAlreadyExists) {
            throw new AppError("E-mail já cadastrado");
        }

        const user = usersRepository.create({
            email, password
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }

    async show(request: Request, response: Response){
        const usersRepository = getCustomRepository(UsersRepository);

        const all = await usersRepository.find();

        return response.json(all);
    }
}

export { UserController };
