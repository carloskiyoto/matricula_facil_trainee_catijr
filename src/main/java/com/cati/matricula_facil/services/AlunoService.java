package com.cati.matricula_facil.services;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.repository.AlunoRepository;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        novoAluno.setSenha(dados.senha());
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
            somaCreditosAtuais += d.getCreditos();
        }

        // Se o que ele já tem + o que ele quer agora passar de 20, bloquea
        if (somaCreditosAtuais + disciplina.getCreditos() > 20) {
            return "LIMITE_CREDITOS_EXCEDIDO";
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
}