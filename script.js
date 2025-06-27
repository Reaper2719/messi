

function mostrarDatos() {
  const req = indexedDB.open("modulo1_db");
  req.onsuccess = function (e) {
    const db = e.target.result;
    const tx = db.transaction("registros", "readonly");
    const store = tx.objectStore("registros");
    const getAll = store.getAll();
    getAll.onsuccess = () => {
      document.getElementById("output-registros").innerText = JSON.stringify(getAll.result, null, 2);
    };
  };
}
