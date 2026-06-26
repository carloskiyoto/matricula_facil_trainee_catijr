package com.cati.matricula_facil.controller;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.service.AlunoService; // Importe o seu novo Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @PostMapping
    public ResponseEntity<Aluno> cadastrar(@RequestBody AlunoCadastroDTO dados) {
        Aluno alunoSalvo = alunoService.cadastrar(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(alunoSalvo);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AlunoLoginDTO dados) {
        Aluno alunoLogado = alunoService.realizarLogin(dados);

        if (alunoLogado != null) {
            System.out.println("Aluno logado com sucesso");
            return ResponseEntity.status(HttpStatus.OK).body("Bem vindo " + alunoLogado.getNome());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos");
    }

    @PostMapping("/{alunoId}/matricular/{disciplinaId}")
    public ResponseEntity<String> matricular(@PathVariable Long alunoId, @PathVariable Long disciplinaId) {
        String resultado = alunoService.matricular(alunoId, disciplinaId);

        if (resultado.equals("NAO_ENCONTRADO")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aluno ou Disciplina não encontrados.");
        } else if (resultado.equals("JA_MATRICULADO")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Aluno já está matriculado nesta disciplina.");
        }

        return ResponseEntity.status(HttpStatus.OK).body("Matrícula realizada com sucesso!");
    }

    @DeleteMapping("/{alunoId}/desmatricular/{disciplinaId}")
    public ResponseEntity<String> desmatricular(@PathVariable Long alunoId, @PathVariable Long disciplinaId) {
        String resultado = alunoService.desmatricular(alunoId, disciplinaId);

        if (resultado.equals("NAO_ENCONTRADO")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aluno ou Disciplina não encontrados.");
        } else if (resultado.equals("NAO_MATRICULADO")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O aluno não está matriculado nesta disciplina.");
        }

        return ResponseEntity.status(HttpStatus.OK).body("Matrícula cancelada com sucesso!");
    }
}