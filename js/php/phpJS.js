/* Página dedicada para las funcionalidades añadidas para el funcionamiento de la lógica de negocio */

/* Cierra la ventana flotante */
function cerrarModal() {
  document.getElementById("miModal").style.display = "none";
  // Restaurar scroll si estaba bloqueado
  document.body.style.overflow = "";
}

/************************************* INICIO VALIDACIÓN DE DATOS EN FORMULARIOS DE PROCESO *************************************** */
function validarYEnviar() {
  const carrera = document.getElementById("carrera").value.trim();
  const semestre = document.getElementById("semestre").value.trim();
  const doc1Input = document.getElementById("doc1");
  const doc2Input = document.getElementById("doc2");
  const doc3Input = document.getElementById("doc3");
  const errorMsg = document.getElementById("errorMsg");

  // Validación básica
  if (carrera === "" || carrera === "Selecciona tu carrera") {
    errorMsg.textContent = "Debes seleccionar una carrera.";
    return;
  }

  if (semestre === "") {
    errorMsg.textContent = "El campo 'Semestre' es obligatorio.";
    return;
  }

  if (
    doc1Input.files.length === 0 &&
    doc2Input.files.length === 0 &&
    doc3Input.files.length === 0
  ) {
    errorMsg.textContent = "Debe subir al menos un documento.";
    return;
  }

  // Limpiar mensaje de error
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

  // Crear FormData para enviar archivos y datos
  const formData = new FormData();
  formData.append("student_id", user.id);
  formData.append("tipo", tipo);
  formData.append("semestre", semestre);

  // Agregar archivos al FormData
  if (doc1Input.files.length > 0) formData.append("doc1", doc1Input.files[0]);
  if (doc2Input.files.length > 0) formData.append("doc2", doc2Input.files[0]);
  if (doc3Input.files.length > 0) formData.append("doc3", doc3Input.files[0]);

  // Enviar con fetch
  fetch("php/includes/registrarTramite.php", {
    method: "POST",
    body: formData, // No poner headers, para que se configure multipart/form-data
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.success) {
        cerrarModal();
        alert("Trámite registrado correctamente. Luego podrás subir los documentos.");
        location.reload();
      } else {
        errorMsg.textContent = "Error: " + (response.message || "Error desconocido.");
      }
    })
    .catch((error) => {
      console.error("Error al registrar trámite:", error);
      errorMsg.textContent = "Error al comunicarse con el servidor.";
    });
}
/************************************* FIN VALIDACIÓN DE DATOS EN FORMULARIOS DE PROCESO *************************************** */

function abrirModalSeguimiento() {
  document.getElementById("modalSeguimiento").style.display = "flex";
  document.body.style.overflow = "hidden";
  cargarSeguimiento(); // cargar historial al abrir modal
}

function cerrarModalSeguimiento() {
  document.getElementById("modalSeguimiento").style.display = "none";
  document.body.style.overflow = "";
}

function cargarSeguimiento() {
  const container = document.querySelector("#timeline .cards");
  container.innerHTML = ""; // limpiar antes de pintar

  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user || !user.id) {
    alert("No se encontró sesión activa.");
    return;
  }

  const ruta = window.location.pathname.toLowerCase();
  let tipo = "";
  if (ruta.includes("servicio-social.html")) {
    tipo = "Servicio Social";
  } else if (ruta.includes("practicas.html")) {
    tipo = "Prácticas Profesionales";
  } else if (ruta.includes("titulacion.html")) {
    tipo = "Titulación";
  }

  fetch("php/includes/getSeguimientoTramite.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: user.id, tipo: tipo }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        container.innerHTML = "<p>Error al obtener seguimiento</p>";
        return;
      }

      data.seguimiento.forEach((paso) => {
        const card = document.createElement("div");
        card.classList.add("card");

        let contenido = `<h4>${paso.fecha ? paso.fecha : "Sin fecha"}</h4>`;
        contenido += `<p><strong>${paso.paso}</strong></p>`;

        if (paso.archivo) {
          contenido += `
            <p>Archivo: ${paso.archivo}</p>
            <p>Estado: ${paso.estado}</p>
            ${paso.comentario ? `<p>Comentario: ${paso.comentario}</p>` : ""}
            <a href="${paso.ruta}" target="_blank" class="btn-descarga">📎 Descargar</a>
          `;
        } else {
          // Para subir archivo si no está cargado
          contenido += `
            <p>Archivo: <em>No subido</em></p>
            <p>Estado: Pendiente</p>
            <input type="file" class="input-subir" data-paso="${paso.paso}" id="input-${paso.paso}">
            <button class="btn-subir" onclick="subirArchivoPaso('${paso.paso}')">Subir archivo</button>
          `;
        }

        card.innerHTML = contenido;
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error al cargar seguimiento:", error);
      container.innerHTML = "<p>Error de red</p>";
    });
}

/*********************************** Función para subir archivo por paso ************************************/
function subirArchivoPaso(nombrePaso) {
  const input = document.querySelector(`input[data-paso="${nombrePaso}"]`);
  if (!input) {
    alert("No se encontró el campo para subir archivo.");
    return;
  }

  const archivo = input.files[0];
  if (!archivo) {
    alert("Selecciona un archivo primero.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("usuario"));
  if (!user || !user.id) {
    alert("No se encontró sesión activa.");
    return;
  }

  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("student_id", user.id);

  // Determinar tipo de trámite igual que antes
  const ruta = window.location.pathname.toLowerCase();
  let tipo = "";
  if (ruta.includes("servicio-social.html")) {
    tipo = "Servicio Social";
  } else if (ruta.includes("practicas.html")) {
    tipo = "Prácticas Profesionales";
  } else if (ruta.includes("titulacion.html")) {
    tipo = "Titulación";
  }
  formData.append("tipo", tipo);

  formData.append("paso", nombrePaso);

  fetch("php/includes/subirArchivoPaso.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Archivo subido correctamente.");
        cargarSeguimiento(); // refrescar el historial
      } else {
        alert("Error: " + (data.message || "Error desconocido."));
      }
    })
    .catch((error) => {
      console.error("Error al subir archivo:", error);
      alert("Error al subir archivo.");
    });
}
