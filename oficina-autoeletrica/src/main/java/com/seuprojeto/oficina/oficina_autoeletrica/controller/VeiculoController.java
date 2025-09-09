package com.seuprojeto.oficina.oficina_autoeletrica.controller;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.Veiculo;
import com.seuprojeto.oficina.oficina_autoeletrica.entity.Cliente;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.ClienteRepository;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping
    public ResponseEntity<Veiculo> criarVeiculo(@RequestBody Veiculo veiculo) {
        if (veiculo.getCliente() == null || veiculo.getCliente().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        return clienteRepository.findById(veiculo.getCliente().getId())
                .map(clienteExistente -> {
                    veiculo.setCliente(clienteExistente);
                    Veiculo novoVeiculo = veiculoRepository.save(veiculo);
                    return ResponseEntity.ok(novoVeiculo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Veiculo>> listarTodos() {
        List<Veiculo> veiculos = veiculoRepository.findAll();
        return ResponseEntity.ok(veiculos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarPorId(@PathVariable Long id) {
        return veiculoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> atualizarVeiculo(@PathVariable Long id, @RequestBody Veiculo veiculoAtualizado) {
        Optional<Veiculo> veiculoOptional = veiculoRepository.findById(id);
        if (veiculoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Veiculo veiculoExistente = veiculoOptional.get();

        if (veiculoAtualizado.getCliente() != null && veiculoAtualizado.getCliente().getId() != null) {
            Optional<Cliente> clienteOptional = clienteRepository.findById(veiculoAtualizado.getCliente().getId());
            if (clienteOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            veiculoExistente.setCliente(clienteOptional.get());
        } else if (veiculoAtualizado.getCliente() == null) {
            veiculoExistente.setCliente(null);
        }

        veiculoExistente.setPlaca(veiculoAtualizado.getPlaca());
        veiculoExistente.setMarca(veiculoAtualizado.getMarca());
        veiculoExistente.setModelo(veiculoAtualizado.getModelo());
        veiculoExistente.setAno(veiculoAtualizado.getAno());

        Veiculo veiculoSalvo = veiculoRepository.save(veiculoExistente);
        return ResponseEntity.ok(veiculoSalvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVeiculo(@PathVariable Long id) {
        if (veiculoRepository.existsById(id)) {
            veiculoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
