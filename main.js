
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-zonas');
  const lista = document.getElementById('lista-observaciones');
  const exportarBtn = document.getElementById('exportar');
  let registros = [];

  function guardarEnIndexedDB(data) {
    const req = indexedDB.open("Modulo4ZonasDB", 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("zonas")) {
        db.createObjectStore("zonas", { keyPath: "fecha" });
      }
    };
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction("zonas", "readwrite");
      const store = tx.objectStore("zonas");
      store.put(data);
    };
  }

  function exportarJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modulo4_observaciones.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function mostrarLista() {
    lista.innerHTML = '<h3>Observaciones registradas:</h3>';
    registros.forEach((r, i) => {
      lista.innerHTML += `<p><strong>${i + 1}. ${r.tipo_espacio || 'Espacio'}</strong> - ${r.nombre_espacio || 'Sin nombre'}</p>`;
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = new FormData(form);
    const obj = {
      tipo_espacio: datos.get('tipo_espacio'),
      otro_espacio: datos.get('otro_espacio'),
      nombre_espacio: datos.get('nombre_espacio'),
      ubicacion: datos.get('ubicacion'),
      funcionamiento: datos.get('funcionamiento'),
      estado_fisico: datos.get('estado_fisico'),
      energia: datos.get('energia'),
      instalacion: datos.get('instalacion'),
      equipos: datos.getAll('equipos'),
      uso: datos.get('uso'),
      necesidades: datos.getAll('necesidades'),
      residuos: datos.getAll('residuos'),
      cantidad_residuos: datos.get('cantidad_residuos'),
      uso_residuos: datos.getAll('uso_residuos'),
      infraestructura_techos: datos.get('infraestructura_techos'),
      area_techo: datos.get('area_techo'),
      radiacion_solar: datos.get('radiacion_solar'),
      observaciones_energia: datos.get('observaciones_energia'),
      observaciones: datos.get('observaciones'),
      fecha: new Date().toISOString()
    };
    guardarEnIndexedDB(obj);
    registros.push(obj);
    mostrarLista();
    form.reset();
  });

  exportarBtn.addEventListener('click', () => {
    exportarJSON(registros);
  });
});
