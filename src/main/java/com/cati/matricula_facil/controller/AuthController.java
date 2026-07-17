package com.cati.matricula_facil.controller;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.repository.AlunoRepository;
import com.cati.matricula_facil.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AlunoRepository repository;

    @Autowired
    private TokenService tokenService;

    // Rota que o React vai chamar para logar
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody AlunoLoginDTO dadosLogin) {
        String email = dadosLogin.email();
        String senha = dadosLogin.senha();

        System.out.println("DEBUG LOGIN: Tentando logar com e-mail: " + email);
        Optional<Aluno> alunoOpt = repository.findByEmail(dadosLogin.email());
        System.out.println("EMAIL DO ALUNO É");
        System.out.println(alunoOpt);
        if (alunoOpt.isEmpty()) {
            System.out.println("DEBUG LOGIN: Usuário não encontrado no banco!");
            return ResponseEntity.status(401).body("Email não encontrado");
        }



        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            boolean senhaValida = encoder.matches(senha, aluno.getSenha());
            System.out.println("DEBUG LOGIN: Senha válida? " + senhaValida);

            // Verifica se a senha digitada bate com a senha criptografada do banco
            if (senhaValida) {
                String token = tokenService.gerarToken(aluno);
                return ResponseEntity.ok(Map.of("token", token, "id", aluno.getId(), "nome", aluno.getNome()));            }
        }
        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }
}