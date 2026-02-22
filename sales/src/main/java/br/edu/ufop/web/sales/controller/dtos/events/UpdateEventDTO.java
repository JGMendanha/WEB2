package br.edu.ufop.web.sales.controller.dtos.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEventDTO {

    private String description;
    private Integer type;
    private LocalDateTime dateTime;
    private LocalDateTime startingSales;
    private LocalDateTime endingSales;
    private String location;
    private Float price;
}