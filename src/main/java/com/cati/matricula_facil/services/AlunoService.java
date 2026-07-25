package com.cati.matricula_facil.services;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.domain.Matricula;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.repository.AlunoRepository;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import com.cati.matricula_facil.repository.MatriculaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private MatriculaRepository matriculaRepository;

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
        if (alunoOptional.isPresent()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if (encoder.matches(dados.senha(), alunoOptional.get().getSenha())) {
                return alunoOptional.get();
            }
        }
        return null;
    }

    public String matricular(Long alunoId, Long disciplinaId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        Optional<Disciplina> disciplinaOptional = disciplinaRepository.findById(disciplinaId);

        if (alunoOptional.isEmpty() || disciplinaOptional.isEmpty()) {
            return "NAO_ENCONTRADO";
        }

        Optional<Matricula> matriculaOptional = matriculaRepository.findByAlunoIdAndDisciplinaId(alunoId, disciplinaId);

        Aluno aluno = alunoOptional.get();
        Disciplina disciplina = disciplinaOptional.get();

        if (matriculaOptional.isPresent()) {
            Matricula matricula = matriculaOptional.get();
            String status = matricula.getStatus();

            if ("Cursando".equals(status) || "Aprovado".equals(status)) {
                return "JA_MATRICULADO";
            }
        }

        if (disciplina.getVagas() <= 0) {
            return "VAGAS_ESGOTADAS";
        }
        for(String horario : aluno.getHorariosOcupados() ){
            if( disciplina.getHorario().equals(horario)){
                return "HORARIO_OCUPADO";
            }
        }


        List<Matricula> matriculasAluno = matriculaRepository.findByAlunoId(alunoId);

        int somaCreditosAtuais = 0;
        for (Matricula m : matriculasAluno) {
            String status = m.getStatus();
            if ("Cursando".equals(status)) {
                somaCreditosAtuais += m.getDisciplina().getCreditos();
            }
        }

        if (somaCreditosAtuais + disciplina.getCreditos() > 24) {
            return "LIMITE_CREDITOS_EXCEDIDO";
        }

        if (disciplina.getCodigosPreRequisitos() != null && !disciplina.getCodigosPreRequisitos().isEmpty()) {
            java.util.List<String> codigosDoAluno = new java.util.ArrayList<>();
            for (Matricula m : matriculasAluno) {
                if ("Aprovado".equals(m.getStatus())) {
                    codigosDoAluno.add(m.getDisciplina().getCodigo());
                }
            }

            if (!codigosDoAluno.containsAll(disciplina.getCodigosPreRequisitos())) {
                return "FALTA_PREREQUISITO";
            }
        }

        disciplina.setVagas(disciplina.getVagas() - 1);
        disciplinaRepository.save(disciplina);

        Matricula matriculaNova;
        if (matriculaOptional.isPresent()) {
            matriculaNova = matriculaOptional.get();
        } else {
            matriculaNova = new Matricula();
        }

        matriculaNova.setAluno(aluno);
        matriculaNova.setDisciplina(disciplina);
        matriculaNova.setStatus("Cursando");
        matriculaRepository.save(matriculaNova);

        aluno.getHorariosOcupados().add(disciplina.getHorario());
        alunoRepository.save(aluno);
        return "SUCESSO";
    }

    public String desmatricular(Long alunoId, Long disciplinaId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        Optional<Disciplina> disciplinaOptional = disciplinaRepository.findById(disciplinaId);
        Optional<Matricula> matriculaOptional = matriculaRepository.findByAlunoIdAndDisciplinaId(alunoId, disciplinaId);

        if (alunoOptional.isEmpty() || disciplinaOptional.isEmpty()) {
            return "NAO_ENCONTRADO";
        }
        if (matriculaOptional.isEmpty()) {
            return "MATRICULA_NAO_ENCONTRADA";
        }

        Aluno aluno = alunoOptional.get();
        Disciplina disciplina = disciplinaOptional.get();
        Matricula matricula = matriculaOptional.get();

        String status = matricula.getStatus();
        if (!"Cursando".equals(status)) {
            return "NAO_MATRICULADO";
        }

        disciplina.setVagas(disciplina.getVagas() + 1);
        disciplinaRepository.save(disciplina);

        matriculaRepository.delete(matricula); //se caiu aq eh pq tem certeza que matriculaOptional existe
        aluno.getHorariosOcupados().remove(disciplina.getHorario());
        alunoRepository.save(aluno);


        return "SUCESSO";
    }

    public List<Disciplina> listarDisciplinasParaAluno(Long alunoId) {
        Optional<Aluno> alunoOptional = alunoRepository.findById(alunoId);
        List<Matricula> matriculasAluno = matriculaRepository.findByAlunoId(alunoId);

        if (alunoOptional.isEmpty()) return new java.util.ArrayList<>();
        List<Disciplina> todasDisciplinas = disciplinaRepository.findAll();

        //guarda: {"MAT01": "Aprovado", "FIS01": "Reprovado"}
        java.util.Map<String, String> statusMapa = new java.util.HashMap<>();

        for (Matricula m : matriculasAluno) {
            String codigoDisciplina = m.getDisciplina().getCodigo();
            statusMapa.put(codigoDisciplina, m.getStatus());
        }

        // verificacao
        for (Disciplina disciplina : todasDisciplinas) {
            String status = statusMapa.get(disciplina.getCodigo());
            disciplina.setMatriculada("Cursando".equals(status));
            disciplina.setStatusConclusao(status); //envia pro front

            // Lógica de Pré-Requisitos
            if (disciplina.getCodigosPreRequisitos() == null || disciplina.getCodigosPreRequisitos().isEmpty()) {
                disciplina.setStatusPreRequisito(true);
            } else {
                // Checa se TODOS os codigos exigidos estão no mapa E se o status deles é "Aprovado"
                boolean liberado = true;
                for (String preReq : disciplina.getCodigosPreRequisitos()) {
                    String statusPreReq = statusMapa.get(preReq);

                    // Se o status NÃO for "Aprovado", bloqueia a disciplina
                    if (!"Aprovado".equals(statusPreReq)) {
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