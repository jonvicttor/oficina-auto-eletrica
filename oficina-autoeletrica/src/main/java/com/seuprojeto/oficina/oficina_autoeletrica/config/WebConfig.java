package com.seuprojeto.oficina.oficina_autoeletrica.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // Indica que esta classe é uma fonte de definições de beans de configuração
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todos os endpoints da sua API
                .allowedOrigins("*") // Permite requisições de qualquer origem (para desenvolvimento)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permite todos os cabeçalhos
                .allowCredentials(false) // Não permite credenciais (cookies, etc.) para *
                .maxAge(3600); // Tempo máximo em segundos que a resposta de preflight pode ser armazenada em cache
    }
}
