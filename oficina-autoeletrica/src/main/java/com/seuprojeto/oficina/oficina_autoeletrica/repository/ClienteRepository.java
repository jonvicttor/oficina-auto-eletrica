package com.seuprojeto.oficina.oficina_autoeletrica.repository;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}