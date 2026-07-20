package com.cati.matricula_facil.config;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.domain.Matricula;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.repository.AlunoRepository;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import com.cati.matricula_facil.repository.MatriculaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
public class DataBaseSeed {
    private void criarDisciplina(DisciplinaRepository repo, String nome, String codigo, int creditos, int vagas, String horario,
                                 List<String> preRequisitos, String departamento, int periodo) {
        Disciplina d = new Disciplina();
        d.setNome(nome);
        d.setCodigo(codigo);
        d.setCreditos(creditos);
        d.setVagas(vagas);
        d.setHorario(horario);
        d.setDepartamento(departamento);
        d.setPeriodo(periodo);

        // se a lista de pre-requisitos não for nula,adiciona na matéria
        if (preRequisitos != null) {
            d.setCodigosPreRequisitos(preRequisitos);
        }

        repo.save(d);
    }

    private void criarAluno(AlunoRepository repo, String nome, String email, String senha, Integer periodo,
                            MatriculaRepository matriculaRepo, Map<Disciplina,String> historico) {
        Aluno novoAluno = new Aluno();
        novoAluno.setNome(nome);
        novoAluno.setEmail(email);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaCriptografada = encoder.encode(senha);
        novoAluno.setSenha(senhaCriptografada);
        novoAluno.setPeriodo(periodo);
        repo.save(novoAluno);

        if (historico != null){
            for (Map.Entry<Disciplina, String> entry: historico.entrySet()){ //percorre cada linha do map
                Disciplina disciplina = entry.getKey();
                String status = entry.getValue();

                Matricula m = new Matricula();
                m.setAluno(novoAluno);
                m.setDisciplina(disciplina);
                m.setStatus(status);
                matriculaRepo.save(m);
            }
        }


    }

    @Bean
    CommandLineRunner initDatabase(DisciplinaRepository disciplinaRepository, AlunoRepository alunoRepository, MatriculaRepository matriculaRepository) {
        return args -> {
            System.out.println("começando o cornojob");


            criarDisciplina(disciplinaRepository, "Cálculo 1", "MAT01", 6, 60, "Seg e Qua - 14:00", null, "Matemática", 1);
            criarDisciplina(disciplinaRepository, "Cálculo 2", "MAT02", 4, 35, "Seg e Qua - 10:00", List.of("MAT01"), "Matemática", 2);


            criarDisciplina(disciplinaRepository, "Programação Orientada a Objetos", "POO100", 4, 40, "Sex - 08:00", null, "Computação", 2);
            criarDisciplina(disciplinaRepository, "Estrutura de Dados", "ED102", 8, 5, "Ter e Qui - 10:00", null, "Computação", 3);
            criarDisciplina(disciplinaRepository, "Algoritmos Gulosos", "AG01", 6, 40, "Sex - 08:00", null, "Computação", 4);
            criarDisciplina(disciplinaRepository, "Algoritmos Avançados", "ALG200", 6, 20, "Sex - 14:00", List.of("MAT01", "ED102"), "Computação", 4);


            criarDisciplina(disciplinaRepository, "Física Geral 1", "FIS01", 4, 10, "Ter - 14:00", null, "Física", 1);
            criarDisciplina(disciplinaRepository, "Física Geral 2", "FIS02", 4, 25, "Qua - 08:00", List.of("FIS01"), "Física", 2);
            criarDisciplina(disciplinaRepository, "Mecânica Quântica", "FIS03", 6, 15, "Qui - 16:00", null, "Física", 4);


            criarDisciplina(disciplinaRepository, "Circuitos Elétricos 1", "ELE01", 4, 0, "Seg - 08:00", null, "Engenharia Elétrica", 3);
            criarDisciplina(disciplinaRepository, "Sistemas Digitais", "ELE02", 6, 20, "Qui - 10:00", null, "Engenharia Elétrica", 3);
            criarDisciplina(disciplinaRepository, "Eletrônica Analógica", "ELE03", 4, 15, "Sex - 10:00", List.of("ELE01"), "Engenharia Elétrica", 4);
            System.out.println("tá feito chefe, disciplinas criadas");


            Disciplina calc1 = disciplinaRepository.findByCodigo("MAT01").get();
            Disciplina fis1 = disciplinaRepository.findByCodigo("FIS01").get();

            Map<Disciplina, String> historicoRogerio = Map.of(
                    calc1, "Aprovado",
                    fis1, "Reprovado"
            );
            criarAluno(
                    alunoRepository,
                    "Rogério",
                    "rogerio@email.com",
                    "123",
                    2,
                    matriculaRepository,
                    historicoRogerio );
            criarAluno(
                    alunoRepository,
                    "João Calouro",
                    "joao@email.com",
                    "123",
                    1,
                    matriculaRepository,
                    null
            );

            System.out.println("Rogerio criado");
        };
    }

}