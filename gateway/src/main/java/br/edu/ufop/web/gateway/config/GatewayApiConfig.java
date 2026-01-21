package br.edu.ufop.web.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.PredicateSpec;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayApiConfig {

    @Value("${gateway.frontend.uri}")
    private String frontEndUri;

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder builder) {

        return builder.routes()
                .route("user-api", pred -> pred.path("/api/users/**")
                        .filters(filter -> filter.rewritePath("/api/users", "/users"))
                            .uri("lb://users-service"))
                .route("users",  pred -> pred.path("/users/**").uri("lb://users-service"))
                .route("sales",  pred -> pred.path("/sales/**").uri("lb://sales-service"))
                .route("frontend",  pred -> pred.path("/**").uri(getFrontEndUri()))
                .build();
    }

    private String getFrontEndUri() {

        final String FRONTEND_DEFAULT = "http://localhost:1234";

        if(this.frontEndUri != null) {

            return this.frontEndUri;
        }

        return FRONTEND_DEFAULT;
    }
}
