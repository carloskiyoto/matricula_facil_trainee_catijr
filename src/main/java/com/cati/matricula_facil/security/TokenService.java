package com.cati.matricula_facil.security; // Ajuste para o seu pacote

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.cati.matricula_facil.domain.Aluno;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    private String secret = "fusca_azul";

    public String gerarToken(Aluno aluno) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("matricula_facil")
                    .withSubject(aluno.getEmail()) // O token carrega o email do aluno
                    .withExpiresAt(gerarDataExpiracao()) // Token expira em 2 horas
                    .sign(algoritmo);
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validarToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("matricula_facil")
                    .build()
                    .verify(token)
                    .getSubject(); // Devolve o e-mail se o token for válido
        } catch (JWTVerificationException exception){
            return "";
        }
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}