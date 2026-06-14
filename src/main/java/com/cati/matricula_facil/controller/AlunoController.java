package com.cati.matricula_facil.controller;

import com.cati.matricula_facil.domain.Aluno;
import com.cati.matricula_facil.dto.AlunoCadastroDTO;
import com.cati.matricula_facil.dto.AlunoLoginDTO;
import com.cati.matricula_facil.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "*")
    public class AlunoController{

        @Autowired //injeta dependências de aluno
        private AlunoRepository alunoRepository;

        @PostMapping //POST recebendo um "pacote" da internet
        public ResponseEntity<Aluno> cadastrar(@RequestBody AlunoCadastroDTO dados) {

            Aluno novoAluno = new Aluno();

            //copia os dados do formulário de papel (DTO) para a pasta oficial
            novoAluno.setNome(dados.nome());
            novoAluno.setEmail(dados.email());
            novoAluno.setSenha(dados.senha());

            //guarda na gaveta de alunos do Banco de Dados
            Aluno alunoSalvo = alunoRepository.save(novoAluno);

            //sucesso e mostramos como a pasta ficou
            return ResponseEntity.status(HttpStatus.CREATED).body(alunoSalvo);
        }
        @PostMapping("/login")
        public ResponseEntity<String> login(@RequestBody AlunoLoginDTO dados) {
            var alunoBuscado = alunoRepository.findByEmail(dados.email());
            if (alunoBuscado.isPresent() && alunoBuscado.get().getSenha().equals(dados.senha())) {
                System.out.println("Aluno logado com sucesso");
                return ResponseEntity.status(HttpStatus.OK).body("Bem vindo "+ alunoBuscado.get().getNome());
            }
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos");
        }


    }

