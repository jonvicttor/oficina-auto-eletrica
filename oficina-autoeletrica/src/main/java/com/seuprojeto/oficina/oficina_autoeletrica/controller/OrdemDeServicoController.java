package com.seuprojeto.oficina.oficina_autoeletrica.controller;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.OrdemDeServico;
import com.seuprojeto.oficina.oficina_autoeletrica.entity.Veiculo;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.OrdemDeServicoRepository;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordens-de-servico")
public class OrdemDeServicoController {

    @Autowired
    private OrdemDeServicoRepository ordemDeServicoRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @PostMapping
    public ResponseEntity<OrdemDeServico> criarOrdemDeServico(@RequestBody OrdemDeServico ordemDeServico) {
        if (ordemDeServico.getVeiculo() == null || ordemDeServico.getVeiculo().getId() == null) {
            return ResponseEntity.badRequest().build(); // Veículo não informado
        }

        return veiculoRepository.findById(ordemDeServico.getVeiculo().getId())
                .map(veiculoExistente -> {
                    ordemDeServico.setVeiculo(veiculoExistente);
                    OrdemDeServico novaOS = ordemDeServicoRepository.save(ordemDeServico);
                    return ResponseEntity.ok(novaOS);
                })
                .orElse(ResponseEntity.notFound().build()); // Veículo não encontrado
    }

    @GetMapping
    public ResponseEntity<List<OrdemDeServico>> listarTodos() {
        List<OrdemDeServico> ordensDeServico = ordemDeServicoRepository.findAll();
        return ResponseEntity.ok(ordensDeServico);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdemDeServico> buscarPorId(@PathVariable Long id) {
        return ordemDeServicoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdemDeServico> atualizarOrdemDeServico(@PathVariable Long id, @RequestBody OrdemDeServico osAtualizada) {
        Optional<OrdemDeServico> osOptional = ordemDeServicoRepository.findById(id);
        if (osOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        OrdemDeServico osExistente = osOptional.get();

        if (osAtualizada.getVeiculo() != null && osAtualizada.getVeiculo().getId() != null) {
            Optional<Veiculo> veiculoOptional = veiculoRepository.findById(osAtualizada.getVeiculo().getId());
            if (veiculoOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            osExistente.setVeiculo(veiculoOptional.get());
        } else if (osAtualizada.getVeiculo() == null) {
            osExistente.setVeiculo(null);
        }

        osExistente.setDataEntrada(osAtualizada.getDataEntrada());
        osExistente.setDataSaida(osAtualizada.getDataSaida());
        osExistente.setStatus(osAtualizada.getStatus());
        osExistente.setDescricaoProblema(osAtualizada.getDescricaoProblema());
        osExistente.setObservacoes(osAtualizada.getObservacoes());

        OrdemDeServico osSalva = ordemDeServicoRepository.save(osExistente);
        return ResponseEntity.ok(osSalva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarOrdemDeServico(@PathVariable Long id) {
        if (ordemDeServicoRepository.existsById(id)) {
            ordemDeServicoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
