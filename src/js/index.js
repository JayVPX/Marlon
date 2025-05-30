import * as cookie from 'cookie-es';
  

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith("/") || path.endsWith("/index.html")){
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("toggle-register");
    const loginBtn = document.getElementById("toggle-login");

    registerBtn.addEventListener("click", () => {
      container.classList.add("active");
    });
    loginBtn.addEventListener("click", () => {
      container.classList.remove("active");
    });
  } 

  if (path.endsWith('/pagInicial.html')) {
    const boasVindas = document.getElementById("greeting");
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      boasVindas.textContent = `Olá, ${user.nome}`; 
    }
  }

  if (path.endsWith('/list.html')) {
    const tbodyUsers = document.getElementById("listagem-usuarios");

    function carregarUsuarios() {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      tbodyUsers.innerHTML = '';
      usuarios.forEach((user, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.nome}</td>
          <td>${user.usuario}</td>
          <td>${user.email}</td>
          <td>${user.senha}</td>
          
          <td>
            <button onclick="editarUsuario(${idx})">Editar</button>
            <button onclick="excluirUsuario(${idx})">Excluir</button>
          </td>
        `;
        tbodyUsers.appendChild(tr);
      });
    }

    window.excluirUsuario = function(idx) {
      let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.splice(idx, 1);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      carregarUsuarios();
    }

    window.editarUsuario = function(idx) {
      let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      let user = usuarios[idx];
      const nome = prompt("Novo nome:", user.nome) || user.nome;
      const usuario = prompt("Novo usuário:", user.usuario) || user.usuario;
      const email = prompt("Novo email:", user.email) || user.email;
      const cpf = prompt("Novo CPF:", user.cpf) || user.cpf;
      const senha = prompt("Nova senha:", user.senha) || user.senha;
      usuarios[idx] = { nome, usuario, email, senha };
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      carregarUsuarios();
    }

    carregarUsuarios();
  }
});


// Cadastro Usuarios
let usuarios = [];
if (localStorage.getItem("usuarios")) {
  // verifica se o local storage existe e converte o que houver lá para objeto e guarda no objeto de usuários
  usuarios = JSON.parse(localStorage.getItem("usuarios"));
}

function cadastrar() {
  // capturar os dados do input
  let salvaNome = document.querySelector("#nomeR").value;
  let salvaUsuario = document.querySelector("#usuarioR").value;
  let salvaEmail = document.querySelector("#emailR").value;
  let salvaSenha = document.querySelector("#senhaR").value;
  let salvarCpf = document.querySelector("#cpfR").value;

  // criar um objeto com os dados do input
  let usuario = {
    nome: salvaNome,
    usuario: salvaUsuario,
    email: salvaEmail,
    senha: salvaSenha,
    cpf: salvarCpf
  };

  // adicionar o usuario criado a lista de usuários
  usuarios.push(usuario);

  // converte para stringify e guarda no local storage
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function login() {
  usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuario = document.getElementById("usuarioL").value.trim();
  const senha = document.getElementById("senhaL").value.trim();

  const achado = usuarios.find(u => u.usuario === usuario && u.senha === senha);
  const cookies = cookie.parse(document.cookie || '');


  if (achado) {
    sessionStorage.setItem('user', JSON.stringify(achado));
    sessionStorage.setItem('isLoggedIn', 'true');
  // também gravamos um cookie pra middleware:
    document.cookie = 'isLoggedIn=true; Path=/; SameSite=Lax';
    window.location.href = '/pages/pagInicial.html';

  } else {
    alert("Usuário ou senha incorretos.");
  }
  
}
window.login = login;
window.cadastrar = cadastrar;
