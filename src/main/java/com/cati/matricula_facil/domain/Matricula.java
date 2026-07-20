package com.cati.matricula_facil.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "matriculas")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Matricula {

    @Id // chave primaria para o banco de dados
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autoincremento de ids e autocontrole do banco de dados
    private Long id;

    @ManyToOne
    @JoinColumn(name = "aluno_id") //matricula guarda o id do aluno e disciplina
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    private String status;

}
