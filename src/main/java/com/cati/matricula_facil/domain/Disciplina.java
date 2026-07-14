package com.cati.matricula_facil.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table (name = "disciplinas")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties("preRequisitos") //quando tentam abrir um disciplina que está dentro
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String codigo;
    private Integer vagas;
    private Integer creditos;
    private String horario;
    @Transient
    private boolean statusPreRequisito;


    // tabela auxiliar
    @ElementCollection
    private List<String> codigosPreRequisitos = new ArrayList<>();


    public List<String> getCodigosPreRequisitos() {
        return codigosPreRequisitos;
    }

    public void setCodigosPreRequisitos(List<String> codigosPreRequisitos) {
        this.codigosPreRequisitos = codigosPreRequisitos;
    }

    @Transient
    private boolean matriculada;

    public boolean isMatriculada() {
        return matriculada;
    }

}
