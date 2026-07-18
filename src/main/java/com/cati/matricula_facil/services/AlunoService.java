package com.cati.matricula_facil.services;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.repository.AlunoRepository;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public Aluno cadastrar(AlunoCadastroDTO dados) {
        Aluno novoAluno = new Aluno();
        novoAluno.setNome(dados.nome());
        novoAluno.setEmail(dados.email());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaCriptografada = encoder.encode(dados.senha());
        novoAluno.setSenha(senhaCriptografada);
        return alunoRepository.save(novoAluno);
    }

    public Aluno realizarLogin(AlunoLoginDTO dados) {
        Optional<Aluno> alunoOptional = alunoRepository.findByEmail(dados.email());
        if (alunoOptional.isPresent() && alunoOptional.get().getSenha().equals(dados.senha())) {
            return alunoOptional.get(); // Retorna o aluno se a senha bater
        }
        return null; // Retorna nulo se der errado
    }

    public String matricular(Long alunoId, Long disciplinaId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        Optional<Disciplina> disciplinaOptional = disciplinaRepository.findById(disciplinaId);

        if (alunoOptional.isEmpty() || disciplinaOptional.isEmpty()) {
            return "NAO_ENCONTRADO";
        }

        Aluno aluno = alunoOptional.get();
        Disciplina disciplina = disciplinaOptional.get();



        if (aluno.getDisciplinas().contains(disciplina)) {
            return "JA_MATRICULADO";
        }

        if (disciplina.getVagas() <= 0) {
            return "VAGAS_ESGOTADAS";
        }
        //Validação do Limite de Créditos
        int somaCreditosAtuais = 0;

        for (Disciplina d : aluno.getDisciplinas()) {
            if (!"Aprovado".equals(d.getStatusConclusao())) {
                somaCreditosAtuais += d.getCreditos();
            }
        }

        if (somaCreditosAtuais + disciplina.getCreditos() > 24) {
            return "LIMITE_CREDITOS_EXCEDIDO";
        }

        //Trava de pré-requisito
        if (disciplina.getCodigosPreRequisitos() != null && !disciplina.getCodigosPreRequisitos().isEmpty()) {
            java.util.List<String> codigosDoAluno = new java.util.ArrayList<>();
            for (Disciplina d : aluno.getDisciplinas()) {
                codigosDoAluno.add(d.getCodigo());
            }
            if (!codigosDoAluno.containsAll(disciplina.getCodigosPreRequisitos())) {
                return "FALTA_PREREQUISITO";
            }
        }

        disciplina.setVagas(disciplina.getVagas() - 1);
        aluno.getDisciplinas().add(disciplina);

        alunoRepository.save(aluno);
        disciplinaRepository.save(disciplina);

        return "SUCESSO";
    }

    public String desmatricular(Long alunoId, Long disciplinaId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        Optional<Disciplina> disciplinaOptional = disciplinaRepository.findById(disciplinaId);

        if (alunoOptional.isEmpty() || disciplinaOptional.isEmpty()) {
            return "NAO_ENCONTRADO";
        }

        Aluno aluno = alunoOptional.get();
        Disciplina disciplina = disciplinaOptional.get();

        if (!aluno.getDisciplinas().contains(disciplina)) {
            return "NAO_MATRICULADO";
        }

        disciplina.setVagas(disciplina.getVagas() + 1);

        aluno.getDisciplinas().remove(disciplina);
        alunoRepository.save(aluno);
        disciplinaRepository.save(disciplina);

        return "SUCESSO";
    }

    public List<Disciplina> listarDisciplinasParaAluno(Long alunoId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        if (alunoOptional.isEmpty()) return new java.util.ArrayList<>();

        Aluno aluno = alunoOptional.get();
        List<Disciplina> todasDisciplinas = disciplinaRepository.findAll();

        // 1. CRIAMOS UM MAPA DE STATUS
        // Isso guarda: {"MAT01": "Aprovado", "FIS01": "Reprovado"}
        java.util.Map<String, String> statusMapa = new java.util.HashMap<>();
        System.out.println("--- Diagnóstico do Aluno: " + aluno.getNome() + " ---");
        for (Disciplina d : aluno.getDisciplinas()) {
            statusMapa.put(d.getCodigo(), d.getStatusConclusao());
            System.out.println("Matéria encontrada na lista do aluno: " + d.getCodigo() + " | Status: " + d.getStatusConclusao());
        }
        System.out.println("----------------------------------------------");
        for (Disciplina d : aluno.getDisciplinas()) {
            statusMapa.put(d.getCodigo(), d.getStatusConclusao());
        }

        // 2. VERIFICAÇÃO INTELIGENTE
        for (Disciplina disciplina : todasDisciplinas) {
            // Marca se já está matriculada (isso não muda)
            disciplina.setMatriculada(statusMapa.containsKey(disciplina.getCodigo()));

            // Lógica de Pré-Requisitos
            if (disciplina.getCodigosPreRequisitos() == null || disciplina.getCodigosPreRequisitos().isEmpty()) {
                disciplina.setStatusPreRequisito(true);
            } else {
                // Checamos se TODOS os códigos exigidos estão no mapa E se o status deles é "Aprovado"
                boolean liberado = true;
                for (String preReq : disciplina.getCodigosPreRequisitos()) {
                    String status = statusMapa.get(preReq);

                    // Se o status NÃO for "Aprovado", bloqueia a disciplina
                    if (!"Aprovado".equals(status)) {
                        liberado = false;
                        break;
                    }
                }
                disciplina.setStatusPreRequisito(liberado);
            }
        }
        return todasDisciplinas;
    }

}