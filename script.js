const MAX = 10;

let fila       = new Array(MAX).fill(null);
let inicio     = 0;
let fim        = 0;
let quantidade = 0;
let atendidos  = [];

function salvarHistorico() {
  localStorage.setItem("historicoAtendidos", JSON.stringify(atendidos));
}

function carregarHistorico() {
  const dados = localStorage.getItem("historicoAtendidos");

  if (dados) {
    atendidos = JSON.parse(dados);
  }
}

function filaCheia() { return quantidade === MAX; }
function filaVazia()  { return quantidade === 0; }

function getOrdenados() {
  const lista = [];
  for (let i = 0; i < quantidade; i++) {
    lista.push({ paciente: fila[(inicio + i) % MAX], indiceReal: (inicio + i) % MAX });
  }
  return lista;
}

function ocultarCPF(cpf) {
  return cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "***.$2.$3-**");
}

function adicionarPaciente() {
  if (filaCheia()) { mostrarToast("Fila cheia! Máximo de 10 pacientes.", "err"); return; }

  const nome  = document.getElementById("inp-nome").value.trim();
  const cpf   = document.getElementById("inp-cpf").value.trim();
  const idade = document.getElementById("inp-idade").value.trim();

  if (!nome || !cpf || !idade) { mostrarToast("Preencha todos os campos antes de adicionar.", "warn"); return; }

  for (let i = 0; i < quantidade; i++) {
    if (fila[(inicio + i) % MAX].cpf === cpf) { mostrarToast("Esse CPF já está na fila!", "warn"); return; }
  }

  fila[fim] = { nome, cpf, idade };
  fim = (fim + 1) % MAX;
  quantidade++;

  document.getElementById("inp-nome").value  = "";
  document.getElementById("inp-cpf").value   = "";
  document.getElementById("inp-idade").value = "";
  document.getElementById("inp-nome").focus();

  mostrarToast(nome + " adicionado(a) à fila!", "ok");
  renderTudo();
}

function chamarPaciente() {
  if (filaVazia()) { mostrarToast("Fila vazia! Nenhum paciente para chamar.", "err"); return; }

  const paciente = fila[inicio];
  fila[inicio] = null;
  inicio = (inicio + 1) % MAX;
  quantidade--;
  atendidos.push(paciente);
  salvarHistorico();
  mostrarToast("Chamando para consulta: " + paciente.nome, "warn");
  renderTudo();
}

function mostrarProximo() {
  if (filaVazia()) { mostrarToast("Fila vazia!", "err"); return; }
  mostrarToast("Próximo: " + fila[inicio].nome + " — CPF: " + ocultarCPF(fila[inicio].cpf), "info");
}

function buscarCPF() {
  const cpfBusca = document.getElementById("inp-cpf-busca").value.trim();
  if (!cpfBusca) { mostrarToast("Digite um CPF para buscar.", "warn"); return; }

  for (let i = 0; i < quantidade; i++) {
    const idx = (inicio + i) % MAX;
    if (fila[idx].cpf === cpfBusca) {
      mostrarToast("Encontrado! " + fila[idx].nome + " — Posição " + (i + 1) + "º na fila", "info");
      document.getElementById("inp-cpf-busca").value = "";
      return;
    }
  }
  mostrarToast("CPF não encontrado na fila.", "err");
}

function removerDesistente() {
  const cpfRemover = document.getElementById("inp-cpf-remover").value.trim();

  if (!cpfRemover) {
    mostrarToast("Digite o CPF do paciente que desistiu.", "warn");
    return;
  }

  if (filaVazia()) {
    mostrarToast("Fila vazia! Não há paciente para remover.", "err");
    return;
  }

  const ordenados = getOrdenados();
  const novaFila = new Array(MAX).fill(null);
  let novaQtd = 0;
  let encontrado = false;
  let removido = null;

  for (let i = 0; i < ordenados.length; i++) {
    const paciente = ordenados[i].paciente;

    if (paciente.cpf === cpfRemover) {
      encontrado = true;
      removido = paciente;
    } else {
      novaFila[novaQtd] = paciente;
      novaQtd++;
    }
  }

  if (!encontrado) {
    mostrarToast("CPF não encontrado na fila.", "err");
    return;
  }

  fila = novaFila;
  inicio = 0;
  fim = novaQtd % MAX;
  quantidade = novaQtd;

  document.getElementById("inp-cpf-remover").value = "";

  mostrarToast(removido.nome + " foi removido(a) da fila por desistência.", "warn");
  renderTudo();
}

function reiniciarSistema() {
  fila = new Array(MAX).fill(null);
  inicio = 0;
  fim = 0;
  quantidade = 0;
  atendidos = [];

  localStorage.removeItem("historicoAtendidos");

  mostrarToast("Sistema reiniciado com sucesso!", "info");
  renderTudo();
}

