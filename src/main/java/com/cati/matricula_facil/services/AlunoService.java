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
            somaCreditosAtuais += d.getCreditos();
        }

        // Se o que ele já tem + o que ele quer agora passar de 20, bloquea
        if (somaCreditosAtuais + disciplina.getCreditos() > 20) {
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

    //Gera o catálogo personalizado para um aluno específico
    public List<Disciplina> listarDisciplinasParaAluno(Long alunoId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        if (alunoOptional.isEmpty()) return new java.util.ArrayList<>();

        Aluno aluno = alunoOptional.get();
        List<Disciplina> todasDisciplinas = disciplinaRepository.findAll();

        //Pega os códigos de todas as matérias que o aluno já tem/fez
        java.util.List<String> codigosDoAluno = new java.util.ArrayList<>();
        for (Disciplina d : aluno.getDisciplinas()) {
            codigosDoAluno.add(d.getCodigo());
        }

        //Verifica matéria por matéria
        for (Disciplina disciplina : todasDisciplinas) {
            // Cruza os dados do banco e marca se o aluno já está matriculado ou nao
            boolean jaMatriculado = codigosDoAluno.contains(disciplina.getCodigo());
            disciplina.setMatriculada(jaMatriculado);

            if (disciplina.getCodigosPreRequisitos() == null || disciplina.getCodigosPreRequisitos().isEmpty()) {
                disciplina.setStatusPreRequisito(true); // Sem pré-requisito = Liberado
            } else {
                // Checa se a lista do aluno contém TODOS os códigos que a disciplina pede
                boolean temTodos = codigosDoAluno.containsAll(disciplina.getCodigosPreRequisitos());
                disciplina.setStatusPreRequisito(temTodos); // Se tiver todos = true, senão = false (bloqueia sozinho)
            }
        }
        return todasDisciplinas;
    }

}