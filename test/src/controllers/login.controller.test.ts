import { Request, Response } from 'express';
import { login } from '../../../src/controllers/login.controller';
import UserModel from '../../../src/models/user.model';

jest.mock('../../../src/middlewares/auth.middleware', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateToken: jest.fn((payload: any) => `mock-token-${payload.username}-${payload.role}`),
}));

describe('login', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a JWT token for admin user', async () => {
        req = {
            body: {
                username: 'admin',
            },
        };
        // Mock UserModel.find to return an admin user
        jest.spyOn(UserModel, 'find').mockResolvedValueOnce([{ username: 'admin' }]);
        
        await login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ token: 'mock-token-admin-admin' });
    });

    it('should return a JWT token for non-admin user', async () => {
        req = {
            body: {
                username: 'user',
            },
        };
        // Mock UserModel.find to return a non-admin user
        jest.spyOn(UserModel, 'find').mockResolvedValueOnce([]);

        await login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ token: 'mock-token-user-any' });
    });

    it('should return 500 if an error occurs', async () => {
        // Mock UserModel.find to throw an error
        jest.spyOn(UserModel, 'find').mockRejectedValueOnce(new Error('Database error'));

        await login(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});