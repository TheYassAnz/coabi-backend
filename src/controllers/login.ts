import jwt from 'jsonwebtoken';
import {  NextFunction, Request, Response } from 'express';
import  User  from '../models/user';
import bcrypt from 'bcryptjs';

const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({error: "Tous les champs sont requis."});
            return;
        }

        const user = await User.findOne({username});

        if (!user) {
            res.status(404).json({error: "Il n'y a pas d'utilisateur avec ce nom."});
            return;
        };
        

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({error: "Mot de passe incorrect."});
            return;
        };

        const secretKey = process.env.SECRET_KEY || "zDZEKIOazirnaz";
        const token = jwt.sign({id: user._id}, secretKey, {expiresIn: '1h'});
        res.status(200).json({token});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Une erreur est survenue lors du login."});
    }
        
}

export default {
    login,
  };