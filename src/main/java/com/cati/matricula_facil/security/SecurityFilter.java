package com.cati.matricula_facil.security;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.repository.AlunoRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recuperarToken(request);

        if (token != null) {
            String email = tokenService.validarToken(token);
            Optional<Aluno> alunoOpt = alunoRepository.findByEmail(email);

            if (alunoOpt.isPresent()) {
                Aluno aluno = alunoOpt.get();
                // cria a autenticação
                var authentication = new UsernamePasswordAuthenticationToken(aluno, null, null);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        // passa para a proxima etapa (Controller ou bloqueio)
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}