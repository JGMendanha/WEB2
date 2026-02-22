package br.edu.ufop.web.sales.business.services;

import br.edu.ufop.web.sales.business.converters.EventConverter;
import br.edu.ufop.web.sales.controller.dtos.events.CreateEventDTO;
import br.edu.ufop.web.sales.controller.dtos.events.EventDTO;
import br.edu.ufop.web.sales.controller.dtos.events.UpdateEventDTO;
import br.edu.ufop.web.sales.enums.EnumEventType;
import br.edu.ufop.web.sales.infrastructure.entities.EventEntity;
import br.edu.ufop.web.sales.infrastructure.repositories.IEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final IEventRepository eventRepository;

    public List<EventDTO> getAll() {

        List<EventEntity> eventEntityList = eventRepository.findAll();
        return eventEntityList.stream().map(EventConverter::toDTO).toList();
    }

    public EventDTO create(CreateEventDTO createEventDTO) {

        EventEntity eventEntity = EventConverter.toEntity(createEventDTO);
        eventEntity = eventRepository.save(eventEntity);
        return EventConverter.toDTO(eventEntity);
    }

    public Optional<EventEntity> getById(UUID id) {
        return eventRepository.findById(id);
    }

    public EventDTO getByIdDTO(UUID id) {

        EventEntity eventEntity = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        return EventConverter.toDTO(eventEntity);
    }

    public EventDTO update(UUID id, UpdateEventDTO dto) {

        EventEntity eventEntity = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));

        eventEntity.setDescription(dto.getDescription());
        eventEntity.setType(EnumEventType.getById(dto.getType()));
        eventEntity.setDateTime(dto.getDateTime());
        eventEntity.setStartingSales(dto.getStartingSales());
        eventEntity.setEndingSales(dto.getEndingSales());
        eventEntity.setPrice(dto.getPrice());
        eventEntity = eventRepository.save(eventEntity);

        return EventConverter.toDTO(eventEntity);
    }

    public void delete(UUID id) {

        EventEntity eventEntity = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        eventRepository.delete(eventEntity);
    }

}