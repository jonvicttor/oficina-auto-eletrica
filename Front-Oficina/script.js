// script.js

const API_BASE_URL = 'http://localhost:8080/api';
const mainContentDiv = document.getElementById('main-content');

// Variáveis globais para controlar o ID do item em edição para cada entidade
let editingClientId = null;
let editingPecaId = null;
let editingServicoId = null;
let editingOrdemDeServicoId = null;
let editingVeiculoId = null;
let editingItemOsId = null;

// Referências ao modal
const appModal = document.getElementById('app-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalConfirmButton = document.getElementById('modal-confirm-button');
const modalCancelButton = document.getElementById('modal-cancel-button');

// Objeto para mapear nomes de entidades para suas funções de carregamento
const entityLoadFunctions = {
    'clientes': carregarClientes,
    'veiculos': carregarVeiculos,
    'ordens-de-servico': carregarOrdensDeServico,
    'pecas': carregarPecas,
    'servicos': carregarServicos,
    'itens-os': carregarItensOS
};

/**
 * Carrega o conteúdo HTML de uma seção específica e injeta no main-content.
 * @param {string} entityName - O nome da entidade (ex: 'clientes', 'veiculos').
 */
async function loadSection(entityName) {
    try {
        // Busca o conteúdo HTML da entidade correspondente
        const response = await fetch(`${entityName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        mainContentDiv.innerHTML = htmlContent;

        // Após carregar o HTML, chama a função de carregamento de dados específica para a entidade
        if (entityLoadFunctions[entityName]) {
            entityLoadFunctions[entityName]();
        }

        // Re-atribui event listeners após o HTML ser carregado
        attachEventListenersToCurrentSection();

    } catch (error) {
        console.error(`Erro ao carregar a seção de ${entityName}:`, error);
        mainContentDiv.innerHTML = `<p class="text-red-600 text-center">Erro ao carregar a seção de ${entityName}. Verifique o console.</p>`;
    }
}

/**
 * Atribui os event listeners aos formulários e botões da seção atualmente carregada.
 * Isso é necessário porque o conteúdo é carregado dinamicamente e os listeners originais seriam perdidos.
 */
function attachEventListenersToCurrentSection() {
    // Clientes
    const clienteForm = document.getElementById('cliente-form');
    if (clienteForm) {
        clienteForm.addEventListener('submit', handleClienteFormSubmit);
        document.getElementById('cliente-cancel-button').addEventListener('click', cancelarEdicaoCliente);
    }

    // Veículos
    const veiculoForm = document.getElementById('veiculo-form');
    if (veiculoForm) {
        veiculoForm.addEventListener('submit', handleVeiculoFormSubmit);
        document.getElementById('veiculo-cancel-button').addEventListener('click', cancelarEdicaoVeiculo);
    }

    // Ordens de Serviço
    const ordemDeServicoForm = document.getElementById('ordem-de-servico-form');
    if (ordemDeServicoForm) {
        ordemDeServicoForm.addEventListener('submit', handleOrdemDeServicoFormSubmit);
        document.getElementById('os-cancel-button').addEventListener('click', cancelarEdicaoOrdemDeServico);
    }

    // Peças
    const pecaForm = document.getElementById('peca-form');
    if (pecaForm) {
        pecaForm.addEventListener('submit', handlePecaFormSubmit);
        document.getElementById('peca-cancel-button').addEventListener('click', cancelarEdicaoPeca);
    }

    // Serviços
    const servicoForm = document.getElementById('servico-form');
    if (servicoForm) {
        servicoForm.addEventListener('submit', handleServicoFormSubmit);
        document.getElementById('servico-cancel-button').addEventListener('click', cancelarEdicaoServico);
    }

    // Itens da OS
    const itemOsForm = document.getElementById('item-os-form');
    if (itemOsForm) {
        itemOsForm.addEventListener('submit', handleItemOsFormSubmit);
        document.getElementById('item-os-cancel-button').addEventListener('click', cancelarEdicaoItemOS);
        // Listener específico para o tipo de item (Peça/Serviço)
        document.getElementById('item-os-tipo').addEventListener('change', (e) => {
            const tipo = e.target.value;
            document.getElementById('item-os-peca-group')?.classList.add('hidden');
            document.getElementById('item-os-servico-group')?.classList.add('hidden');

            if (tipo === 'peca') {
                document.getElementById('item-os-peca-group')?.classList.remove('hidden');
            } else if (tipo === 'servico') {
                document.getElementById('item-os-servico-group')?.classList.remove('hidden');
            }
        });
    }
}


// --- Funções de Navegação ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetEntity = e.target.dataset.target;

        // Atualiza o estilo do link ativo
        document.querySelectorAll('.nav-link').forEach(nav => {
            nav.classList.remove('active-nav-link');
            nav.classList.add('text-blue-200'); // Garante que links inativos voltem a cor
        });
        e.target.classList.add('active-nav-link');
        e.target.classList.remove('text-blue-200'); // Remove a cor padrão para o ativo
        e.target.classList.add('text-white'); // Adiciona a cor branca para o ativo


        // Carrega o conteúdo da seção
        loadSection(targetEntity);
    });
});

// --- Funções de Utilitário (para substituir alert/confirm) ---
/**
 * Exibe um modal de mensagem.
 * @param {string} title - Título do modal.
 * @param {string} message - Mensagem a ser exibida.
 * @param {string} type - Tipo de mensagem (info, success, warning, error).
 */
function showMessage(title, message, type = 'info') {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalCancelButton.classList.add('hidden'); // Mensagens simples não precisam de botão cancelar

    // Ajusta o estilo do botão de confirmação e do título com base no tipo de mensagem
    modalConfirmButton.classList.remove('bg-blue-600', 'bg-green-600', 'bg-red-600', 'hover:bg-blue-700', 'hover:bg-green-700', 'hover:bg-red-700');
    modalTitle.classList.remove('text-blue-700', 'text-green-700', 'text-red-700');

    if (type === 'success') {
        modalConfirmButton.classList.add('bg-green-600', 'hover:bg-green-700');
        modalTitle.classList.add('text-green-700');
    } else if (type === 'error') {
        modalConfirmButton.classList.add('bg-red-600', 'hover:bg-red-700');
        modalTitle.classList.add('text-red-700');
    } else {
        modalConfirmButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
        modalTitle.classList.add('text-blue-700');
    }

    appModal.classList.remove('hidden');

    return new Promise(resolve => {
        modalConfirmButton.onclick = () => {
            appModal.classList.add('hidden');
            resolve(true);
        };
    });
}

/**
 * Exibe um modal de confirmação.
 * @param {string} title - Título do modal.
 * @param {string} message - Mensagem de confirmação.
 * @returns {Promise<boolean>} - Resolve com true se confirmado, false se cancelado.
 */
function showConfirm(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalCancelButton.classList.remove('hidden'); // Exibe o botão cancelar
    
    // Configura o estilo para confirmação
    modalConfirmButton.classList.remove('bg-green-600', 'bg-red-600', 'hover:bg-green-700', 'hover:bg-red-700');
    modalConfirmButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    modalTitle.classList.remove('text-green-700', 'text-red-700');
    modalTitle.classList.add('text-blue-700');

    appModal.classList.remove('hidden');

    return new Promise(resolve => {
        modalConfirmButton.onclick = () => {
            appModal.classList.add('hidden');
            resolve(true);
        };
        modalCancelButton.onclick = () => {
            appModal.classList.add('hidden');
            resolve(false);
        };
    });
}


// --- Funções para Clientes ---

/**
 * Valida os dados do formulário de cliente.
 * @param {object} clientData - Objeto com os dados do cliente.
 * @returns {boolean} - Retorna true se os dados são válidos, false caso contrário.
 */
function validateClienteForm(clientData) {
    if (!clientData.nome || clientData.nome.trim() === '') {
        showMessage('Erro de Validação', 'O campo "Nome" é obrigatório.', 'error');
        return false;
    }
    if (!clientData.cpf || clientData.cpf.trim() === '') {
        showMessage('Erro de Validação', 'O campo "CPF" é obrigatório.', 'error');
        return false;
    }
    // Simplistic CPF validation (just checks length, not actual CPF algorithm)
    if (clientData.cpf.length !== 11 && clientData.cpf.length !== 14) { // 111.222.333-44 or 11122233344
        showMessage('Erro de Validação', 'O CPF deve ter 11 ou 14 caracteres (com pontos e traço, se aplicável).', 'error');
        return false;
    }
    if (clientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
        showMessage('Erro de Validação', 'Por favor, insira um e-mail válido.', 'error');
        return false;
    }
    return true;
}


async function carregarClientes() {
    const tableBody = document.getElementById('clientes-table-body');
    if (!tableBody) return; // Garante que o elemento existe

    tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Carregando clientes...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const clientes = await response.json();

        tableBody.innerHTML = '';

        if (clientes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum cliente cadastrado.</td></tr>`;
            return;
        }

        clientes.forEach(cliente => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${cliente.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cliente.nome}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cliente.cpf}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cliente.telefone || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cliente.email || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-2 rounded-md px-2 py-1 border border-blue-600" onclick="editarCliente(${cliente.id})">Editar</button>
                        <button class="text-red-600 hover:text-red-900 rounded-md px-2 py-1 border border-red-600" onclick="deletarCliente(${cliente.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">Erro ao carregar clientes. Verifique o console.</td></tr>`;
    }
}

async function deletarCliente(id) {
    const confirmed = await showConfirm('Confirmar Exclusão', `Tem certeza que deseja excluir o cliente com ID ${id}?`);
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            showMessage('Sucesso', 'Cliente excluído com sucesso!', 'success');
            carregarClientes();
        } else if (response.status === 404) {
            showMessage('Erro', 'Cliente não encontrado.', 'warning');
        } else {
            const errorData = await response.json();
            throw new Error(`Erro ao excluir cliente: ${response.status} - ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        showMessage('Erro', 'Erro ao excluir cliente. Verifique o console.', 'error');
    }
}

async function editarCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cliente = await response.json();

        document.getElementById('cliente-id').value = cliente.id;
        document.getElementById('cliente-nome').value = cliente.nome;
        document.getElementById('cliente-cpf').value = cliente.cpf;
        document.getElementById('cliente-telefone').value = cliente.telefone;
        document.getElementById('cliente-email').value = cliente.email;

        document.getElementById('cliente-form-title').textContent = 'Editar Cliente Existente';
        document.getElementById('cliente-submit-button').textContent = 'Atualizar Cliente';
        document.getElementById('cliente-submit-button').classList.remove('bg-blue-600');
        document.getElementById('cliente-submit-button').classList.add('bg-green-600');
        document.getElementById('cliente-cancel-button').classList.remove('hidden');

        editingClientId = cliente.id;
    } catch (error) {
        console.error('Erro ao carregar cliente para edição:', error);
        showMessage('Erro', 'Erro ao carregar cliente para edição. Verifique o console.', 'error');
    }
}

