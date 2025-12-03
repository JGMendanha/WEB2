package br.edu.ufop.web.users.converter;

import br.edu.ufop.web.users.domain.CCNetworkDomain;
import br.edu.ufop.web.users.domain.UserDomain;
import br.edu.ufop.web.users.dto.CreateUserDTO;
import br.edu.ufop.web.users.dto.UserDTO;
import br.edu.ufop.web.users.entity.UserEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserConverter {

    //DTO de criação para o Domínio
    public static UserDomain toUserDomain(CreateUserDTO createUserDTO) {

        CCNetworkDomain ccNetworkDomain = CCNetworkDomain.builder().id(createUserDTO.creditCardNetworkId()).build();

        return UserDomain.builder().name(createUserDTO.name()).email(createUserDTO.email()).password(createUserDTO.password())
                .city(createUserDTO.city()).ccNetwork(ccNetworkDomain).build();
    }

    //Demais DTO's para o Domínio

    // Domínio para entidade JPA
    public static UserEntity toUserEntity(UserDomain userDomain) {

        return UserEntity.builder().id(userDomain.getId()).name(userDomain.getName()).email(userDomain.getEmail())
                .password(userDomain.getPassword()).city(userDomain.getCity()).creditCardNumber(userDomain.getCreditCardNumber())
                .type(userDomain.getType()).ccNetwork(CCNetworkConverter.toEntity(userDomain.getCcNetwork())).build();
    }

    //Entidade JPA para o Domínio
    public static UserDomain toDomain(UserEntity userEntity) {

        return UserDomain.builder().id(userEntity.getId()).name(userEntity.getName()).email(userEntity.getEmail())
                .password(userEntity.getPassword()).city(userEntity.getCity()).creditCardNumber(userEntity.getCreditCardNumber())
                .type(userEntity.getType()).ccNetwork(CCNetworkConverter.toDomain(userEntity.getCcNetwork())).build();
    }

    //Entidade para o DTO de saída
    public static UserDTO toUserDTO(UserEntity userEntity) {

        UserDomain userDomain = toDomain(userEntity);
        return new UserDTO(userEntity.getId(), userEntity.getName(), userEntity.getEmail());
    }

    public static UserDTO toUserDTO(UserDomain userDomain) {

        return new UserDTO(userDomain.getId(), userDomain.getName(), userDomain.getEmail());
    }
}
