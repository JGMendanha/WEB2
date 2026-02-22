import api from './api';
import { User } from '../types/users';

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
};