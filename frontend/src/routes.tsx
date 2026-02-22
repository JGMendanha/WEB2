import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListEvents from "@/pages/events/ListEvents";
import EventForm from "@/pages/events/EventForm";
import ListSales from "@/pages/sales/ListSales";
import SaleForm from "@/pages/sales/SaleForm";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/events" element={<ListEvents />} />
                <Route path="/events/cadastro" element={<EventForm />} />
                <Route path="/events/editar/:id" element={<EventForm />} />

                <Route path="/sales" element={<ListSales />} />
                <Route path="/sales/cadastro" element={<SaleForm />} />
                <Route path="/sales/editar/:id" element={<SaleForm />} />

                <Route path="/" element={<Navigate to="/sales" replace />} />
            </Routes>
        </BrowserRouter>
    );
};