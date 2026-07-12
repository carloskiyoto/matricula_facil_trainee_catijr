package com.cati.matricula_facil.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

//nao faco ideia do que tá acontecendo, mas confia
@Configuration // Avisa o Spring: "Leia isso aqui logo ao ligar!"
@EnableWebSecurity // Liga o painel de controle do Guarda-Costas
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // ✨ 1. ADICIONE ESSA LINHA AQUI PARA ATIVAR A LIBERAÇÃO DE PORTAS!
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Desliga a proteção CSRF. Como somos uma API e não um site HTML antigo, não precisamos disso.
                //sei la oq é csrf
                .csrf(csrf -> csrf.disable())

                // 3. Avisa que a nossa API não guarda "estado" ou "memória" de quem logou
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. As regras da porta da frente!
                .authorizeHttpRequests(req -> {
                    // Libera totalmente o envio (POST) de novos alunos. Afinal, a pessoa precisa se cadastrar antes de ter login
                    req.requestMatchers("/alunos").permitAll();
                    req.requestMatchers("/alunos/**").permitAll();

                    // Lembra do nosso catálogo de disciplinas? Vamos liberar a leitura (GET) para todos também!
                    req.requestMatchers(HttpMethod.GET, "/disciplinas").permitAll();

                    // Qualquer outra requisição que criarmos no futuro vai exigir que o usuário esteja logado.
                    req.anyRequest().authenticated();
                })
                .build();
    }

    // ✨ 2. ADICIONE ESSE MÉTODO INTEIRO LOGO ABAIXO DO MÉTODO ANTERIOR:
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permite que o seu React acesse a API sem o navegador barrar
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}