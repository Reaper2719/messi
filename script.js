
let db;
const request = indexedDB.open("modulo1_db", 1);

request.onerror = () => console.error("No se pudo abrir IndexedDB");
request.onsuccess = (event) => db = event.target.result;
request.onupgradeneeded = (event) => {
  db = event.target.result;
  db.createObjectStore("registros", { autoIncrement: true });
};

document.getElementById("modulo1-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
    if (data[key]) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  const tx = db.transaction("registros", "readwrite");
  tx.objectStore("registros").add(data);
  tx.oncomplete = () => {
    alert("Registro guardado con éxito");
    limpiarFormulario();
    mostrarRegistros(); // actualiza el JSON exportado también
  };
});

document.getElementById("limpiar-btn").addEventListener("click", limpiarFormulario);

function limpiarFormulario() {
  document.getElementById("modulo1-form").reset();
  const inputs = document.querySelectorAll("input[type=text]");
  inputs.forEach(input => input.value = "");
}

document.getElementById("exportar-btn").addEventListener("click", mostrarRegistros);

function mostrarRegistros() {
  const tx = db.transaction("registros", "readonly");
  const store = tx.objectStore("registros");
  const request = store.getAll();
  request.onsuccess = () => {
    const data = JSON.stringify(request.result, null, 2);
    const area = document.getElementById("json-output");
    if (area) area.value = data;
  };
}

document.getElementById("copiar-json-btn").addEventListener("click", function() {
  const jsonArea = document.getElementById("json-output");
  if (!jsonArea.value) {
    alert("No hay datos para copiar.");
    return;
  }
  jsonArea.select();
  document.execCommand("copy");
  alert("JSON copiado al portapapeles.");
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('[SW] registrado', reg))
      .catch(err => console.error('[SW] error de registro', err));
  });
}
