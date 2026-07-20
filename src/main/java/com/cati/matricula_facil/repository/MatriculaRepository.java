package com.cati.matricula_facil.repository;

import com.cati.matricula_facil.domain.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    List<Matricula> findByAlunoId(Long alunoId); //devolve uma lista de todas matriculas associadas ao id do aluno
    Optional<Matricula> findByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId); // registro que liga um alino exato a uma disciplina exata
}