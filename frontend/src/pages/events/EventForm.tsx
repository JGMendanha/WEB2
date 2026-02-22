import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api.ts";
import { type EnumEventType, EventTypeLabels } from "@/types/events.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

const EventForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Pega o ID da URL se existir
    const isEditing = Boolean(id);
    const [loading, setLoading] = useState(false);

    const eventTypeToId: Record<EnumEventType, number> = {
        PALESTRA: 1, SHOW: 2, TEATRO: 3, CURSO: 4, GERAL: 5
    };

    const [formData, setFormData] = useState({
        description: "",
        type: "GERAL" as EnumEventType,
        dateTime: "",
        startingSales: "",
        endingSales: "",
        price: 0
    });

    // Se estiver editando, busca os dados atuais
    useEffect(() => {
        if (isEditing) {
            api.get(`/sales/events/${id}`).then((response) => {
                const data = response.data;
                // Formata as datas para o padrão do input (remove segundos e milissegundos)
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
            dateTime: formData.dateTime.length === 16 ? `${formData.dateTime}:00` : formData.dateTime,
            startingSales: formData.startingSales.length === 16 ? `${formData.startingSales}:00` : formData.startingSales,
            endingSales: formData.endingSales.length === 16 ? `${formData.endingSales}:00` : formData.endingSales,
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
        <div className="min-h-screen bg-blue-50/30 p-8 flex justify-center items-start">
            <Card className="w-full max-w-2xl bg-white shadow-xl border-none">
                <CardHeader className="bg-blue-600 text-white rounded-t-xl flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-2xl font-bold">
                        {isEditing ? "Editar Evento" : "Novo Evento"}
                    </CardTitle>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-blue-500 hover:text-white">
                        <ChevronLeft className="mr-2" size={20} /> Voltar
                    </Button>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-blue-900 font-semibold">Descrição</Label>
                            <Input
                                id="description"
                                required
                                className="border-blue-100"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-blue-900 font-semibold">Tipo</Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as EnumEventType })}>
                                    <SelectTrigger className="border-blue-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(EventTypeLabels).map(([val, label]) => (
                                            <SelectItem key={val} value={val}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-blue-900 font-semibold">Preço (R$)</Label>
                                <Input
                                    type="number" step="0.01" required
                                    className="border-blue-100"
                                    value={formData.price || ""}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-blue-900 font-semibold">Data/Hora Evento</Label>
                            <Input type="datetime-local" required className="border-blue-100" value={formData.dateTime} onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-blue-50 pt-4">
                            <div className="space-y-2">
                                <Label className="text-slate-500 font-bold text-xs uppercase">Início Vendas</Label>
                                <Input type="datetime-local" required className="border-blue-50" value={formData.startingSales} onChange={(e) => setFormData({ ...formData, startingSales: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-500 font-bold text-xs uppercase">Término Vendas</Label>
                                <Input type="datetime-local" required className="border-blue-50" value={formData.endingSales} onChange={(e) => setFormData({ ...formData, endingSales: e.target.value })} />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> {isEditing ? "Salvar Alterações" : "Cadastrar Evento"}</>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
export default EventForm;