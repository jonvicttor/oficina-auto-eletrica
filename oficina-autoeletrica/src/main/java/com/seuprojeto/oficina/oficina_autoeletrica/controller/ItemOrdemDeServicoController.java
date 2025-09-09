package com.seuprojeto.oficina.oficina_autoeletrica.controller;

import com.seuprojeto.oficina.oficina_autoeletrica.entity.ItemOrdemDeServico;
import com.seuprojeto.oficina.oficina_autoeletrica.entity.OrdemDeServico;
import com.seuprojeto.oficina.oficina_autoeletrica.entity.Peca;
import com.seuprojeto.oficina.oficina_autoeletrica.entity.Servico;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.ItemOrdemDeServicoRepository;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.OrdemDeServicoRepository;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.PecaRepository;
import com.seuprojeto.oficina.oficina_autoeletrica.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/itens-ordem-de-servico")
public class ItemOrdemDeServicoController {

    @Autowired
    private ItemOrdemDeServicoRepository itemOrdemDeServicoRepository;

    @Autowired
    private OrdemDeServicoRepository ordemDeServicoRepository;

    @Autowired
    private PecaRepository pecaRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @PostMapping
    public ResponseEntity<ItemOrdemDeServico> criarItemOrdemDeServico(@RequestBody ItemOrdemDeServico itemOs) {
        // 1. Valida se a Ordem de Serviço existe
        if (itemOs.getOrdemDeServico() == null || itemOs.getOrdemDeServico().getId() == null) {
            return ResponseEntity.badRequest().body(null); // Requisição inválida: OS não informada
        }

        Optional<OrdemDeServico> osOptional = ordemDeServicoRepository.findById(itemOs.getOrdemDeServico().getId());
        if (osOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // OS não encontrada
        }
        itemOs.setOrdemDeServico(osOptional.get()); // Associa a OS gerenciada pelo JPA

        // 2. Valida se é UMA Peça OU UM Serviço (e não ambos ou nenhum)
        boolean isPeca = itemOs.getPeca() != null && itemOs.getPeca().getId() != null;
        boolean isServico = itemOs.getServico() != null && itemOs.getServico().getId() != null;

        if (isPeca && isServico) {
            return ResponseEntity.badRequest().body(null); // Requisição inválida: Não pode ser peça E serviço
        }
        if (!isPeca && !isServico) {
            return ResponseEntity.badRequest().body(null); // Requisição inválida: Deve ser peça OU serviço
        }

        // 3. Valida se a Peça ou Serviço existe e associa
        if (isPeca) {
            Optional<Peca> pecaOptional = pecaRepository.findById(itemOs.getPeca().getId());
            if (pecaOptional.isEmpty()) {
                return ResponseEntity.notFound().build(); // Peça não encontrada
            }
            itemOs.setPeca(pecaOptional.get()); // Corrigido: chama get() no Optional
            itemOs.setServico(null); // Garante que o serviço é nulo
        } else { // isServico
            Optional<Servico> servicoOptional = servicoRepository.findById(itemOs.getServico().getId());
            if (servicoOptional.isEmpty()) {
                return ResponseEntity.notFound().build(); // Serviço não encontrado
            }
            itemOs.setServico(servicoOptional.get()); // Corrigido: chama get() no Optional
            itemOs.setPeca(null); // Garante que a peça é nula
        }

        // 4. Salva o item da OS
        ItemOrdemDeServico novoItemOs = itemOrdemDeServicoRepository.save(itemOs);
        return ResponseEntity.ok(novoItemOs);
    }

    @GetMapping // Mapeia este método para requisições GET para a URL base (/api/itens-ordem-de-servico)
    public ResponseEntity<List<ItemOrdemDeServico>> listarTodos() {
        List<ItemOrdemDeServico> itens = itemOrdemDeServicoRepository.findAll();
        // Inicializa as associações lazy-loaded para serialização
        itens.forEach(item -> {
            if (item.getOrdemDeServico() != null) item.getOrdemDeServico().getId();
            if (item.getPeca() != null) item.getPeca().getId();
            if (item.getServico() != null) item.getServico().getId();
        });
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{id}") // Mapeia para uma URL como /api/itens-ordem-de-servico/1
    public ResponseEntity<ItemOrdemDeServico> buscarPorId(@PathVariable Long id) {
        return itemOrdemDeServicoRepository.findById(id)
                .map(item -> {
                    // Inicializa as associações lazy-loaded para serialização
                    if (item.getOrdemDeServico() != null) item.getOrdemDeServico().getId();
                    if (item.getPeca() != null) item.getPeca().getId();
                    if (item.getServico() != null) item.getServico().getId();
                    return ResponseEntity.ok(item);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}") // Mapeia este método para requisições PUT para /api/itens-ordem-de-servico/{id}
    public ResponseEntity<ItemOrdemDeServico> atualizarItemOrdemDeServico(@PathVariable Long id, @RequestBody ItemOrdemDeServico itemOsAtualizado) {
        // 1. Verifica se o Item da OS a ser atualizado existe
        Optional<ItemOrdemDeServico> itemOsOptional = itemOrdemDeServicoRepository.findById(id);
        if (itemOsOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Retorna 404 se o Item da OS não for encontrado
        }

        ItemOrdemDeServico itemOsExistente = itemOsOptional.get();

        // 2. Valida e associa a Ordem de Serviço (se fornecida e diferente)
        if (itemOsAtualizado.getOrdemDeServico() != null && itemOsAtualizado.getOrdemDeServico().getId() != null) {
            Optional<OrdemDeServico> osOptional = ordemDeServicoRepository.findById(itemOsAtualizado.getOrdemDeServico().getId());
            if (osOptional.isEmpty()) {
                return ResponseEntity.notFound().build(); // OS não encontrada
            }
            itemOsExistente.setOrdemDeServico(osOptional.get());
        } else if (itemOsAtualizado.getOrdemDeServico() == null) {
            // Se a OS for explicitamente null, pode ser um erro dependendo da regra de negócio
        }

        // 3. Valida se é UMA Peça OU UM Serviço (e não ambos ou nenhum) na atualização
        boolean isPecaAtualizada = itemOsAtualizado.getPeca() != null && itemOsAtualizado.getPeca().getId() != null;
        boolean isServicoAtualizado = itemOsAtualizado.getServico() != null && itemOsAtualizado.getServico().getId() != null;

        if (isPecaAtualizada && isServicoAtualizado) { // Corrigido: 'isServicoAtualizada' para 'isServicoAtualizado'
            return ResponseEntity.badRequest().body(null); // Não pode ser peça E serviço
        }
        if (!isPecaAtualizada && !isServicoAtualizado) { // Corrigido: 'isServicoAtualizada' para 'isServicoAtualizado'
            // Se nem peça nem serviço foram atualizados, mantém os existentes
        }

        // 4. Valida e associa a Peça ou Serviço (se fornecida)
        if (isPecaAtualizada) {
            Optional<Peca> pecaOptional = pecaRepository.findById(itemOsAtualizado.getPeca().getId());
            if (pecaOptional.isEmpty()) {
                return ResponseEntity.notFound().build(); // Peça não encontrada
            }
            itemOsExistente.setPeca(pecaOptional.get());
            itemOsExistente.setServico(null); // Garante que o serviço é nulo
        } else if (isServicoAtualizado) { // Corrigido: 'isServicoAtualizada' para 'isServicoAtualizado'
            Optional<Servico> servicoOptional = servicoRepository.findById(itemOsAtualizado.getServico().getId());
            if (servicoOptional.isEmpty()) {
                return ResponseEntity.notFound().build(); // Serviço não encontrado
            }
            itemOsExistente.setServico(servicoOptional.get());
            itemOsExistente.setPeca(null); // Garante que a peça é nula
        } else {
            // Se nem peça nem serviço foram atualizados, mantém os existentes
        }

        // 5. Atualiza a quantidade
        itemOsExistente.setQuantidade(itemOsAtualizado.getQuantidade());

        // 6. Salva o item da OS atualizado
        ItemOrdemDeServico itemOsSalvo = itemOrdemDeServicoRepository.save(itemOsExistente);
        return ResponseEntity.ok(itemOsSalvo);
    }

    @DeleteMapping("/{id}") // Mapeia este método para requisições DELETE para /api/itens-ordem-de-servico/{id}
    public ResponseEntity<Void> deletarItemOrdemDeServico(@PathVariable Long id) {
        if (itemOrdemDeServicoRepository.existsById(id)) { // Verifica se o Item da OS existe
            itemOrdemDeServicoRepository.deleteById(id); // Deleta o Item da OS
            return ResponseEntity.noContent().build(); // Retorna 204 No Content para sucesso sem corpo
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 se o Item da OS não for encontrado
        }
    }
}
