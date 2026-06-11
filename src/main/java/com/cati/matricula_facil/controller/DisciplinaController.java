package com.cati.matricula_facil.controller;


import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    @Autowired //injeta dependências
    private DisciplinaRepository disciplinaRepository;

    @GetMapping //método GET de buscar
    public List<Disciplina> listarDisciplinas(){
        return disciplinaRepository.findAll();
    }

}
