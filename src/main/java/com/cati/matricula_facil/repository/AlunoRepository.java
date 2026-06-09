package com.cati.matricula_facil.repository;

import com.cati.matricula_facil.domain.Aluno;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
//para o java acessar o banco de dados
@Repository
//herda JpaRepo e seus metodos para implementacao da tabela de alunos
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    //busca SQL do email
    Optional<Aluno> findByEmail(String email);
}
