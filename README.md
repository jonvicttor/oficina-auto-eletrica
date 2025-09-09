Sistema de Gerenciamento para Oficina Auto Elétrica

Este projeto é um sistema web para gerenciamento de operações de uma oficina de auto elétrica, desenvolvido como um projeto acadêmico. Ele oferece uma interface para gerir clientes, veículos, ordens de serviço, peças e serviços.
Como Usar a Aplicação

Para utilizar a aplicação, siga estes passos:

    Clone o Repositório:
    Abra o seu terminal e clone o projeto usando o comando git clone.

    Abra os Arquivos:
    Navegue até o diretório do projeto e abra o arquivo index.html no seu navegador web de preferência (como Google Chrome, Firefox ou Edge).

    Ambiente de Servidor:
    A aplicação foi projetada para interagir com uma API REST. Embora a lógica para a comunicação (fetch com localhost:8080/api) já esteja implementada, ela requer que um servidor de backend esteja rodando localmente para que as operações de Criação, Leitura, Atualização e Exclusão (CRUD) funcionem corretamente.

Funcionalidades Principais

O sistema é dividido em seções que podem ser acessadas através do menu de navegação no topo da página.
1. Clientes

    Adicionar Cliente: Preencha o formulário com o nome, CPF, telefone e email. A aplicação irá validar se os campos obrigatórios foram preenchidos corretamente.

    Visualizar Clientes: A tabela exibe todos os clientes cadastrados.

    Editar/Excluir Cliente: Use os botões Editar e Excluir na tabela para modificar ou remover um cliente existente.

2. Veículos

    Adicionar Veículo: Insira a placa, marca, modelo e ano do veículo. É necessário informar o ID de um cliente existente para vincular o veículo ao proprietário.

    Visualizar Veículos: A tabela lista todos os veículos e o ID do seu respectivo proprietário.

    Editar/Excluir Veículo: Botões na tabela permitem a edição e exclusão.

3. Ordens de Serviço

    Criar Ordem de Serviço: Registre uma nova ordem de serviço informando a data de entrada, status, descrição do problema e o ID do veículo associado.

    Visualizar Ordens de Serviço: A tabela mostra todas as ordens de serviço cadastradas.

    Editar/Excluir Ordem de Serviço: Opções de edição e exclusão estão disponíveis na tabela.

4. Peças e Serviços

    Gerenciar Peças: Adicione novas peças ao estoque com nome, preço e quantidade. A tabela exibe as informações e o estoque atual.

    Gerenciar Serviços: Registre os serviços oferecidos pela oficina, com nome, descrição e valor da mão de obra.

5. Itens da OS

    Adicionar Item à OS: Nesta seção, você pode adicionar peças ou serviços a uma ordem de serviço já existente. É obrigatório informar a quantidade e o ID da Ordem de Serviço, além do ID da peça ou do serviço.

Estrutura do Projeto

O projeto segue uma arquitetura modular com uma clara separação entre a camada de frontend e a de backend.
Sistema de Gerenciamento para Oficina Auto Elétrica

Este projeto é um sistema web para gerenciamento de operações de uma oficina de auto elétrica, desenvolvido como um projeto acadêmico. Ele oferece uma interface para gerir clientes, veículos, ordens de serviço, peças e serviços.
Como Usar a Aplicação

Para utilizar a aplicação, siga estes passos:

    Clone o Repositório:
    Abra o seu terminal e clone o projeto usando o comando git clone.

    Abra os Arquivos:
    Navegue até o diretório do projeto e abra o arquivo index.html no seu navegador web de preferência (como Google Chrome, Firefox ou Edge).

    Ambiente de Servidor:
    A aplicação foi projetada para interagir com uma API REST. Embora a lógica para a comunicação (fetch com localhost:8080/api) já esteja implementada, ela requer que um servidor de backend esteja rodando localmente para que as operações de Criação, Leitura, Atualização e Exclusão (CRUD) funcionem corretamente.

Funcionalidades Principais

O sistema é dividido em seções que podem ser acessadas através do menu de navegação no topo da página.
1. Clientes

    Adicionar Cliente: Preencha o formulário com o nome, CPF, telefone e email. A aplicação irá validar se os campos obrigatórios foram preenchidos corretamente.

    Visualizar Clientes: A tabela exibe todos os clientes cadastrados.

    Editar/Excluir Cliente: Use os botões Editar e Excluir na tabela para modificar ou remover um cliente existente.

2. Veículos

    Adicionar Veículo: Insira a placa, marca, modelo e ano do veículo. É necessário informar o ID de um cliente existente para vincular o veículo ao proprietário.

    Visualizar Veículos: A tabela lista todos os veículos e o ID do seu respectivo proprietário.

    Editar/Excluir Veículo: Botões na tabela permitem a edição e exclusão.

3. Ordens de Serviço

    Criar Ordem de Serviço: Registre uma nova ordem de serviço informando a data de entrada, status, descrição do problema e o ID do veículo associado.

    Visualizar Ordens de Serviço: A tabela mostra todas as ordens de serviço cadastradas.

    Editar/Excluir Ordem de Serviço: Opções de edição e exclusão estão disponíveis na tabela.

4. Peças e Serviços

    Gerenciar Peças: Adicione novas peças ao estoque com nome, preço e quantidade. A tabela exibe as informações e o estoque atual.

    Gerenciar Serviços: Registre os serviços oferecidos pela oficina, com nome, descrição e valor da mão de obra.

5. Itens da OS

    Adicionar Item à OS: Nesta seção, você pode adicionar peças ou serviços a uma ordem de serviço já existente. É obrigatório informar a quantidade e o ID da Ordem de Serviço, além do ID da peça ou do serviço.

Estrutura do Projeto

O projeto segue uma arquitetura modular com uma clara separação entre a camada de frontend e a de backend.

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
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/
    │   │   │       └── seuprojeto/
    │   │   │           └── oficina_autoeletrica/
    │   │   │               ├── config/
    │   │   │               │   └── WebConfig.java
    │   │   │               ├── controller/
    │   │   │               │   ├── ClienteController.java
    │   │   │               │   ├── ItemOrdemDeServicoController.java
    │   │   │               │   ├── OrdemDeServicoController.java
    │   │   │               │   ├── PecaController.java
    │   │   │               │   ├── ServicoController.java
    │   │   │               │   └── VeiculoController.java
    │   │   │               ├── entity/
    │   │   │               │   ├── Cliente.java
    │   │   │               │   ├── ItemOrdemDeServico.java
    │   │   │               │   ├── OrdemDeServico.java
    │   │   │               │   ├── Peca.java
    │   │   │               │   ├── Servico.java
    │   │   │               │   └── Veiculo.java
    │   │   │               ├── repository/
    │   │   │               │   ├── ClienteRepository.java
    │   │   │               │   ├── ItemOrdemDeServicoRepository.java
    │   │   │               │   ├── OrdemDeServicoRepository.java
    │   │   │               │   ├── PecaRepository.java
    │   │   │               │   ├── ServicoRepository.java
    │   │   │               │   └── VeiculoRepository.java
    │   │   │               └── OficinaAutoeletricaApplication.java
    │   │   └── resources/
    │   │       └── application.properties
    │   └── test/
    │       └── java/
    │           └── com/
    │               └── seuprojeto/
    │                   └── oficina_autoeletrica/
    │                       └── OficinaAutoeletricaApplicationTests.java
    └── pom.xml


