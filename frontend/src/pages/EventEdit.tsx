import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from "../services/eventService";

export const EventEdit = () => {
    const { id } = useParams();
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) eventService.getById(id).then(res => setDescription(res.data.description));
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            await eventService.update(id, { description });
            navigate('/');
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            <h2>Editar Evento</h2>
            <input value={description} onChange={e => setDescription(e.target.value)} />
            <button type="submit">Atualizar</button>
        </form>
    );
};