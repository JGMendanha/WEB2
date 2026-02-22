import api from './api';
import { EventInterface } from '../types/events';

export const getEvents = async (): Promise<EventInterface[]> => {
    const response = await api.get('/events');
    return response.data;
};