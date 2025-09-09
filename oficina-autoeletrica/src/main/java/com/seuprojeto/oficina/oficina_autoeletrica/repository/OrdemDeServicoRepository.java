package com.seuprojeto.oficina.oficina_autoeletrica.repository;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.OrdemDeServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdemDeServicoRepository extends JpaRepository<OrdemDeServico, Long> {

}