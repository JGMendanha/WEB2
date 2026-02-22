import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api.ts";
import { type EventInterface, EventTypeLabels } from "@/types/events.ts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Tag, Pencil, Trash2 } from "lucide-react";
import { type AxiosResponse, AxiosError } from "axios";

const ListEvents = () => {
    const [events, setEvents] = useState<EventInterface[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get<EventInterface[]>("/sales/events")
            .then((response: AxiosResponse<EventInterface[]>) => {
                setEvents(response.data);
            })
            .catch((error: AxiosError) => {
                console.error("Erro ao buscar eventos:", error.message);
            });
    }, []);

    const handleDeleteEvent = async (id: string) => {
        const confirmed = window.confirm("Tem certeza que deseja excluir este evento?");
        if (!confirmed) return;

        setDeletingId(id);

        try {
            await api.delete(`/sales/events/${id}`);

            // remove da lista sem recarregar
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));

        } catch (error) {
            const err = error as AxiosError;
            console.error("Erro ao deletar evento:", err.message);
            alert("Não foi possível excluir o evento.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50/30 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-blue-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900">Gerenciador de eventos</h1>
                        <p className="text-blue-600">Gerencie e visualize as vendas dos seus eventos</p>
                    </div>
                    <Button
                        onClick={() => navigate("/events/cadastro")}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        <PlusCircle size={20} />
                        Cadastrar Evento
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Card key={event.id} className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                            <CardHeader className="bg-blue-600 text-white rounded-t-xl">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{event.description}</CardTitle>
                                    <span className="bg-blue-400/30 text-[10px] px-2 py-1 rounded uppercase font-bold">
                                        {EventTypeLabels[event.type]}
                                    </span>
                                </div>
                                <CardDescription className="text-blue-100">
                                    ID: {event.id.substring(0, 8)}...
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center text-slate-600 gap-3">
                                    <Calendar className="text-blue-500" size={18} />
                                    <span>{new Date(event.dateTime).toLocaleString('pt-BR')}</span>
                                </div>

                                <div className="flex items-center text-slate-600 gap-3">
                                    <Tag className="text-blue-500" size={18} />
                                    <span className="font-semibold text-lg">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.price)}
                                    </span>
                                </div>

                                <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                                    Vendas: {new Date(event.startingSales).toLocaleDateString()} até {new Date(event.endingSales).toLocaleDateString()}
                                </div>
                            </CardContent>

                            <CardFooter className="border-t border-slate-50 pt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                    Ver Detalhes
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => navigate(`/events/editar/${event.id}`)}
                                    title="Editar evento"
                                >
                                    <Pencil size={18} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteEvent(event.id)}
                                    disabled={deletingId === event.id}
                                    title="Excluir evento"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-inner border-2 border-dashed border-blue-100">
                        <p className="text-blue-400">Nenhum evento cadastrado no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListEvents;