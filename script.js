const stock1Input = document.getElementById("stock1");
const stock2Input = document.getElementById("stock2");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const sistolInput = document.getElementById("sistol");
const diastolInput = document.getElementById("diastol");
const addPatientBtn = document.getElementById("addPatient");
const finishBtn = document.getElementById("finish");

const messages = document.getElementById("messages");
const patientsTable = document.getElementById("patientsTable");
const tbody = patientsTable.querySelector("tbody");

const summary = document.getElementById("summary");
const totalEl = document.getElementById("total");
const m1countEl = document.getElementById("m1count");
const m2countEl = document.getElementById("m2count");
const m1pctEl = document.getElementById("m1pct");
const m2pctEl = document.getElementById("m2pct");

let stock1 = 0;
let stock2 = 0;
let initialized = false;

let totalPatients = 0;
let m1count = 0;
let m2count = 0;

let patients = [];

function resetAll() {
  stock1 = 0;
  stock2 = 0;
  initialized = false;

  totalPatients = 0;
  m1count = 0;
  m2count = 0;

  patients = [];
  tbody.innerHTML = "";

  patientsTable.style.display = "none";
  summary.style.display = "none";

  messages.innerHTML = "";

  stock1Input.disabled = false;
  stock2Input.disabled = false;

  startBtn.disabled = false;
  addPatientBtn.disabled = true;
  finishBtn.disabled = true;
}

startBtn.addEventListener("click", () => {
  const s1 = Number(stock1Input.value);
  const s2 = Number(stock2Input.value);

  if (s1 < 0 || s2 < 0) {
    messages.innerHTML = `<div class="notice">Existencias invalidas.</div>`;
    return;
  }

  stock1 = s1;
  stock2 = s2;
  initialized = true;

  stock1Input.disabled = true;
  stock2Input.disabled = true;
  startBtn.disabled = true;

  addPatientBtn.disabled = false;
  finishBtn.disabled = false;

  messages.innerHTML = `<div class="ok">Sistema inicializado.</div>`;
});

resetBtn.addEventListener("click", resetAll);

function categorize(s, d) {
  if (s < 69 && d < 48) return { cat: "hipotension", med: 2, dosis: 6 };
  if (s >= 69 && s < 98 && d >= 48 && d < 66) return { cat: "Optima", med: null, dosis: 0 };
  if (s >= 98 && s < 143 && d >= 66 && d < 92) return { cat: "Comun", med: null, dosis: 0 };
  if (s >= 143 && s < 177 && d >= 92 && d < 124) return { cat: "Pre HTA", med: 1, dosis: 6 };
  if (s >= 177 && s < 198 && d >= 124 && d < 142) return { cat: "HTAG1", med: 1, dosis: 10 };
  if (s >= 198 && s < 246 && d >= 142 && d < 169) return { cat: "HTAG2", med: 1, dosis: 18 };
  if (s >= 246 && d >= 169) return { cat: "HTAG3", med: 1, dosis: 35 };
  if (s >= 162 && d < 86) return { cat: "HTASS", med: 1, dosis: 17 };

  return { cat: "No definida", med: null, dosis: 0 };
}

addPatientBtn.addEventListener("click", () => {
  if (!initialized) {
    messages.innerHTML = `<div class="notice">Inicialice el sistema primero.</div>`;
    return;
  }

  if (stock1 <= 0 || stock2 <= 0) {
    messages.innerHTML = `<div class="notice">Se agotaron los medicamentos.</div>`;
    return;
  }

  const s = Number(sistolInput.value);
  const d = Number(diastolInput.value);

  if (isNaN(s) || isNaN(d)) {
    messages.innerHTML = `<div class="notice">Valores invalidos.</div>`;
    return;
  }

  const res = categorize(s, d);

  let medGiven = "Ninguno";
  let dosis = 0;

  if (res.med === 1 && stock1 >= res.dosis) {
    medGiven = "Medicamento 1";
    dosis = res.dosis;
    stock1 -= res.dosis;
    m1count++;
  } else if (res.med === 2 && stock2 >= res.dosis) {
    medGiven = "Medicamento 2";
    dosis = res.dosis;
    stock2 -= res.dosis;
    m2count++;
  }

  totalPatients++;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${totalPatients}</td>
    <td>${s}</td>
    <td>${d}</td>
    <td>${res.cat}</td>
    <td>${medGiven}</td>
    <td>${dosis}</td>
    <td>${stock1}</td>
    <td>${stock2}</td>
  `;

  tbody.appendChild(tr);
  patientsTable.style.display = "";

  messages.innerHTML = `<div class="ok">Paciente agregado.</div>`;
});

finishBtn.addEventListener("click", () => {
  summary.style.display = "";

  totalEl.textContent = totalPatients;
  m1countEl.textContent = m1count;
  m2countEl.textContent = m2count;

  m1pctEl.textContent = totalPatients ? (m1count / totalPatients * 100).toFixed(2) + "%" : "0.00%";
  m2pctEl.textContent = totalPatients ? (m2count / totalPatients * 100).toFixed(2) + "%" : "0.00%";

  messages.innerHTML = `<div class="ok">Resumen generado.</div>`;
});

resetAll();
