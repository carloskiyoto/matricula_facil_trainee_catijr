package com.cati.matricula_facil.services;

import com.cati.matricula_facil.domain.Disciplina;
import com.cati.matricula_facil.repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public List<Disciplina> listarTodas() {
        return disciplinaRepository.findAll();
    }

    public Optional<Disciplina> buscarPorId(Long id) {
        return disciplinaRepository.findById(id);
    }

    public Disciplina salvar(Disciplina disciplina) {
        //Checa se os códigos de pré-requisito digitados
        if (disciplina.getCodigosPreRequisitos() != null) {
            for (String codigo : disciplina.getCodigosPreRequisitos()) {
                Optional<Disciplina> preReq = disciplinaRepository.findByCodigo(codigo);
                if (preReq.isEmpty()) {
                    // bloqueia a criação da matéria
                    throw new RuntimeException("Erro ao cadastrar: O pré-requisito '" + codigo + "' não existe no banco de dados");
                }
            }
        }
        return disciplinaRepository.save(disciplina);
    }
}