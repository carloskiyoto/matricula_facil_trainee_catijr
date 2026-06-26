package com.cati.matricula_facil.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity //vai virar uma tabela no banco de dados
@Table(name = "alunos") //define nome da tabela no plural
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor // inicializa construtor vazio, que o JPA (banco de dados) gosta

public class Aluno {
    @Id // chave primaria para o banco de dados
    @GeneratedValue(strategy = GenerationType.IDENTITY) //autoincremento de ids e autocontrole do banco de dados
    private Long id; //sei la pq long, acho que existe um status de null

    private String nome;

    @Column(unique = true)//para nao ter dois alunos com o mesmo email
    private String email;

    private String senha;

    @ManyToMany //um aluno tem varias disciplinas, as quais tem varios alunos
    private List<Disciplina> disciplinas = new java.util.ArrayList<>();


}
