package com.cati.matricula_facil.controller;

import com.cati.matricula_facil.domain.User;
import com.cati.matricula_facil.service.HelloWorldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//para reconhecer que esta classe e um controller:
@RestController //indica que é controller rest
@RequestMapping("/hello-world")
public class HelloWorldController {
    @Autowired //indica automaticamente na classe
    //cria um construtor com o mesmo nome da classe,
    private HelloWorldService helloWorldService;


    //metodo http: post, get, delete, put, patch, options, head
    @GetMapping // GET /hello-word
    public String helloWorld(){
        return helloWorldService.helloWorld("fusca azul");
    }
    //criacao de novos recursos na API/ adcionar novos dados
    @PostMapping("/{id}")
    //tudo que vier do RequestBody será injetado no parametro body
    public String helloWorldPost(@PathVariable("id") String id, @RequestBody User body){
        return body.getName() + id;

    }

}
