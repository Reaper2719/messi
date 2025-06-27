let db;
const request = indexedDB.open("modulo1_db", 1);
request.onerror = () => console.error("No se pudo abrir IndexedDB");
request.onsuccess = (e) => db = e.target.result;
request.onupgradeneeded = (e) => {
  db = e.target.result;
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
    alert("Registro guardado");
    limpiarFormulario();
    mostrarDatos();
  };
});

document.getElementById("limpiar-btn").addEventListener("click", limpiarFormulario);
function limpiarFormulario() {
  document.getElementById("modulo1-form").reset();
}

document.getElementById("exportar-btn").addEventListener("click", mostrarDatos);
document.getElementById("copiar-json-btn").addEventListener("click", () => {
  const area = document.getElementById("json-output");
  if (!area.value) return alert("No hay datos para copiar.");
  area.select(); document.execCommand("copy");
  alert("JSON copiado.");
});

window.mostrarDatos = function () {
  const tx = db.transaction("registros", "readonly");
  const store = tx.objectStore("registros");
  store.getAll().onsuccess = (e) => {
    const data = JSON.stringify(e.target.result, null, 2);
    document.getElementById("json-output").value = data;
    document.getElementById("output-registros").innerText = data;
  };
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('[SW] registrado', reg))
      .catch(err => console.error('[SW] error', err));
  });
};