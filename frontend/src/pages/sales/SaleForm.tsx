import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getSaleById, createSale, updateSale } from '../../services/sales';
import { getEvents } from '../../services/events';
import { getUsers } from '../../services/users';
import { EventInterface } from '../../types/events';
import { User } from '../../types/users';
import { SaleStatus } from '../../types/sales';
import { Button } from '../../components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

const createSchema = z.object({
    userId: z.string().uuid('Selecione um usuário'),
    eventId: z.string().uuid('Selecione um evento'),
});

const updateSchema = z.object({
    status: z.enum(['EM_ABERTO', 'PAGO', 'CANCELADO', 'UTILIZADO'] as const),
});

type CreateFormValues = z.infer<typeof createSchema>;
type UpdateFormValues = z.infer<typeof updateSchema>;

const statusOptions: { value: SaleStatus; label: string }[] = [
    { value: 'EM_ABERTO', label: 'Em Aberto' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'UTILIZADO', label: 'Utilizado' },
];

export default function SaleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<EventInterface[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [saleData, setSaleData] = useState<{ userId: string; eventId: string; status: SaleStatus } | null>(null);

    const isEditing = !!id;

    const form = useForm<CreateFormValues | UpdateFormValues>({
        resolver: zodResolver(isEditing ? updateSchema : createSchema),
        defaultValues: isEditing ? { status: 'EM_ABERTO' } : { userId: '', eventId: '' },
    });

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [eventsData, usersData] = await Promise.all([getEvents(), getUsers()]);
                setEvents(eventsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
                toast.error('Erro ao carregar dados para o formulário');
            }
        };
        loadOptions();
    }, []);

    useEffect(() => {
        if (isEditing) {
            const loadSale = async () => {
                try {
                    setLoading(true);
                    const sale = await getSaleById(id!);
                    setSaleData({
                        userId: sale.userId,
                        eventId: sale.event.id,
                        status: sale.status,
                    });
                    form.setValue('status', sale.status);
                } catch (error) {
                    console.error('Erro ao carregar venda:', error);
                    toast.error('Erro ao carregar dados da venda');
                    navigate('/sales');
                } finally {
                    setLoading(false);
                }
            };
            loadSale();
        }
    }, [isEditing, id, form, navigate]);

    const onSubmit = async (data: CreateFormValues | UpdateFormValues) => {
        try {
            setLoading(true);
            if (isEditing) {
                await updateSale(id!, { status: (data as UpdateFormValues).status });
                toast.success('Status da venda atualizado com sucesso!');
            } else {
                await createSale(data as CreateFormValues);
                toast.success('Venda criada com sucesso!');
            }
            navigate('/sales');
        } catch (error) {
            console.error('Erro ao salvar venda:', error);
            toast.error('Erro ao salvar venda');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Alterar Status da Venda' : 'Nova Venda de Ingresso'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isEditing && saleData && (
                        <div className="mb-6 p-4 bg-muted rounded-lg space-y-2">
                            <p><strong>Usuário:</strong> {users.find(u => u.id === saleData.userId)?.name || saleData.userId}</p>
                            <p><strong>Evento:</strong> {events.find(e => e.id === saleData.eventId)?.description || saleData.eventId}</p>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {!isEditing ? (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="userId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Usuário</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione um usuário" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {users.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="eventId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Evento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione um evento" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {events.map((event) => (
                                                            <SelectItem key={event.id} value={event.id}>
                                                                {event.description}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {statusOptions.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <div className="flex gap-4 justify-end">
                                <Button type="button" variant="outline" onClick={() => navigate('/sales')}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Salvando...' : (isEditing ? 'Atualizar Status' : 'Cadastrar Venda')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}