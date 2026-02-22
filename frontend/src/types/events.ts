export type EnumEventType = "PALESTRA" | "SHOW" | "TEATRO" | "CURSO" | "GERAL";

export interface EventInterface {
    id: string;
    description: string;
    type: EnumEventType;
    dateTime: string;
    startingSales: string;
    endingSales: string;
    location: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}

export const EventTypeLabels: Record<EnumEventType, string> = {
    PALESTRA: "Palestra",
    SHOW: "Show",
    TEATRO: "Teatro",
    CURSO: "Curso",
    GERAL: "Geral/não especificado",
};