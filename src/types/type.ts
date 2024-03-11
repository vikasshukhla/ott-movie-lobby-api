/* eslint-disable @typescript-eslint/no-explicit-any */
export type ResponseObject = {
    [key: string]: any;
}

export type TokenPayload = {
    username: string;
    role: string;
}

export type Token = {
    token: string
}