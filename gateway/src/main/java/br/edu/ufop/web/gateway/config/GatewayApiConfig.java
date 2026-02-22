package br.edu.ufop.web.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class GatewayApiConfig {

    @Value("${gateway.frontend.uri:http://localhost:5173}")
    private String frontEndUri;

    @Bean
    public RouteLocator gatewayRouter(RouteLocatorBuilder builder) {
        return builder.routes()
                // Rota de Usuários: aceita /api/users/** ou /users/**
                .route("users-service", pred -> pred.path("/api/users/**", "/users/**")
                        .filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/users/${segment}")
                                .rewritePath("/users/(?<segment>.*)", "/users/${segment}"))
                        .uri("lb://users-service"))

                // Rota de Vendas (Sales): aceita /api/sales/** ou /sales/**
                .route("sales-service", pred -> pred.path("/api/sales/**", "/sales/**")
                        .filters(f -> f.rewritePath("/api/sales/(?<segment>.*)", "/${segment}")
                                .rewritePath("/sales/(?<segment>.*)", "/${segment}"))
                        .uri("lb://sales-service"))

                // Rota para o Frontend: Qualquer outra coisa (/**)
                .route("frontend", pred -> pred.path("/**")
                        .uri(frontEndUri))
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        // Permite a origem do seu Frontend React (Vite)
        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "x-requested-with"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica o CORS para todas as rotas do Gateway
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}