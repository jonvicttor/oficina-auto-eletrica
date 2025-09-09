package com.seuprojeto.oficina.oficina_autoeletrica.repository;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {

}