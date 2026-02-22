import api from './api';
import { Sale, CreateSaleDTO, UpdateSaleDTO } from '../types/sales';

export const getSales = async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    return response.data;
};

export const getSaleById = async (id: string): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
};

export const createSale = async (data: CreateSaleDTO): Promise<Sale> => {
    const response = await api.post('/sales', data);
    return response.data;
};

export const updateSale = async (id: string, data: UpdateSaleDTO): Promise<Sale> => {
    const response = await api.put(`/sales/${id}`, data);
    return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
    await api.delete(`/sales/${id}`);
};