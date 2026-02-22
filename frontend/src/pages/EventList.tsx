import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getEvents, deleteEvent } from "@/services/eventService"
import { Event } from "@/types/event"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EventList() {
    const [events, setEvents] = useState<Event[]>([])
    const navigate = useNavigate()

    const load = async () => {
        const data = await getEvents()
        setEvents(data)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Deseja remover o evento?")) {
            await deleteEvent(id)
            void load()
        }
    }

    useEffect(() => { void load() }, [])

    return (
        <div className="p-8 space-y-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Eventos</h1>
                <Button onClick={() => navigate("/events/new")}>Novo Evento</Button>
            </div>

            {events.map(e => (
                <Card key={e.id}>
                    <CardContent className="flex justify-between items-center p-4">
                        <div>
                            <p className="font-semibold">{e.description}</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(e.dateTime).toLocaleString()}
                            </p>
                            <p>R$ {e.price}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => navigate(`/events/edit/${e.id}`)}>
                                Editar
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(e.id)}>
                                Deletar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}