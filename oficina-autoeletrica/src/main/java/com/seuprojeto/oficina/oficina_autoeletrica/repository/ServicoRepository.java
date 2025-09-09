package com.seuprojeto.oficina.oficina_autoeletrica.repository;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

}
