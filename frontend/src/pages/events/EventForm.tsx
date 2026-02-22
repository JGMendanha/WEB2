import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api.ts";
import { type EnumEventType, EventTypeLabels } from "@/types/events.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Save, Loader2, CalendarIcon, DollarSign, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(false);

    const eventTypeToId: Record<EnumEventType, number> = {
        PALESTRA: 1,
        SHOW: 2,
        TEATRO: 3,
        CURSO: 4,
        GERAL: 5,
    };

    const [formData, setFormData] = useState({
        description: "",
        type: "GERAL" as EnumEventType,
        dateTime: "",
        startingSales: "",
        endingSales: "",
        price: 0,
    });

    useEffect(() => {
        if (isEditing) {
            api.get(`/sales/events/${id}`).then((response) => {
                const data = response.data;
                setFormData({
                    description: data.description,
                    type: data.type,
                    price: data.price,
                    dateTime: data.dateTime.substring(0, 16),
                    startingSales: data.startingSales.substring(0, 16),
                    endingSales: data.endingSales.substring(0, 16),
                });
            });
        }
    }, [id, isEditing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            description: formData.description,
            type: eventTypeToId[formData.type],
            price: Number(formData.price),
            dateTime:
                formData.dateTime.length === 16
                    ? `${formData.dateTime}:00`
                    : formData.dateTime,
            startingSales:
                formData.startingSales.length === 16
                    ? `${formData.startingSales}:00`
                    : formData.startingSales,
            endingSales:
                formData.endingSales.length === 16
                    ? `${formData.endingSales}:00`
                    : formData.endingSales,
        };

        try {
            if (isEditing) {
                await api.put(`/sales/events/${id}`, payload);
            } else {
                await api.post("/sales/events", payload);
            }
            navigate("/events");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar evento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 flex justify-center items-start">
            <Card className="w-full max-w-3xl border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <CalendarIcon className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-bold">
                                {isEditing ? "Editar Evento" : "Novo Evento"}
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="text-white hover:bg-white/20 hover:text-white transition-all duration-200"
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" /> Voltar
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Descrição */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Tag className="h-4 w-4 text-blue-500" />
                                Descrição do evento
                            </Label>
                            <Input
                                id="description"
                                required
                                placeholder="Ex: Workshop de React, Show da Banda X..."
                                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 transition-all"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Tipo e Preço */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    Tipo de evento
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, type: value as EnumEventType })
                                    }
                                >
                                    <SelectTrigger className="border-slate-200 focus:ring-blue-400">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(EventTypeLabels).map(([val, label]) => (
                                            <SelectItem key={val} value={val}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-blue-500" />
                                    Preço (R$)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="pl-10 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                        value={formData.price || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: parseFloat(e.target.value) })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Data/Hora do Evento */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-blue-500" />
                                Data e hora do evento
                            </Label>
                            <Input
                                type="datetime-local"
                                required
                                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                value={formData.dateTime}
                                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                            />
                        </div>

                        {/* Período de vendas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-bold text-slate-500">
                                    Início das vendas
                                </Label>
                                <Input
                                    type="datetime-local"
                                    required
                                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                    value={formData.startingSales}
                                    onChange={(e) =>
                                        setFormData({ ...formData, startingSales: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-bold text-slate-500">
                                    Término das vendas
                                </Label>
                                <Input
                                    type="datetime-local"
                                    required
                                    className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                                    value={formData.endingSales}
                                    onChange={(e) =>
                                        setFormData({ ...formData, endingSales: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        {/* Botão de submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {isEditing ? "Salvando alterações..." : "Cadastrando..."}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    {isEditing ? "Salvar Alterações" : "Cadastrar Evento"}
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventForm;