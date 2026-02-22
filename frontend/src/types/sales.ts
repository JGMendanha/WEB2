import { EventInterface } from './events';
import { User } from './users';

export type SaleStatus = 'EM_ABERTO' | 'PAGO' | 'CANCELADO' | 'UTILIZADO';

export interface Sale {
    id: string;
    userId: string;
    user?: User;
    eventId: string;
    event: EventInterface;
    dateTime: string;
    status: SaleStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSaleDTO {
    userId: string;
    eventId: string;
}

export interface UpdateSaleDTO {
    status: SaleStatus;
}