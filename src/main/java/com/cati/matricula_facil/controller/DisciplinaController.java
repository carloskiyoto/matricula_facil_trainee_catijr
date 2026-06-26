package com.cati.matricula_facil.controller;

import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.service.DisciplinaService; // Importa o teu novo Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {
    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    public ResponseEntity<List<Disciplina>> listar() {
        List<Disciplina> disciplinas = disciplinaService.listarTodas();
        return ResponseEntity.status(HttpStatus.OK).body(disciplinas);
    }

    // cadastrar uma nova disciplina pelo painel Admin:
    @PostMapping
    public ResponseEntity<Disciplina> cadastrar(@RequestBody Disciplina disciplina) {
        Disciplina novaDisciplina = disciplinaService.salvar(disciplina);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaDisciplina);
    }
}