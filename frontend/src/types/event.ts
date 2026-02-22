export type Event = {
    id: string
    description: string
    type: string
    dateTime: string
    startingSales: string
    endingSales: string
    price: number
    createdAt?: string
    updatedAt?: string
}

export type CreateEventDTO = Omit<Event, "id" | "createdAt" | "updatedAt">
export type UpdateEventDTO = Partial<CreateEventDTO>