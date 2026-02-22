import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSales, deleteSale } from '../../services/sales';
import { Sale } from '../../types/sales';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    EM_ABERTO: { label: 'Em Aberto', variant: 'secondary' },
    PAGO: { label: 'Pago', variant: 'default' },
    CANCELADO: { label: 'Cancelado', variant: 'destructive' },
    UTILIZADO: { label: 'Utilizado', variant: 'outline' },
};

export default function ListSales() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            const data = await getSales();
            setSales(data);
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSale(id);
            loadSales();
        } catch (error) {
            console.error('Erro ao excluir venda:', error);
        }
    };

    const formatDateTime = (dateStr: string) => {
        return format(new Date(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    };

    if (loading) {
        return <div className="p-8 text-center">Carregando...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vendas de Ingressos</h1>
                <Button onClick={() => navigate('/sales/cadastro')}>
                    Nova Venda
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Nenhuma venda encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-mono text-xs">
                                        {sale.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        {sale.user?.name || sale.userId.substring(0, 8) + '...'}
                                    </TableCell>
                                    <TableCell>{sale.event?.description || 'Evento não encontrado'}</TableCell>
                                    <TableCell>{formatDateTime(sale.dateTime)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusMap[sale.status]?.variant || 'secondary'}>
                                            {statusMap[sale.status]?.label || sale.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/sales/editar/${sale.id}`)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(sale.id)}>
                                                        Excluir
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}