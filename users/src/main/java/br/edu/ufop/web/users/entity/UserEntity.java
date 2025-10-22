package br.edu.ufop.web.users.entity;

import br.edu.ufop.web.users.enums.EnumUserType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tb_users")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;
    private String email;
    private String password;
    private String city;

    private String creditCardNumber;

    // Credit card network
    @ManyToOne
    @JoinColumn(name = "credit_card_network_id")
    private CCNetworkEntity ccNetwork;

    private EnumUserType userType;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean active;

    @PrePersist
    public void beforeSave(){

        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.active = true;
    }

    @PreUpdate
    public void beforeUpdate(){
        this.updatedAt = LocalDateTime.now();
    }
}
