import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mongoose from 'mongoose';


const getAllUsers = async (req: Request, res: Response) => {
    try {

        const users = await User.find();  
        res.json({ users });

    } catch (error) {

        res.status(500).json({error: "Une erreur est survenue."});

    }
};  


const updateUser = async (req: Request, res: Response) => {
    try {

        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({message: "L'ID fourni n'est pas valide."});
            return;
        }

        const {firstname: first_name, lastname: last_name, username, password, age, description, email, phone_number, profile_picture_id, accommodation_id} = req.body;  

        if (!first_name || !last_name || !username || !password || !age || !description || !email || !phone_number || !profile_picture_id || !accommodation_id) {
            res.status(400).json({error: "Tous les champs sont requis."});
            return;
        }

        let findUser = await User.findById(id);

        if(!findUser){
            res.status(404).json({message: "L'utilisateur n'existe pas."});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        findUser.firstname = first_name;
        findUser.lastname = last_name;
        findUser.username = username;
        findUser.password = hashedPassword;
        findUser.age = age;
        findUser.description = description;
        findUser.email = email;
        findUser.phone_number = phone_number;
        findUser.profile_picture_id = profile_picture_id;
        findUser.accommodation_id = accommodation_id;

        await findUser.save();
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Une erreur est survenue pendant la modification de l'utilisateur."});
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "L'ID fourni n'est pas valide." });
            return;
        }

        const user = await User.findById(id);

        if(!user){
            res.status(404).json({message: "L'utilisateur n'existe pas."});
            return;
        }

        res.status(200).json(user);
        return;

     } catch (error) {
        res.status(500).json({error: "Une erreur est survenue."});
     }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "L'ID fourni n'est pas valide." });
            return;
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({message: "L'utilisateur a bien été supprimé."});
        return;

    } catch (error) {
        res.status(500).json({error: "Une erreur est survenue pendant la suppression de l'utilisateur."});
    }
}

export default {
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
  };
  