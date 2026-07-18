# Estágio 1: Build (Usa o Maven para baixar dependências e compilar)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia o pom.xml e baixa as dependências (ajuda no cache do Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código-fonte e compila ignorando os testes
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Run (Imagem menor apenas com o Java 17)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Por segurança, roda a aplicação como um usuário comum (não-root)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copia o .jar gerado no Estágio 1
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]