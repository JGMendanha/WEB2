import { BrowserRouter, Routes, Route } from "react-router-dom"
import EventList from "@/pages/EventList"
import EventCreate from "@/pages/EventCreate"
import EventEdit from "@/pages/EventEdit"

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EventList />} />
                <Route path="/events/new" element={<EventCreate />} />
                <Route path="/events/edit/:id" element={<EventEdit />} />
            </Routes>
        </BrowserRouter>
    )
}