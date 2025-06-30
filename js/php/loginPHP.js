// Referencias a elementos HTML que usaremos
const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".modal-button");
const closeButton = document.querySelector(".close-button");
const scrollDown = document.querySelector(".scroll-down");
const modalContent = document.getElementById("modal-content");

// Variable para saber si el modal ya se abrió por scroll
let isOpened = false;

// Función para abrir el modal y mostrar el formulario de login
const openModal = () => {
  modal.classList.add("is-open");
  body.style.overflow = "hidden";
  renderLoginForm();
};

// Función para cerrar el modal y restaurar scroll
const closeModal = () => {
  modal.classList.remove("is-open");
  body.style.overflow = "initial";
};

// Evento scroll: abre modal tras 1/3 ventana y oculta mensaje scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight / 3 && !isOpened) {
    isOpened = true;
    scrollDown.style.display = "none";
    openModal();
  }
});

// Botones abrir y cerrar modal
modalButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

// Cerrar modal con tecla Escape
document.onkeydown = evt => {
  evt = evt || window.event;
  if (evt.keyCode === 27) closeModal();
};

// Formulario login
function renderLoginForm() {
  modalContent.innerHTML = `
    <h1 class="modal-title">Bienvenido</h1>
    <p class="modal-desc">Por favor, inicia sesión para entrar al portal</p>

    <div class="input-block">
      <label for="email" class="input-label">Email</label>
      <input type="email" name="email" id="email" placeholder="Introduce tu correo institucional">
    </div>

    <div class="input-block">
      <label for="password" class="input-label">Contraseña</label>
      <input type="password" name="password" id="password" placeholder="Introduce tu contraseña">
    </div>

    <div class="modal-buttons">
      <a href="#">¿Olvidaste tu contraseña?</a>
      <button class="input-button" id="login-btn">Entrar</button>
    </div>

    <p class="sign-up">
      <a href="index.html" id="guest-btn">Entrar como invitado</a>
    </p>
    <p class="sign-up">¿No tienes cuenta? <a href="#" id="go-register">Regístrate</a></p>
  `;

  document.querySelector("#go-register").addEventListener("click", (e) => {
    e.preventDefault();
    renderRegisterForm();
  });

  document.querySelector("#login-btn").addEventListener("click", handleLogin);

  // Nuevo listener para "Entrar como invitado"
  document.querySelector("#guest-btn").addEventListener("click", (e) => {
    e.preventDefault();
    entrarComoInvitado();
  });
}

// Formulario registro
function renderRegisterForm() {
  modalContent.innerHTML = `
    <h1 class="modal-title">Registro</h1>
    <p class="modal-desc">Llena tus datos para registrarte</p>

    <div class="input-block">
      <label for="reg-name" class="input-label">Nombre completo</label>
      <input type="text" id="reg-name" placeholder="Introduce tu nombre completo">
    </div>

    <div class="input-block">
      <label for="reg-boleta" class="input-label">Boleta</label>
      <input type="text" id="reg-boleta" placeholder="Introduce tu boleta">
    </div>

    <div class="input-block">
      <label for="reg-birth" class="input-label">Año de nacimiento</label>
      <input type="number" id="reg-birth" placeholder="Ej. 2002">
    </div>

    <div class="input-block">
      <label for="reg-email" class="input-label">Correo institucional</label>
      <input type="email" id="reg-email" placeholder="Ej. alumno@alumno.ipn.mx">
    </div>

    <div class="input-block password-block">
      <label for="reg-password" class="input-label">Contraseña</label>
      <input type="password" id="reg-password" placeholder="Mínimo 6 caracteres">
      <button type="button" class="toggle-password" data-target="reg-password">👁️</button>
    </div>

    <div class="input-block password-block">
      <label for="reg-password-confirm" class="input-label">Confirmar contraseña</label>
      <input type="password" id="reg-password-confirm" placeholder="Repite tu contraseña">
      <button type="button" class="toggle-password" data-target="reg-password-confirm">👁️</button>
    </div>

    <div class="modal-buttons">
      <button class="input-button" id="register-btn">Registrarme</button>
      <a href="#" id="back-to-login">Volver al login</a>
    </div>
  `;

  document.querySelector("#back-to-login").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginForm();
  });

  document.querySelector("#register-btn").addEventListener("click", handleRegister);

  // Mostrar/ocultar contraseñas
  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "🙈" : "👁️";
    });
  });
}

// Enviar datos para registrarse
function handleRegister() {
  const name = document.querySelector("#reg-name").value.trim();
  const boleta = document.querySelector("#reg-boleta").value.trim();
  const birth = document.querySelector("#reg-birth").value.trim();
  const email = document.querySelector("#reg-email").value.trim();
  const password = document.querySelector("#reg-password").value.trim();
  const passwordConfirm = document.querySelector("#reg-password-confirm").value.trim();

  if (!name || !boleta || !birth || !email || !password || !passwordConfirm) {
    alert("Por favor, llena todos los campos.");
    return;
  }
  if (!email.endsWith("@alumno.ipn.mx")) {
    alert("El correo debe ser institucional (@alumno.ipn.mx).");
    return;
  }
  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }
  if (password !== passwordConfirm) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  fetch('php/public/registro.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, boleta, birth, email, password })
  })
  .then(response => {
    console.log("HTTP Status:", response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    if (data.success) {
      alert("¡Registro exitoso!");
      window.location.href = "mult/index.html";
    } else {
      alert("Error: " + (data.message || "Error desconocido."));
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
    alert("Ocurrió un error en el servidor. Revisa consola para más detalles.");
  });
}

// Enviar datos para iniciar sesión
function handleLogin() {
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!email || !password) {
    alert("Por favor, llena todos los campos.");
    return;
  }

  fetch('php/public/login.php', { //Se debe descomentarizar y sustituir la linea de abajp ára que funcione con xampp
  //fetch('/api/php/public/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    console.log("HTTP Status:", response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    if (data.success) {
      alert(`Bienvenido, ${data.user.name}`);

      // GUARDAR USUARIO EN localStorage
      localStorage.setItem('usuario', JSON.stringify(data.user));

      window.location.href = "index.html";
    } else {
      alert("Error: " + (data.message || "Credenciales inválidas."));
    }
  })
  .catch(error => {
    console.error("Login fetch error:", error);
    alert("Error al intentar iniciar sesión.");
  });
}

// Nueva función para entrar como invitado
function entrarComoInvitado() {
  // Limpiar usuario guardado
  localStorage.removeItem("usuario");

  alert("Has entrado como invitado. Algunas funcionalidades estarán limitadas.");

  // Cerrar modal de login
  closeModal();

  // Aquí puedes ocultar botones que solo usuarios logueados pueden ver
  const btnIniciar = document.getElementById("btnIniciar");
  const btnConsultar = document.getElementById("btnConsultar");

  if (btnIniciar) btnIniciar.style.display = "none";
  if (btnConsultar) btnConsultar.style.display = "none";

  // Opcional: redirigir o actualizar la página para reflejar cambios
  // location.reload();
  window.location.href = "index.html";

}
