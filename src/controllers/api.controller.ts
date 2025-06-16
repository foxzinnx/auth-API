import { Request, Response } from "express";
import * as userService from '../services/UserService';
import { generateToken } from "../config/passport";
import { UserInstance } from "../models/User";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({ error: 'É obrigatório inserir um email e uma senha!'});
        return;
    }

    if(!isValidEmail(email)){
        res.status(400).json({ error: 'Formato de email inválido!' });
        return;
    }

    try {
        const newUser = await userService.registerUser(email, password);

        if(newUser instanceof Error){
            res.status(400).json({ error: newUser.message });
            return;
        }

        const user = newUser  as UserInstance;

        const token = generateToken({ id: user.id, email: user.email});
        res.status(201).json({ message: 'Conta criada com sucesso!', token});
        return;
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao criar a conta.'});
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({ error: 'É obrigatório inserir um email e uma senha!'});
        return;
    }

    try {
        const user = await userService.findByEmail(email);

        if(user && userService.matchPassword(password, user.password)){
            const token = generateToken({ id: user.id, email: user.email });
            res.json({ message: 'Logado com sucesso!', token});
            return;
        }

        res.status(401).json({ error: 'Email ou senha incorretos.'});
    } catch (error) {
        console.error('Erro ao entrar na conta:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao acessar a conta.'});
    }
}

export const users = async (req: Request, res: Response) => {
    try {
        let users = await userService.all();
        const list = users.map((user) => user.email);
        res.json({success: true, data: {list}});
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ success: false, error: "Ocorreu um erro ao listar os usuários." });
    }
}