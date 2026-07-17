package com.cati.matricula_facil.controller;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.services.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    @PostMapping("/{alunoId}/matricular/{disciplinaId}")
    public ResponseEntity<String> matricular(@PathVariable Long alunoId, @PathVariable Long disciplinaId) {
        String resultado = alunoService.matricular(alunoId, disciplinaId);

        if (resultado.equals("NAO_ENCONTRADO")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aluno ou Disciplina não encontrados.");
        } else if (resultado.equals("JA_MATRICULADO")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O aluno já está matriculado nesta disciplina.");
        } else if (resultado.equals("VAGAS_ESGOTADAS")) {
            // Nova resposta caso não haja vagas!
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Não há vagas disponíveis para esta disciplina.");
        } else if (resultado.equals("LIMITE_CREDITOS_EXCEDIDO")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Matrícula bloqueada: Ultrapassa o limite máximo de 20 créditos.");
        } else if (resultado.equals("FALTA_PREREQUISITO")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Matéria sem pré-requisito");
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
    // Rota que devolve o catálogo já auto-bloqueado para o aluno
    @GetMapping("/{alunoId}/disciplinas")
    public ResponseEntity<List<Disciplina>> verCatalogoDoAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(alunoService.listarDisciplinasParaAluno(alunoId));
    }
}