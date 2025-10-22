package br.edu.ufop.web.users.domain;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CCNetworkDomain {

    private UUID id;
    private String name;
}
