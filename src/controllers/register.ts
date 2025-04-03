import User from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const register = async (req: Request, res: Response) => {
    try {
        const {firstname, lastname, username, password, age, description, email, phone_number, profile_picture_id, accommodation_id} = req.body;

        if (!firstname || !lastname || !username || !password || !age || !description || !email || !phone_number || !profile_picture_id || !accommodation_id) {
            res.status(400).json({error: "Tous les champs sont requis."});
            return;
        }

        const existEmail = await User.findOne({email});

        if(existEmail){
            res.status(400).json({error: "Cet email est déjà utilisé."});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({firstname, lastname, username, password: hashedPassword, age, description, email, phone_number, profile_picture_id, accommodation_id});

        await newUser.save();

        res.status(201).json({user: newUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Une erreur est survenue lors de la creation du compte."});
    }
}

export default {
    register,
  };