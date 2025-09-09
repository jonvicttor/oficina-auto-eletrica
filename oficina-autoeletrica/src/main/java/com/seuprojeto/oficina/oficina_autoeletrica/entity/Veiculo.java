package com.seuprojeto.oficina.oficina_autoeletrica.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // NOVO IMPORT
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "veiculos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "ordensDeServico"}) // Adicionado aqui e ignorando ordensDeServico na serialização
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String placa;

    private String marca;

    private String modelo;

    private Integer ano;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente; // O cliente aqui também pode ser um proxy

    // --- RELAÇÃO COM ORDEM DE SERVIÇO ---
    // Ignoramos esta lista na serialização de Veiculo para evitar loops e problemas de proxy.
    // Se precisar da lista de OS ao buscar um Veiculo, você precisaria de um DTO ou uma busca customizada.
    @OneToMany(mappedBy = "veiculo", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference // Removido anteriormente, e manteremos assim para simplificar
    private List<OrdemDeServico> ordensDeServico;
}
