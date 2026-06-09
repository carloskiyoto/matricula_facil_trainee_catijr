package com.cati.matricula_facil.config;


import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration //avisa o spring para ler quando inicializar o programa
public class DataBaseSeed {

    @Bean
    CommandLineRunner initDatabase(DisciplinaRepository disciplinaRepository) {
        return args -> {  //rodará este codigo
            System.out.println("comecando o cornojob");

            //criando a disciplina de calculo 1
            Disciplina  calc1 = new Disciplina();
            calc1.setNome("Cálculo 1");
            calc1.setCodigo("MAT01");
            calc1.setCreditos(6);
            calc1.setHorario("14:00");
            calc1.setVagas(60);
            calc1.setPreRequisitos(new ArrayList<Disciplina>());

            calc1 = disciplinaRepository.save(calc1); //salva novo ID no banco de dados e devolve nova disciplina atualizada

            Disciplina calc2 = new Disciplina();
            calc2.setNome("Cálculo 2");
            calc2.setCodigo("MAT02");
            calc2.setCreditos(4);
            calc2.setVagas(35);
            calc2.setHorario("10:00");

            List<Disciplina> preReqCalc2 = new ArrayList<Disciplina>();
            preReqCalc2.add(calc1);
            calc2.setPreRequisitos(preReqCalc2);
            calc2 = disciplinaRepository.save(calc2);

            System.out.println("ta feito chefe");
        };
    }
}
