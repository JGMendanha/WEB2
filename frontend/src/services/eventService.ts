import { api } from "./api"
import { Event, CreateEventDTO, UpdateEventDTO } from "@/types/event"

export const getEvents = async (): Promise<Event[]> => {
    const { data } = await api.get("/events")
    return data
}

export const getEventById = async (id: string): Promise<Event> => {
    const { data } = await api.get(`/events/${id}`)
    return data
}

export const createEvent = async (event: CreateEventDTO): Promise<Event> => {
    const { data } = await api.post("/events", event)
    return data
}

export const updateEvent = async (id: string, event: UpdateEventDTO): Promise<Event> => {
    const { data } = await api.put(`/events/${id}`, event)
    return data
}

export const deleteEvent = async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`)
}