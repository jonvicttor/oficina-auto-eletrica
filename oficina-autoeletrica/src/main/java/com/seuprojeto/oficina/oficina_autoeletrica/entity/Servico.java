package com.seuprojeto.oficina.oficina_autoeletrica.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Import necessário

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "servicos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ESSA LINHA É CRÍTICA AQUI!
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nomeServico;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private Double valorMaoDeObra;
}