function renderFilaCircular() {
  const area = document.getElementById("fila-visual");
  area.innerHTML = "";

  for (let i = 0; i < MAX; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";

    const isInicio = !filaVazia() && i === inicio;
    const isFim    = i === fim;

    if (isInicio) slot.classList.add("is-inicio");
    if (isFim && !filaVazia()) slot.classList.add("is-fim");

    const idxEl = document.createElement("span");
    idxEl.className = "slot-index";
    idxEl.textContent = "[" + i + "]";
    slot.appendChild(idxEl);

    if (fila[i]) {
      slot.classList.add("ocupado");

      const tags = document.createElement("div");
      tags.className = "slot-tags";
      if (isInicio) {
        const t = document.createElement("span");
        t.className = "tag tag-inicio";
        t.textContent = "início";
        tags.appendChild(t);
      }
      if (isFim && !filaVazia()) {
        const t = document.createElement("span");
        t.className = "tag tag-fim";
        t.textContent = "fim";
        tags.appendChild(t);
      }
      slot.appendChild(tags);

      const nome = document.createElement("div");
      nome.className = "slot-nome";
      nome.textContent = fila[i].nome;
      slot.appendChild(nome);

      const cpf = document.createElement("div");
      cpf.className = "slot-cpf";
      cpf.textContent = ocultarCPF(fila[i].cpf);
      slot.appendChild(cpf);

      const idade = document.createElement("div");
      idade.className = "slot-idade";
      idade.textContent = fila[i].idade + " anos";
      slot.appendChild(idade);

    } else {
      slot.classList.add("vazio");

      if (isFim && !filaCheia()) {
        const t = document.createElement("span");
        t.className = "tag tag-fim";
        t.style.alignSelf = "flex-start";
        t.textContent = "próx. entrada";
        slot.appendChild(t);
      }

      const label = document.createElement("div");
      label.className = "slot-vazio-label";
      label.textContent = "vazio";
      slot.appendChild(label);
    }

    area.appendChild(slot);
  }
}

function renderLista() {
  const area = document.getElementById("lista-pacientes");
  area.innerHTML = "";

  const ordenados = getOrdenados();

  if (ordenados.length === 0) {
    area.innerHTML = '<div class="lista-vazia">Nenhum paciente na fila ainda.</div>';
    return;
  }

  ordenados.forEach(function({ paciente, indiceReal }, i) {
    const primeiro = i === 0;
    const row = document.createElement("div");
    row.className = "paciente-row" + (primeiro ? " primeiro" : "");

    const pos = document.createElement("div");
    pos.className = "p-pos";
    pos.textContent = i + 1;

    const info = document.createElement("div");
    info.className = "p-info";
    info.innerHTML =
      '<div class="p-nome">' + paciente.nome + '</div>' +
      '<div class="p-detalhes">' +
        '<span class="p-chip">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>' +
          ocultarCPF(paciente.cpf) +
        '</span>' +
        '<span class="p-chip">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>' +
          paciente.idade + ' anos' +
        '</span>' +
      '</div>';

    const lado = document.createElement("div");
    lado.className = "p-lado";
    lado.innerHTML =
      '<span class="p-slot">slot [' + indiceReal + ']</span>' +
      '<span class="' + (primeiro ? 'p-badge-primeiro' : 'p-badge-numero') + '">' +
        (primeiro ? 'próximo' : '#' + (i + 1)) +
      '</span>';

    row.appendChild(pos);
    row.appendChild(info);
    row.appendChild(lado);
    area.appendChild(row);
  });
}

function renderAtendidos() {
  const area = document.getElementById("lista-atendidos");
  area.innerHTML = "";

  if (atendidos.length === 0) {
    area.innerHTML = '<div class="lista-vazia">Nenhum paciente atendido ainda.</div>';
    return;
  }

  atendidos.forEach(function(paciente, i) {
    const row = document.createElement("div");
    row.className = "paciente-row";

    const pos = document.createElement("div");
    pos.className = "p-pos";
    pos.textContent = i + 1;

    const info = document.createElement("div");
    info.className = "p-info";
    info.innerHTML =
      '<div class="p-nome">' + paciente.nome + '</div>' +
      '<div class="p-detalhes">' +
        '<span class="p-chip">' + ocultarCPF(paciente.cpf) + '</span>' +
        '<span class="p-chip">' + paciente.idade + ' anos</span>' +
      '</div>';

    const lado = document.createElement("div");
    lado.className = "p-lado";
    lado.innerHTML = '<span class="p-badge-numero">atendido</span>';

    row.appendChild(pos);
    row.appendChild(info);
    row.appendChild(lado);
    area.appendChild(row);
  });
}

function renderTudo() {
  document.getElementById("stat-fila").textContent = quantidade;
  document.getElementById("stat-atend").textContent = atendidos.length;
  renderFilaCircular();
  renderLista();
  renderAtendidos();
}

let toastTimer = null;
function mostrarToast(msg, tipo) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast " + tipo;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { el.className = "toast hidden"; }, 5000);
}

function maskCPF(el) {
  let v = el.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/,                    "$1.$2");
  v = v.replace(/(\d{3})\.(\d{3})(\d)/,           "$1.$2.$3");
  v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  el.value = v;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("btn-adicionar").addEventListener("click", adicionarPaciente);
  document.getElementById("btn-chamar").addEventListener("click", chamarPaciente);
  document.getElementById("btn-proximo").addEventListener("click", mostrarProximo);
  document.getElementById("btn-buscar").addEventListener("click", buscarCPF);
  document.getElementById("btn-remover").addEventListener("click", removerDesistente);
  document.getElementById("btn-reset").addEventListener("click", reiniciarSistema);
  document.getElementById("inp-cpf").addEventListener("input", function(e) { maskCPF(e.target); });
  document.getElementById("inp-cpf-busca").addEventListener("input", function(e) { maskCPF(e.target); });
  document.getElementById("inp-cpf-remover").addEventListener("input", function(e) { maskCPF(e.target); });
  document.getElementById("inp-idade").addEventListener("keydown", function(e) {
    if (e.key === "Enter") adicionarPaciente();
  });
  document.getElementById("inp-cpf-busca").addEventListener("keydown", function(e) {
    if (e.key === "Enter") buscarCPF();
  });
  document.getElementById("inp-cpf-remover").addEventListener("keydown", function(e) {
  if (e.key === "Enter") removerDesistente();
  });
  carregarHistorico();
  renderTudo();
});