function cancelarEdicaoCliente() {
    document.getElementById('cliente-form').reset();
    document.getElementById('cliente-id').value = '';
    document.getElementById('cliente-form-title').textContent = 'Cadastrar Novo Cliente';
    document.getElementById('cliente-submit-button').textContent = 'Cadastrar Cliente';
    document.getElementById('cliente-submit-button').classList.remove('bg-green-600');
    document.getElementById('cliente-submit-button').classList.add('bg-blue-600');
    document.getElementById('cliente-cancel-button').classList.add('hidden');
    editingClientId = null;
}

async function handleClienteFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const clienteData = {};
    formData.forEach((value, key) => {
        clienteData[key] = value;
    });

    // Chama a função de validação antes de enviar
    if (!validateClienteForm(clienteData)) {
        return; // Impede o envio se a validação falhar
    }

    const method = editingClientId ? 'PUT' : 'POST';
    const url = editingClientId ? `${API_BASE_URL}/clientes/${editingClientId}` : `${API_BASE_URL}/clientes`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        showMessage('Sucesso', `Cliente ${editingClientId ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
        cancelarEdicaoCliente();
        carregarClientes();
    } catch (error) {
        console.error(`Erro ao ${editingClientId ? 'atualizar' : 'cadastrar'} cliente:`, error);
        showMessage('Erro', `Erro ao ${editingClientId ? 'atualizar' : 'cadastrar'} cliente. Verifique o console e os dados informados.`, 'error');
    }
}


// --- Funções para Veículos ---

async function carregarVeiculos() {
    const tableBody = document.getElementById('veiculos-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Carregando veículos...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/veiculos`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const veiculos = await response.json();

        tableBody.innerHTML = '';

        if (veiculos.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum veículo cadastrado.</td></tr>`;
            return;
        }

        veiculos.forEach(veiculo => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${veiculo.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${veiculo.placa}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${veiculo.marca}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${veiculo.modelo}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${veiculo.ano}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${veiculo.cliente ? veiculo.cliente.id : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-2 rounded-md px-2 py-1 border border-blue-600" onclick="editarVeiculo(${veiculo.id})">Editar</button>
                        <button class="text-red-600 hover:text-red-900 rounded-md px-2 py-1 border border-red-600" onclick="deletarVeiculo(${veiculo.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">Erro ao carregar veículos. Verifique o console.</td></tr>`;
    }
}

