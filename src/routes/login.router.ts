import express from 'express';
import { generateToken } from '../middlewares/auth.middleware';
import UserModel from '../models/user.model';

const router = express.Router();

// Route for user login
router.post('/login', async (req: any, res: any) => {
    // Perform user authentication (e.g., validate username and password)
    const data = await UserModel.find({ username: 'admin' });
    let adminUser: string | null = null;
    if (data.length != 0)
        adminUser = data[0].username;

    console.log(adminUser);

    const user = { username: req.body.username };
    let payload;
    if (user.username === adminUser)
        payload = { ...user, role: 'admin' };
    else 
        payload = {...user, role: 'any'};
    // If authentication is successful, generate JWT token
    const token = generateToken(payload);

    // Return the token in the response
    res.json({ token });
});

export default router;