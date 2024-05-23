document.addEventListener('DOMContentLoaded', function () {
    const listaContatos = document.getElementById('contatos-lista');
    const contato = document.getElementById('contato');
    const contatoIdField = document.getElementById('id-contato');
    const adBotao = document.getElementById('ad-button');
    const slBotao = document.getElementById('sl-button');

    function carregarContatos() {
        fetch('http://localhost:8080/contatos')
            .then(response => response.json())
            .then(data => {
                listaContatos.innerHTML = '';
                data.forEach(contato => {
                    const contatoDiv = document.createElement('div');
                    contatoDiv.classList.add('contact-item');
                    contatoDiv.innerHTML = `
                        <img src="${contato.foto}" alt="Foto de ${contato.nome}" class="contact-foto">
                        <div class="contact-detalhes">
                            <div class="contact-name">${contato.nome}</div>
                            <div class="contact-info">Email: ${contato.email}</div>
                            <div class="contact-info">Telefone: ${contato.telefone || 'N/A'}</div>
                            <div class="contact-info">Endereço: ${contato.endereco || 'N/A'}</div>
                        </div>
                        <div class="contact-actions">
                            <button class="editar-button" data-id="${contato.id}">Editar Contato</button>
                            <button class="excluir-button" data-id="${contato.id}">Excluir Contato</button>
                        </div>
                    `;
                    listaContatos.appendChild(contatoDiv);
                });
                document.querySelectorAll('.editar-button').forEach(btn => {
                    btn.addEventListener('click', () => editarContato(btn.getAttribute('data-id')));
                });

                document.querySelectorAll('.excluir-button').forEach(btn => {
                    btn.addEventListener('click', () => excluirContato(btn.getAttribute('data-id')));
                });
            })
            .catch(error => console.error('Erro ao carregar contatos!', error));
    }
    carregarContatos();
    contato.addEventListener('submit', function (event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const foto = document.getElementById('foto').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        fetch('http://localhost:8080/contatos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, foto, telefone, endereco })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao adicionar contato!');
        })
        .then(() => {
            carregarContatos();
            contato.reset();
        })
        .catch(error => console.error('Erro ao adicionar contato!', error));
    });

    function editarContato(id) {
        fetch(`http://localhost:8080/contatos/${id}`)
            .then(response => response.json())
            .then(contato => {
                document.getElementById('nome').value = contato.nome;
                document.getElementById('email').value = contato.email;
                document.getElementById('foto').value = contato.foto;
                document.getElementById('telefone').value = contato.telefone;
                document.getElementById('endereco').value = contato.endereco;
                contatoIdField.value = contato.id;
                adBotao.style.display = 'none';
                slBotao.style.display = 'inline-block';
            })
            .catch(error => console.error('Erro ao carregar contato!', error));
    }

    slBotao.addEventListener('click', function () {
        const id = contatoIdField.value;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const foto = document.getElementById('foto').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        fetch(`http://localhost:8080/contatos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, foto, telefone, endereco })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao editar contato!');
        })
        .then(() => {
            carregarContatos();
            contato.reset();
            contatoIdField.value = '';

            adBotao.style.display = 'inline-block';
            slBotao.style.display = 'none';
        })
        .catch(error => console.error('Erro ao editar contato!', error));
    });

    function excluirContato(id) {
        if (confirm("Certeza que deseja excluir este contato?")) {
            fetch(`http://localhost:8080/contatos/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    console.log(`Contato com ID ${id} excluído com sucesso!`);
                    carregarContatos();
                } else {
                    response.text().then(errorMessage => {
                        throw new Error(`Erro ao excluir contato com ID ${id}: ${errorMessage}`);
                    });
                }
            })
            .catch(error => console.error(error));
        }
    }
});