async function deletarVeiculo(id) {
    const confirmed = await showConfirm('Confirmar Exclusão', `Tem certeza que deseja excluir o veículo com ID ${id}? Isso também pode afetar Ordens de Serviço ligadas a ele.`);
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            showMessage('Sucesso', 'Veículo excluído com sucesso!', 'success');
            carregarVeiculos();
        } else if (response.status === 404) {
            showMessage('Erro', 'Veículo não encontrado.', 'warning');
        } else {
            const errorData = await response.json();
            throw new Error(`Erro ao excluir veículo: ${response.status} - ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar veículo:', error);
        showMessage('Erro', 'Erro ao excluir veículo. Verifique o console.', 'error');
    }
}

async function editarVeiculo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/veiculos/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const veiculo = await response.json();

        document.getElementById('veiculo-id').value = veiculo.id;
        document.getElementById('veiculo-placa').value = veiculo.placa;
        document.getElementById('veiculo-marca').value = veiculo.marca;
        document.getElementById('veiculo-modelo').value = veiculo.modelo;
        document.getElementById('veiculo-ano').value = veiculo.ano;
        document.getElementById('veiculo-cliente-id').value = veiculo.cliente ? veiculo.cliente.id : '';

        document.getElementById('veiculo-form-title').textContent = 'Editar Veículo Existente';
        document.getElementById('veiculo-submit-button').textContent = 'Atualizar Veículo';
        document.getElementById('veiculo-submit-button').classList.remove('bg-blue-600');
        document.getElementById('veiculo-submit-button').classList.add('bg-green-600');
        document.getElementById('veiculo-cancel-button').classList.remove('hidden');

        editingVeiculoId = veiculo.id;
    } catch (error) {
        console.error('Erro ao carregar veículo para edição:', error);
        showMessage('Erro', 'Erro ao carregar veículo para edição. Verifique o console.', 'error');
    }
}

function cancelarEdicaoVeiculo() {
    document.getElementById('veiculo-form').reset();
    document.getElementById('veiculo-id').value = '';
    document.getElementById('veiculo-form-title').textContent = 'Cadastrar Novo Veículo';
    document.getElementById('veiculo-submit-button').textContent = 'Cadastrar Veículo';
    document.getElementById('veiculo-submit-button').classList.remove('bg-green-600');
    document.getElementById('veiculo-submit-button').classList.add('bg-blue-600');
    document.getElementById('veiculo-cancel-button').classList.add('hidden');
    editingVeiculoId = null;
}

async function handleVeiculoFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const veiculoData = {
        placa: formData.get('placa'),
        marca: formData.get('marca'),
        modelo: formData.get('modelo'),
        ano: parseInt(formData.get('ano')),
        cliente: {
            id: parseInt(formData.get('clienteId'))
        }
    };

    const method = editingVeiculoId ? 'PUT' : 'POST';
    const url = editingVeiculoId ? `${API_BASE_URL}/veiculos/${editingVeiculoId}` : `${API_BASE_URL}/veiculos`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculoData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        showMessage('Sucesso', `Veículo ${editingVeiculoId ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
        cancelarEdicaoVeiculo();
        carregarVeiculos();
    } catch (error) {
        console.error(`Erro ao ${editingVeiculoId ? 'atualizar' : 'cadastrar'} veículo:`, error);
        showMessage('Erro', `Erro ao ${editingVeiculoId ? 'atualizar' : 'cadastrar'} veículo. Verifique o console e os dados informados.`, 'error');
    }
}


// --- Funções para Ordens de Serviço ---

async function carregarOrdensDeServico() {
    const tableBody = document.getElementById('ordens-de-servico-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Carregando ordens de serviço...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/ordens-de-servico`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ordensDeServico = await response.json();

        tableBody.innerHTML = '';

        if (ordensDeServico.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhuma ordem de serviço cadastrada.</td></tr>`;
            return;
        }

        ordensDeServico.forEach(os => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${os.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${os.dataEntrada}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${os.dataSaida || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${os.status}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${os.descricaoProblema || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${os.veiculo ? os.veiculo.id : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-2 rounded-md px-2 py-1 border border-blue-600" onclick="editarOrdemDeServico(${os.id})">Editar</button>
                        <button class="text-red-600 hover:text-red-900 rounded-md px-2 py-1 border border-red-600" onclick="deletarOrdemDeServico(${os.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar ordens de serviço:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">Erro ao carregar ordens de serviço. Verifique o console.</td></tr>`;
    }
}

async function deletarOrdemDeServico(id) {
    const confirmed = await showConfirm('Confirmar Exclusão', `Tem certeza que deseja excluir a Ordem de Serviço com ID ${id}?`);
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-de-servico/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            showMessage('Sucesso', 'Ordem de Serviço excluída com sucesso!', 'success');
            carregarOrdensDeServico();
        } else if (response.status === 404) {
            showMessage('Erro', 'Ordem de Serviço não encontrada.', 'warning');
        } else {
            const errorData = await response.json();
            throw new Error(`Erro ao excluir Ordem de Serviço: ${response.status} - ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar ordem de serviço:', error);
        showMessage('Erro', 'Erro ao excluir ordem de serviço. Verifique o console.', 'error');
    }
}

async function editarOrdemDeServico(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/ordens-de-servico/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const os = await response.json();

        document.getElementById('os-id').value = os.id;
        document.getElementById('os-data-entrada').value = os.dataEntrada;
        document.getElementById('os-data-saida').value = os.dataSaida || '';
        document.getElementById('os-status').value = os.status;
        document.getElementById('os-descricao-problema').value = os.descricaoProblema;
        document.getElementById('os-observacoes').value = os.observacoes;
        document.getElementById('os-veiculo-id').value = os.veiculo ? os.veiculo.id : '';

        document.getElementById('ordem-de-servico-form-title').textContent = 'Editar Ordem de Serviço Existente';
        document.getElementById('os-submit-button').textContent = 'Atualizar Ordem de Serviço';
        document.getElementById('os-submit-button').classList.remove('bg-blue-600');
        document.getElementById('os-submit-button').classList.add('bg-green-600');
        document.getElementById('os-cancel-button').classList.remove('hidden');

        editingOrdemDeServicoId = os.id;
    } catch (error) {
        console.error('Erro ao carregar ordem de serviço para edição:', error);
        showMessage('Erro', 'Erro ao carregar ordem de serviço para edição. Verifique o console.', 'error');
    }
}

function cancelarEdicaoOrdemDeServico() {
    document.getElementById('ordem-de-servico-form').reset();
    document.getElementById('os-id').value = '';
    document.getElementById('ordem-de-servico-form-title').textContent = 'Cadastrar Nova Ordem de Serviço';
    document.getElementById('os-submit-button').textContent = 'Cadastrar Ordem de Serviço';
    document.getElementById('os-submit-button').classList.remove('bg-green-600');
    document.getElementById('os-submit-button').classList.add('bg-blue-600');
    document.getElementById('os-cancel-button').classList.add('hidden');
    editingOrdemDeServicoId = null;
}

async function handleOrdemDeServicoFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const osData = {
        dataEntrada: formData.get('dataEntrada'),
        dataSaida: formData.get('dataSaida') || null,
        status: formData.get('status'),
        descricaoProblema: formData.get('descricaoProblema'),
        observacoes: formData.get('observacoes'),
        veiculo: {
            id: parseInt(formData.get('veiculoId'))
        }
    };

    const method = editingOrdemDeServicoId ? 'PUT' : 'POST';
    const url = editingOrdemDeServicoId ? `${API_BASE_URL}/ordens-de-servico/${editingOrdemDeServicoId}` : `${API_BASE_URL}/ordens-de-servico`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(osData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        showMessage('Sucesso', `Ordem de Serviço ${editingOrdemDeServicoId ? 'atualizada' : 'cadastrada'} com sucesso!`, 'success');
        cancelarEdicaoOrdemDeServico();
        carregarOrdensDeServico();
    } catch (error) {
        console.error(`Erro ao ${editingOrdemDeServicoId ? 'atualizar' : 'cadastrar'} Ordem de Serviço:`, error);
        showMessage('Erro', `Erro ao ${editingOrdemDeServicoId ? 'atualizar' : 'cadastrar'} Ordem de Serviço. Verifique o console e os dados informados.`, 'error');
    }
}


// --- Funções para Peças ---

async function carregarPecas() {
    const tableBody = document.getElementById('pecas-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Carregando peças...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/pecas`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pecas = await response.json();

        tableBody.innerHTML = '';

        if (pecas.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhuma peça cadastrada.</td></tr>`;
            return;
        }

        pecas.forEach(peca => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${peca.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${peca.nome}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${peca.preco.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${peca.quantidadeEstoque}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-2 rounded-md px-2 py-1 border border-blue-600" onclick="editarPeca(${peca.id})">Editar</button>
                        <button class="text-red-600 hover:text-red-900 rounded-md px-2 py-1 border border-red-600" onclick="deletarPeca(${peca.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar peças:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">Erro ao carregar peças. Verifique o console.</td></tr>`;
    }
}

async function deletarPeca(id) {
    const confirmed = await showConfirm('Confirmar Exclusão', `Tem certeza que deseja excluir a peça com ID ${id}?`);
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/pecas/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            showMessage('Sucesso', 'Peça excluída com sucesso!', 'success');
            carregarPecas();
        } else if (response.status === 404) {
            showMessage('Erro', 'Peça não encontrada.', 'warning');
        } else {
            const errorData = await response.json();
            throw new Error(`Erro ao excluir peça: ${response.status} - ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar peça:', error);
        showMessage('Erro', 'Erro ao excluir peça. Verifique o console.', 'error');
    }
}

async function editarPeca(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/pecas/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const peca = await response.json();

        document.getElementById('peca-id').value = peca.id;
        document.getElementById('peca-nome').value = peca.nome;
        document.getElementById('peca-preco').value = peca.preco;
        document.getElementById('peca-quantidade').value = peca.quantidadeEstoque;

        document.getElementById('peca-form-title').textContent = 'Editar Peça Existente';
        document.getElementById('peca-submit-button').textContent = 'Atualizar Peça';
        document.getElementById('peca-submit-button').classList.remove('bg-blue-600');
        document.getElementById('peca-submit-button').classList.add('bg-green-600');
        document.getElementById('peca-cancel-button').classList.remove('hidden');

        editingPecaId = peca.id;
    } catch (error) {
        console.error('Erro ao carregar peça para edição:', error);
        showMessage('Erro', 'Erro ao carregar peça para edição. Verifique o console.', 'error');
    }
}

function cancelarEdicaoPeca() {
    document.getElementById('peca-form').reset();
    document.getElementById('peca-id').value = '';
    document.getElementById('peca-form-title').textContent = 'Cadastrar Nova Peça';
    document.getElementById('peca-submit-button').textContent = 'Cadastrar Peça';
    document.getElementById('peca-submit-button').classList.remove('bg-green-600');
    document.getElementById('peca-submit-button').classList.add('bg-blue-600');
    document.getElementById('peca-cancel-button').classList.add('hidden');
    editingPecaId = null;
}

async function handlePecaFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const pecaData = {
        nome: formData.get('nome'),
        preco: parseFloat(formData.get('preco')),
        quantidadeEstoque: parseInt(formData.get('quantidadeEstoque'))
    };

    const method = editingPecaId ? 'PUT' : 'POST';
    const url = editingPecaId ? `${API_BASE_URL}/pecas/${editingPecaId}` : `${API_BASE_URL}/pecas`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pecaData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        showMessage('Sucesso', `Peça ${editingPecaId ? 'atualizada' : 'cadastrada'} com sucesso!`, 'success');
        cancelarEdicaoPeca();
        carregarPecas();
    } catch (error) {
        console.error(`Erro ao ${editingPecaId ? 'atualizar' : 'cadastrar'} peça:`, error);
        showMessage('Erro', `Erro ao ${editingPecaId ? 'atualizar' : 'cadastrar'} peça. Verifique o console e os dados informados.`, 'error');
    }
}


// --- Funções para Serviços ---

async function carregarServicos() {
    const tableBody = document.getElementById('servicos-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Carregando serviços...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/servicos`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const servicos = await response.json();

        tableBody.innerHTML = '';

        if (servicos.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum serviço cadastrado.</td></tr>`;
            return;
        }

        servicos.forEach(servico => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${servico.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${servico.nomeServico}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${servico.descricao || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${servico.valorMaoDeObra.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-2 rounded-md px-2 py-1 border border-blue-600" onclick="editarServico(${servico.id})">Editar</button>
                        <button class="text-red-600 hover:text-red-900 rounded-md px-2 py-1 border border-red-600" onclick="deletarServico(${servico.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">Erro ao carregar serviços. Verifique o console.</td></tr>`;
    }
}

async function deletarServico(id) {
    const confirmed = await showConfirm('Confirmar Exclusão', `Tem certeza que deseja excluir o serviço com ID ${id}?`);
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/servicos/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            showMessage('Sucesso', 'Serviço excluído com sucesso!', 'success');
            carregarServicos();
        } else if (response.status === 404) {
            showMessage('Erro', 'Serviço não encontrado.', 'warning');
        } else {
            const errorData = await response.json();
            throw new Error(`Erro ao excluir serviço: ${response.status} - ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar serviço:', error);
        showMessage('Erro', 'Erro ao excluir serviço. Verifique o console.', 'error');
    }
}

async function editarServico(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/servicos/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const servico = await response.json();

        document.getElementById('servico-id').value = servico.id;
        document.getElementById('servico-nome').value = servico.nomeServico;
        document.getElementById('servico-descricao').value = servico.descricao;
        document.getElementById('servico-valor').value = servico.valorMaoDeObra;

        document.getElementById('servico-form-title').textContent = 'Editar Serviço Existente';
        document.getElementById('servico-submit-button').textContent = 'Atualizar Serviço';
        document.getElementById('servico-submit-button').classList.remove('bg-blue-600');
        document.getElementById('servico-submit-button').classList.add('bg-green-600');
        document.getElementById('servico-cancel-button').classList.remove('hidden');

        editingServicoId = servico.id;
    } catch (error) {
        console.error('Erro ao carregar serviço para edição:', error);
        showMessage('Erro', 'Erro ao carregar serviço para edição. Verifique o console.', 'error');
    }
}

function cancelarEdicaoServico() {
    document.getElementById('servico-form').reset();
    document.getElementById('servico-id').value = '';
    document.getElementById('servico-form-title').textContent = 'Cadastrar Novo Serviço';
    document.getElementById('servico-submit-button').textContent = 'Cadastrar Serviço';
    document.getElementById('servico-submit-button').classList.remove('bg-green-600');
    document.getElementById('servico-submit-button').classList.add('bg-blue-600');
    document.getElementById('servico-cancel-button').classList.add('hidden');
    editingServicoId = null;
}

async function handleServicoFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const servicoData = {
        nomeServico: formData.get('nomeServico'),
        descricao: formData.get('descricao'),
        valorMaoDeObra: parseFloat(formData.get('valorMaoDeObra'))
    };

    const method = editingServicoId ? 'PUT' : 'POST';
    const url = editingServicoId ? `${API_BASE_URL}/servicos/${editingServicoId}` : `${API_BASE_URL}/servicos`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(servicoData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        showMessage('Sucesso', `Serviço ${editingServicoId ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
        cancelarEdicaoServico();
        carregarServicos();
    } catch (error) {
        console.error(`Erro ao ${editingServicoId ? 'atualizar' : 'cadastrar'} serviço:`, error);
        showMessage('Erro', `Erro ao ${editingServicoId ? 'atualizar' : 'cadastrar'} serviço. Verifique o console e os dados informados.`, 'error');
    }
}


// --- Funções para Itens da Ordem de Serviço ---

async function carregarItensOS() {
    const tableBody = document.getElementById('itens-os-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Carregando itens da OS...</td></tr>`;

    try {
        const response = await fetch(`${API_BASE_URL}/itens-ordem-de-servico`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const itensOs = await response.json();

        tableBody.innerHTML = '';

        if (itensOs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhum item da OS cadastrado.</td></tr>`;
            return;
        }

        itensOs.forEach(item => {
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.quantidade}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.ordemDeServico ? item.ordemDeServico.id : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.peca ? item.peca.id : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.servico ? item.servico.id : 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-2 rounded-md px-2 py-1 border border-blue-600" onclick="editarItemOS(${item.id})">Editar</button>
                        <button class="text-red-600 hover:text-red-900 rounded-md px-2 py-1 border border-red-600" onclick="deletarItemOS(${item.id})">Excluir</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erro ao carregar itens da OS:', error);
        tableBody.innerHTML = `<tr><td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center">Erro ao carregar itens da OS. Verifique o console.</td></tr>`;
    }
}

async function deletarItemOS(id) {
    const confirmed = await showConfirm('Confirmar Exclusão', `Tem certeza que deseja excluir o Item da OS com ID ${id}?`);
    if (!confirmed) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/itens-ordem-de-servico/${id}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            showMessage('Sucesso', 'Item da OS excluído com sucesso!', 'success');
            carregarItensOS();
        } else if (response.status === 404) {
            showMessage('Erro', 'Item da OS não encontrado.', 'warning');
        } else {
            const errorData = await response.json();
            throw new Error(`Erro ao excluir item da OS: ${response.status} - ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao deletar item da OS:', error);
        showMessage('Erro', 'Erro ao excluir item da OS. Verifique o console.', 'error');
    }
}

async function editarItemOS(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/itens-ordem-de-servico/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const item = await response.json();

        document.getElementById('item-os-id').value = item.id;
        document.getElementById('item-os-quantidade').value = item.quantidade;
        document.getElementById('item-os-ordem-id').value = item.ordemDeServico ? item.ordemDeServico.id : '';

        if (item.peca && item.peca.id) {
            document.getElementById('item-os-tipo').value = 'peca';
            document.getElementById('item-os-peca-id').value = item.peca.id;
            document.getElementById('item-os-peca-group').classList.remove('hidden');
            document.getElementById('item-os-servico-group').classList.add('hidden');
        } else if (item.servico && item.servico.id) {
            document.getElementById('item-os-tipo').value = 'servico';
            document.getElementById('item-os-servico-id').value = item.servico.id;
            document.getElementById('item-os-servico-group').classList.remove('hidden');
            document.getElementById('item-os-peca-group').classList.add('hidden');
        } else {
            document.getElementById('item-os-tipo').value = '';
            document.getElementById('item-os-peca-group').classList.add('hidden');
            document.getElementById('item-os-servico-group').classList.add('hidden');
        }

        document.getElementById('item-os-form-title').textContent = 'Editar Item da Ordem de Serviço';
        document.getElementById('item-os-submit-button').textContent = 'Atualizar Item';
        document.getElementById('item-os-submit-button').classList.remove('bg-blue-600');
        document.getElementById('item-os-submit-button').classList.add('bg-green-600');
        document.getElementById('item-os-cancel-button').classList.remove('hidden');

        editingItemOsId = item.id;
    } catch (error) {
        console.error('Erro ao carregar item da OS para edição:', error);
        showMessage('Erro', 'Erro ao carregar item da OS para edição. Verifique o console.', 'error');
    }
}

function cancelarEdicaoItemOS() {
    document.getElementById('item-os-form').reset();
    document.getElementById('item-os-id').value = '';
    document.getElementById('item-os-form-title').textContent = 'Adicionar Novo Item à Ordem de Serviço';
    document.getElementById('item-os-submit-button').textContent = 'Adicionar Item';
    document.getElementById('item-os-submit-button').classList.remove('bg-green-600');
    document.getElementById('item-os-submit-button').classList.add('bg-blue-600');
    document.getElementById('item-os-cancel-button').classList.add('hidden');
    document.getElementById('item-os-peca-group').classList.add('hidden');
    document.getElementById('item-os-servico-group').classList.add('hidden');
    editingItemOsId = null;
}

async function handleItemOsFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const itemOsData = {
        quantidade: parseInt(formData.get('quantidade')),
        ordemDeServico: {
            id: parseInt(formData.get('ordemDeServicoId'))
        },
        peca: null,
        servico: null
    };

    const tipoItem = formData.get('tipoItem');
    if (tipoItem === 'peca') {
        itemOsData.peca = { id: parseInt(formData.get('pecaId')) };
    } else if (tipoItem === 'servico') {
        itemOsData.servico = { id: parseInt(formData.get('servicoId')) };
    } else {
        showMessage('Atenção', 'Por favor, selecione se o item é uma Peça ou um Serviço.', 'warning');
        return;
    }

    const method = editingItemOsId ? 'PUT' : 'POST';
    const url = editingItemOsId ? `${API_BASE_URL}/itens-ordem-de-servico/${editingItemOsId}` : `${API_BASE_URL}/itens-ordem-de-servico`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemOsData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        showMessage('Sucesso', `Item da Ordem de Serviço ${editingItemOsId ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
        cancelarEdicaoItemOS();
        carregarItensOS();
    } catch (error) {
        console.error(`Erro ao ${editingItemOsId ? 'atualizar' : 'cadastrar'} item da OS:`, error);
        showMessage('Erro', `Erro ao ${editingItemOsId ? 'atualizar' : 'cadastrar'} item da OS. Verifique o console e os dados informados.`, 'error');
    }
}


// --- Inicialização da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrega a seção "Clientes" por padrão ao carregar a página
    loadSection('clientes');
});
