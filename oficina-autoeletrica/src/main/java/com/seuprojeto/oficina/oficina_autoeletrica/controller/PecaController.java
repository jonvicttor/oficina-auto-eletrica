package com.seuprojeto.oficina.oficina_autoeletrica.controller;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.Peca;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.PecaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pecas")
public class PecaController {

    @Autowired
    private PecaRepository pecaRepository;

    @PostMapping
    public ResponseEntity<Peca> criarPeca(@RequestBody Peca peca) {
        Peca novaPeca = pecaRepository.save(peca);
        return ResponseEntity.ok(novaPeca);
    }

    @GetMapping
    public ResponseEntity<List<Peca>> listarTodos() {
        List<Peca> pecas = pecaRepository.findAll();
        return ResponseEntity.ok(pecas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Peca> buscarPorId(@PathVariable Long id) {
        return pecaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Peca> atualizarPeca(@PathVariable Long id, @RequestBody Peca pecaAtualizada) {
        return pecaRepository.findById(id)
                .map(peca -> {
                    peca.setNome(pecaAtualizada.getNome());
                    peca.setPreco(pecaAtualizada.getPreco());
                    peca.setQuantidadeEstoque(pecaAtualizada.getQuantidadeEstoque());

                    Peca pecaSalva = pecaRepository.save(peca);
                    return ResponseEntity.ok(pecaSalva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}") // Mapeia este método para requisições DELETE para /api/pecas/{id}
    public ResponseEntity<Void> deletarPeca(@PathVariable Long id) {
        if (pecaRepository.existsById(id)) {
            pecaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
