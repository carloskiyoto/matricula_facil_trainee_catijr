package com.cati.matricula_facil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MatriculaFacilApplication {

	public static void main(String[] args) {
		SpringApplication.run(MatriculaFacilApplication.class, args);
	}

}
