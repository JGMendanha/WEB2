import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createEvent } from "@/services/eventService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toApiDate } from "@/lib/dateAdapter"

export default function EventCreate() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        description: "",
        type: "",
        dateTime: "",
        startingSales: "",
        endingSales: "",
        price: 0
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()

        await createEvent({
            ...form,
            dateTime: toApiDate(form.dateTime)!,
            startingSales: toApiDate(form.startingSales)!,
            endingSales: toApiDate(form.endingSales)!,
            price: Number(form.price)
        })

        navigate("/")
    }

    return (
        <div className="p-8 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Criar Evento</h1>

            <form onSubmit={submit} className="space-y-3">
                <Input name="description" placeholder="Descrição" onChange={handleChange} required />

                <Input name="type" placeholder="Tipo do evento" onChange={handleChange} required />

                <div>
                    <label className="text-sm">Data do Evento</label>
                    <Input name="dateTime" type="datetime-local" onChange={handleChange} required />
                </div>

                <div>
                    <label className="text-sm">Início das vendas</label>
                    <Input name="startingSales" type="datetime-local" onChange={handleChange} required />
                </div>

                <div>
                    <label className="text-sm">Fim das vendas</label>
                    <Input name="endingSales" type="datetime-local" onChange={handleChange} required />
                </div>

                <Input name="price" type="number" step="0.01" placeholder="Preço" onChange={handleChange} required />

                <div className="flex gap-2">
                    <Button type="submit">Salvar</Button>
                    <Button type="button" variant="secondary" onClick={() => navigate("/")}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    )
}