import { Request, Response } from 'express';
import { generateToken } from '../middlewares/auth.middleware';
import UserModel from '../models/user.model';
import { ResponseObject, TokenPayload } from '../types/type';


/**
 * @param req username
 * @param res 
 * @returns jwt token
 */
export const login = async (req: Request, res: Response): Promise<ResponseObject> => {
    let token!: string;
    try {
        const data: ResponseObject[] = await UserModel.find({ username: 'admin' });
        let adminUser: string | null = null;
        if (data.length != 0)
            adminUser = data[0].username;

        console.log(adminUser);

        const user = { username: req.body.username };
        let payload: TokenPayload;
        if (user.username === adminUser)
            payload = { ...user, role: 'admin' };
        else
            payload = { ...user, role: 'any' };
        // If authentication is successful, generate JWT token
        console.log(123);
        token = generateToken(payload);
        console.log(456);

    } catch (error) {
        console.error('Error updating movie:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).send({ token });
}