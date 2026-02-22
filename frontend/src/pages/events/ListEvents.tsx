import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api.ts";
import { type EventInterface, EventTypeLabels } from "@/types/events.ts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Tag, Pencil, Trash2, MapPin, Clock } from "lucide-react";
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
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== id));
        } catch (error) {
            const err = error as AxiosError;
            console.error("Erro ao deletar evento:", err.message);
            alert("Não foi possível excluir o evento.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isSalesActive = (event: EventInterface) => {
        const now = new Date();
        const start = new Date(event.startingSales);
        const end = new Date(event.endingSales);
        return now >= start && now <= end;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            🎫 Gerenciador de eventos
                        </h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                            Gerencie e visualize todos os seus eventos em um só lugar
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/events/cadastro")}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-5 text-lg rounded-xl"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Novo Evento
                    </Button>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-blue-200 shadow-inner">
                        <div className="flex flex-col items-center gap-4">
                            <Calendar className="h-16 w-16 text-blue-300" />
                            <p className="text-2xl font-medium text-slate-400">Nenhum evento cadastrado</p>
                            <p className="text-slate-400">Comece criando seu primeiro evento!</p>
                            <Button
                                onClick={() => navigate("/events/cadastro")}
                                variant="outline"
                                className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Cadastrar Evento
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => {
                            const active = isSalesActive(event);
                            return (
                                <Card
                                    key={event.id}
                                    className="group relative border-none bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl"
                                >
                                    <div className={`absolute top-0 left-0 w-2 h-full ${active ? 'bg-green-500' : 'bg-slate-300'}`} />

                                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold line-clamp-1">
                                                    {event.description}
                                                </CardTitle>
                                                <CardDescription className="text-blue-100 mt-1 flex items-center gap-1 text-sm">
                                                    <span className="w-1 h-1 bg-blue-300 rounded-full" />
                                                    ID: {event.id.substring(0, 8)}...
                                                </CardDescription>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg ${
                                                active
                                                    ? 'bg-green-400 text-green-900'
                                                    : 'bg-slate-400 text-slate-900'
                                            }`}>
                                                {EventTypeLabels[event.type]}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-6 space-y-4">
                                        <div className="flex items-start gap-3 text-slate-600">
                                            <Calendar className="text-blue-500 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    Data do evento
                                                </p>
                                                <p className="font-medium">{formatDateTime(event.dateTime)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600">
                                            <Tag className="text-blue-500 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    Preço
                                                </p>
                                                <p className="font-bold text-2xl text-blue-600">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(event.price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Período de vendas */}
                                        <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                <Clock size={14} />
                                                Período de vendas
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-slate-500">Início</p>
                                                    <p className="font-medium text-slate-700">
                                                        {new Date(event.startingSales).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-slate-500">Término</p>
                                                    <p className="font-medium text-slate-700">
                                                        {new Date(event.endingSales).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            {active && (
                                                <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-semibold">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                    Vendas abertas
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="border-t border-slate-100 pt-4 flex gap-2 bg-white/50 backdrop-blur-sm">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        >
                                            Ver Detalhes
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-full"
                                            onClick={() => navigate(`/events/editar/${event.id}`)}
                                            title="Editar evento"
                                        >
                                            <Pencil size={18} />
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full"
                                            onClick={() => handleDeleteEvent(event.id)}
                                            disabled={deletingId === event.id}
                                            title="Excluir evento"
                                        >
                                            {deletingId === event.id ? (
                                                <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListEvents;