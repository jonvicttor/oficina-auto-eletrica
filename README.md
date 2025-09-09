# ⚡ Sistema de Gerenciamento para Oficina Auto Elétrica

Este projeto é um sistema **web** para gerenciamento de operações de uma oficina de auto elétrica, desenvolvido como um **projeto acadêmico**.  
Ele oferece uma interface para gerir **clientes, veículos, ordens de serviço, peças e serviços**.

---

## 📖 Índice
- [Sobre](#-sobre)
- [Tecnologias](#-tecnologias)
- [Como Usar a Aplicação](#-como-usar-a-aplicação)
- [Funcionalidades Principais](#-funcionalidades-principais)
  - [Clientes](#clientes)
  - [Veículos](#veículos)
  - [Ordens de Serviço](#ordens-de-serviço)
  - [Peças e Serviços](#peças-e-serviços)
  - [Itens da OS](#itens-da-os)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 📌 Sobre
O sistema foi projetado para facilitar a administração de uma **oficina auto elétrica**, permitindo:
- Cadastro e gerenciamento de clientes.
- Registro de veículos e associação ao proprietário.
- Criação e controle de ordens de serviço.
- Gestão de peças em estoque e serviços oferecidos.
- Vinculação de itens (peças/serviços) a ordens de serviço.

---

## 🛠 Tecnologias
O projeto utiliza as seguintes tecnologias:

### Backend
- **Java 17**
- **Spring Boot**
- **Spring Data JPA**
- **MySQL** (Banco de Dados)

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**

---

## ▶️ Como Usar a Aplicação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/oficina-autoeletrica.git
2. Abra os Arquivos

Navegue até o diretório frontend/.

Abra o arquivo index.html em um navegador (Chrome, Firefox, Edge etc.).

3. Configure o Servidor

O backend deve estar rodando em localhost:8080.

A comunicação entre frontend e backend é feita via API REST.

Sem o backend, as operações de CRUD não funcionam.

🔧 Funcionalidades Principais

O sistema é dividido em seções acessadas pelo menu de navegação.

📌 Clientes

Adicionar Cliente: Nome, CPF, telefone e e-mail.

Visualizar Clientes: Listagem completa.

Editar/Excluir Cliente: Modificação e remoção direta.

🚗 Veículos

Adicionar Veículo: Placa, marca, modelo, ano e ID do proprietário.

Visualizar Veículos: Tabela com dados completos.

Editar/Excluir Veículo: Ações via botões.

🛠️ Ordens de Serviço

Criar OS: Data de entrada, status, descrição do problema, ID do veículo.

Visualizar OS: Todas as ordens registradas.

Editar/Excluir OS: Gerenciamento via tabela.

🔩 Peças e Serviços

Gerenciar Peças: Nome, preço e quantidade no estoque.

Gerenciar Serviços: Nome, descrição e valor da mão de obra.

📋 Itens da OS

Adicionar Itens: Associar peças e serviços a uma OS existente.

Campos obrigatórios: quantidade, ID da OS, ID da peça/serviço.

📂 Estrutura do Projeto

O projeto é dividido em frontend e backend:
oficina-autoeletrica/
├── frontend/
│   ├── clientes.html
│   ├── index.html
│   ├── itens-os.html
│   ├── ordens-de-servico.html
│   ├── pecas.html
│   ├── servicos.html
│   ├── script.js
│   ├── style.css
│   └── veiculos.html
└── backend/
    └── src/
        ├── main/
        │   ├── java/com/seuprojeto/oficina_autoeletrica/
        │   │   ├── config/
        │   │   │   └── WebConfig.java
        │   │   ├── controller/
        │   │   │   ├── ClienteController.java
        │   │   │   ├── ItemOrdemDeServicoController.java
        │   │   │   ├── OrdemDeServicoController.java
        │   │   │   ├── PecaController.java
        │   │   │   ├── ServicoController.java
        │   │   │   └── VeiculoController.java
        │   │   ├── entity/
        │   │   │   ├── Cliente.java
        │   │   │   ├── ItemOrdemDeServico.java
        │   │   │   ├── OrdemDeServico.java
        │   │   │   ├── Peca.java
        │   │   │   ├── Servico.java
        │   │   │   └── Veiculo.java
        │   │   ├── repository/
        │   │   │   ├── ClienteRepository.java
        │   │   │   ├── ItemOrdemDeServicoRepository.java
        │   │   │   ├── OrdemDeServicoRepository.java
        │   │   │   ├── PecaRepository.java
        │   │   │   ├── ServicoRepository.java
        │   │   │   └── VeiculoRepository.java
        │   │   └── OficinaAutoeletricaApplication.java
        │   └── resources/
        │       └── application.properties
        └── test/java/com/seuprojeto/oficina_autoeletrica/
            └── OficinaAutoeletricaApplicationTests.java
