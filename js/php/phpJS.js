/*Página dedicada para las funcionalidad añadidas para el funcionamiento de la lógico de negocio */

/*Cierra la ventana flotante */
function cerrarModal() {
  document.getElementById("miModal").style.display = "none";
  // Restaurar scroll si estaba bloqueado
  document.body.style.overflow = "";
}

/*************************************INICIO VALIDACIÓN DE DATOS EN FORMULARIOS DE PROCESO*************************************** */
function validarYEnviar() {
  const carrera = document.getElementById("carrera").value.trim();
  const semestre = document.getElementById("semestre").value.trim();
  const doc1 = document.getElementById("doc1").files.length;
  const doc2 = document.getElementById("doc2").files.length;
  const doc3 = document.getElementById("doc3").files.length;
  const errorMsg = document.getElementById("errorMsg");

  // Validación
  if (carrera === "" || carrera === "Selecciona tu carrera") {
    errorMsg.textContent = "Debes seleccionar una carrera.";
    return;
  }

  if (semestre === "") {
    errorMsg.textContent = "El campo 'Semestre' es obligatorio.";
    return;
  }

  if (doc1 === 0 && doc2 === 0 && doc3 === 0) {
    errorMsg.textContent = "Debe subir al menos un documento.";
    return;
  }

  // Limpia mensaje de error
  errorMsg.textContent = "";

  // Obtener usuario actual (asumiendo que está en localStorage bajo "usuario")
  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user || !user.id) {
    errorMsg.textContent = "No se encontró usuario activo. Por favor, inicia sesión.";
    return;
  }

  // Determinar tipo de trámite según la página actual
  const ruta = window.location.pathname.toLowerCase();
  let tipo = "";
  if (ruta.includes("servicio-social.html")) {
    tipo = "Servicio Social";
  } else if (ruta.includes("practicas.html")) {
    tipo = "Prácticas Profesionales";
  } else if (ruta.includes("titulacion.html")) {
    tipo = "Titulación";
  } else {
    tipo = "Desconocido";
  }

  // Prepara datos a enviar al servidor (sin enviar archivos)
  const data = {
    student_id: user.id,
    tipo: tipo,  // Aquí va el tipo correcto, no la carrera
    file_name: "Pendiente subir archivos",
    file_path: "Pendiente subir archivos",
    semestre: semestre
    // Puedes agregar notas aquí si decides incluirlas en el formulario y backend
  };

  fetch('php/includes/registrarTramite.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(response => {
    if (response.success) {
      cerrarModal();
      alert("Trámite registrado correctamente. Luego podrás subir los documentos.");
      location.reload(); // <-- Aquí refrescamos la página después de aceptar el alert
    } else {
      errorMsg.textContent = "Error: " + (response.message || "Error desconocido.");
    }
  })
  .catch(error => {
    console.error("Error al registrar trámite:", error);
    errorMsg.textContent = "Error al comunicarse con el servidor.";
  });
}
/*************************************FIN VALIDACIÓN DE DATOS EN FORMULARIOS DE PROCESO*************************************** */

function abrirModalSeguimiento() {
  document.getElementById("modalSeguimiento").style.display = "flex";
  // Bloquea el scroll de la página de fondo
  document.body.style.overflow = "hidden";
}

function cerrarModalSeguimiento() {
  document.getElementById("modalSeguimiento").style.display = "none";
  // Restaura el scroll de la página
  document.body.style.overflow = "";
}
