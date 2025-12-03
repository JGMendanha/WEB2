package br.edu.ufop.web.users.domain.usecase;

import br.edu.ufop.web.users.domain.CCNetworkDomain;
import br.edu.ufop.web.users.domain.UserDomain;
import br.edu.ufop.web.users.domain.port.CCNRepositoryPort;
import br.edu.ufop.web.users.enums.EnumUserType;
import br.edu.ufop.web.users.exception.UseCaseException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CreateUserUseCase {

    @Setter
    private UserDomain userDomain;
    private final CCNRepositoryPort repositoryPort;

    public void validate(){

        //Validações conforme regra de negócio para a criação do usuário
        validateName();

        //Demais validações
        validateCCNetworkId();
        validateEmail();
        validatePassword();
        validateUserType();
    }

    private void validateName(){

        if(this.userDomain.getName() == null){

            throw new UseCaseException("Name is null");
        }
    }

    private void validateCCNetworkId(){

        if(this.userDomain.getCcNetwork() == null){

            throw new UseCaseException("Invalid Credit Crad Network");
        }

        UUID id =  this.userDomain.getCcNetwork().getId();

        if(id == null){

            throw new UseCaseException("Invalid Credit Crad Network ID is null");
        }

        Optional<CCNetworkDomain> domainOptional = repositoryPort.findById(id);

        if(domainOptional.isEmpty()){

            throw new UseCaseException("Invalid Credit Card Network ID does not exist");
        }

        this.userDomain.setCcNetwork(domainOptional.get());
    }

    private void validateEmail(){

        if(this.userDomain.getEmail() == null){

            throw new UseCaseException("Email is null");
        }
    }

    private void validatePassword(){

        if(this.userDomain.getPassword() == null){

            throw new UseCaseException("Password is null");
        }
    }

    private void validateUserType(){

        if(this.userDomain.getType() == null){

            this.userDomain.setType(EnumUserType.CUSTOMER);
        }
    }
}
