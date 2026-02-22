import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ListEvents from "@/pages/events/ListEvents.tsx";
import EventForm from "@/pages/events/EventForm.tsx";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/events" element={<ListEvents />} />
                <Route path="/events/cadastro" element={<EventForm />} />
                <Route path="/" element={<Navigate to="/events" replace />} />
                <Route path="/events/editar/:id" element={<EventForm />} />
            </Routes>
        </BrowserRouter>
    );
};