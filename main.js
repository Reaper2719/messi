
function limpiarFormulario() {
  console.log("Limpieza activada");
  const formulario = document.getElementById('formularioModulo');
  if (formulario) {
    formulario.reset();

    const checkboxes = formulario.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    const radios = formulario.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);

    const textareas = formulario.querySelectorAll('textarea');
    textareas.forEach(textarea => textarea.value = '');
  }
}

function guardarRespuestas() {
  const respuestas = {};
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    if (input.type === "radio" && input.checked) {
      respuestas[input.name] = input.value;
    } else if (input.type === "checkbox") {
      if (!respuestas[input.name]) respuestas[input.name] = [];
      if (input.checked) respuestas[input.name].push(input.value);
    } else if (input.tagName === "TEXTAREA" || input.type === "text") {
      if (input.value.trim() !== "") {
        if (respuestas[input.name]) {
          if (Array.isArray(respuestas[input.name])) {
            respuestas[input.name].push(input.value);
          } else {
            respuestas[input.name] = [respuestas[input.name], input.value];
          }
        } else {
          respuestas[input.name] = input.value;
        }
      }
    }
  });
  localStorage.setItem("respuestas_modulo1", JSON.stringify(respuestas));
  alert("Respuestas guardadas localmente.");
}

function exportarDatos() {
  const data = localStorage.getItem("respuestas_modulo1");
  if (!data) return alert("No hay datos guardados.");
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "respuestas_modulo1.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('botonLimpiar');
  if (btn) {
    btn.addEventListener('click', limpiarFormulario);
  }
});
