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

            // ✨ ALARME DE ID PARA O REACT!
            System.out.println("=========================================");
            System.out.println("🚨 ID DO ALUNO CADU: " + Cadu.getId());
            System.out.println("=========================================");

            Disciplina calc1 = new Disciplina();
            calc1.setNome("Cálculo 1");
            calc1.setCodigo("MAT01");
            calc1.setCreditos(6);
            calc1.setHorario("14:00");
            calc1.setVagas(60);
            calc1 = disciplinaRepository.save(calc1);

            Disciplina calc2 = new Disciplina();
            calc2.setNome("Cálculo 2");
            calc2.setCodigo("MAT02");
            calc2.setCreditos(4);
            calc2.setVagas(35);
            calc2.setHorario("10:00");
            calc2.setCodigosPreRequisitos(List.of("MAT01"));
            disciplinaRepository.save(calc2);

            Disciplina ed = new Disciplina();
            ed.setNome("Estrutura de Dados");
            ed.setCodigo("ED102");
            ed.setCreditos(4);
            ed.setVagas(5);
            ed.setHorario("Terça e Quinta - 10:00");
            disciplinaRepository.save(ed);

            System.out.println("tá feito chefe, disciplinas criadas");
        };
    }
}