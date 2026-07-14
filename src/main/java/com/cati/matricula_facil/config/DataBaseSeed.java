package com.cati.matricula_facil.config;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.repository.AlunoRepository;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataBaseSeed {
    private void criarDisciplina(DisciplinaRepository repo, String nome, String codigo, int creditos, int vagas, String horario, List<String> preRequisitos) {
        Disciplina d = new Disciplina();
        d.setNome(nome);
        d.setCodigo(codigo);
        d.setCreditos(creditos);
        d.setVagas(vagas);
        d.setHorario(horario);

        // se a lista de pre-requisitos não for nula,adiciona na matéria
        if (preRequisitos != null) {
            d.setCodigosPreRequisitos(preRequisitos);
        }

        repo.save(d);
    }

    @Bean
    CommandLineRunner initDatabase(DisciplinaRepository disciplinaRepository, AlunoRepository alunoRepository) {
        return args -> {
            System.out.println("começando o cornojob");

            Aluno Cadu = new Aluno();
            Cadu.setNome("Cadu");
            Cadu.setDisciplinas(new ArrayList<>());
            Cadu.setSenha("123");
            Cadu.setEmail("cadu@cadu.com");
            Cadu = alunoRepository.save(Cadu);

            // materia sem pre-requisito
            criarDisciplina(disciplinaRepository, "Cálculo 1", "MAT01", 6, 60, "Seg e Qua - 14:00", null);
            criarDisciplina(disciplinaRepository, "Estrutura de Dados", "ED102", 8, 5, "Ter e Qui - 10:00", null);
            criarDisciplina(disciplinaRepository, "Programação Orientada a Objetos", "POO100", 4, 40, "Sex - 08:00", null);
            criarDisciplina(disciplinaRepository, "Algoritmos Gulosos", "AG01", 6, 40, "Sex - 08:00", null);


            // materia com pre-requisito
            criarDisciplina(disciplinaRepository, "Cálculo 2", "MAT02", 4, 35, "Seg e Qua - 10:00", List.of("MAT01"));

            // 2 pre-requisitos
            criarDisciplina(disciplinaRepository, "Algoritmos Avançados", "ALG200", 6, 20, "Sex - 14:00", List.of("MAT01", "ED102"));

            System.out.println("tá feito chefe, disciplinas criadas");
        };
    }

}