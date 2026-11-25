const STORAGE_KEY = "mr_club_asociados_v2";
let asociados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const btnNuevo = document.getElementById("nuevoAsociado");
const modalEl = document.getElementById("modalAsociado");
const modalAsociado = new bootstrap.Modal(modalEl);
const formAsociado = document.getElementById("formAsociado");
const tbody = document.getElementById("listaAsociados");
const errorPassword = document.getElementById("errorPassword");
const tituloModal = document.getElementById("tituloModalAsociado");
const btnGuardar = document.getElementById("guardarAsociado");

const modalEliminarEl = document.getElementById("modalEliminarAsociado");
const modalEliminar = new bootstrap.Modal(modalEliminarEl);
const nombreEliminarSpan = document.getElementById("nombreEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
let idParaEliminar = null;

const toastEl = document.getElementById("toastAsociado");
const toastAsociado = new bootstrap.Toast(toastEl);
const mensajeToast = document.getElementById("mensajeAsociados");

function mostrarNotificacion(texto) {
    mensajeToast.textContent = texto;
    toastAsociado.show();
}

function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(asociados));
}

function renderizarTabla() {
    if (asociados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    Aún no hay asociados registrados.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = asociados.map((item) => `
        <tr>
            <td>${item.documento}</td>
            <td>${item.nombre} ${item.apellidos}</td>
            <td>${item.telefono}</td>
            <td>${item.email}</td>
            <td>${item.ciudad}</td>
            <td class="text-capitalize">${item.genero}</td>
            <td class="text-end">
                <div class="d-inline-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" onclick="editarAsociado('${item.id}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarAsociado('${item.id}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function editarAsociado(id) {
    const asociado = asociados.find((item) => item.id === id);
    if (!asociado) return;

    formAsociado.reset();
    errorPassword.classList.add("d-none");

    document.getElementById("idAsociado").value = asociado.id;
    document.getElementById("documentoAsociado").value = asociado.documento;
    document.getElementById("fechaNacimiento").value = asociado.fechaNacimiento || "";
    document.getElementById("nombreAsociado").value = asociado.nombre;
    document.getElementById("apellidosAsociado").value = asociado.apellidos;
    document.getElementById("direccionAsociado").value = asociado.direccion || "";
    document.getElementById("telefonoAsociado").value = asociado.telefono;
    document.getElementById("emailAsociado").value = asociado.email;
    document.getElementById("ciudadAsociado").value = asociado.ciudad;
    document.getElementById("passwordAsociado").value = asociado.password || "";
    document.getElementById("confirmarPassword").value = asociado.password || "";

    const radioGenero = document.querySelector(`input[name="generoAsociado"][value="${asociado.genero}"]`);
    if (radioGenero) radioGenero.checked = true;

    tituloModal.textContent = "Editar Asociado";
    btnGuardar.textContent = "Actualizar registro";
    modalAsociado.show();
}

function eliminarAsociado(id) {
    const asociado = asociados.find((item) => item.id === id);
    if (!asociado) return;

    idParaEliminar = id;
    nombreEliminarSpan.textContent = `${asociado.nombre} ${asociado.apellidos}`;
    modalEliminar.show();
}

btnConfirmarEliminar.addEventListener("click", () => {
    if (!idParaEliminar) return;

    asociados = asociados.filter((item) => item.id !== idParaEliminar);
    guardarEnStorage();
    renderizarTabla();
    idParaEliminar = null;
    modalEliminar.hide();
    mostrarNotificacion("Asociado eliminado.");
});

btnNuevo.addEventListener("click", () => {
    formAsociado.reset();
    errorPassword.classList.add("d-none");
    document.getElementById("idAsociado").value = "";
    document.getElementById("ciudadAsociado").value = "Sogamoso";
    tituloModal.textContent = "Registro de Asociados";
    btnGuardar.textContent = "Guardar registro";
    modalAsociado.show();
});

formAsociado.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = document.getElementById("passwordAsociado").value;
    const confirmar = document.getElementById("confirmarPassword").value;

    if (password !== confirmar) {
        errorPassword.classList.remove("d-none");
        return;
    }

    errorPassword.classList.add("d-none");

    const generoSeleccionado = document.querySelector('input[name="generoAsociado"]:checked');
    const idEditando = document.getElementById("idAsociado").value;

    const datosAsociado = {
        id: idEditando || Date.now().toString(),
        documento: document.getElementById("documentoAsociado").value.trim(),
        nombre: document.getElementById("nombreAsociado").value.trim(),
        apellidos: document.getElementById("apellidosAsociado").value.trim(),
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        direccion: document.getElementById("direccionAsociado").value.trim(),
        telefono: document.getElementById("telefonoAsociado").value.trim(),
        email: document.getElementById("emailAsociado").value.trim(),
        ciudad: document.getElementById("ciudadAsociado").value,
        genero: generoSeleccionado ? generoSeleccionado.value : "",
        password: password
    };

    if (idEditando) {
        const index = asociados.findIndex((item) => item.id === idEditando);
        if (index !== -1) {
            asociados[index] = datosAsociado;
        }
        mostrarNotificacion("Asociado actualizado correctamente.");
    } else {
        asociados.push(datosAsociado);
        mostrarNotificacion("Asociado registrado correctamente.");
    }

    guardarEnStorage();
    renderizarTabla();
    formAsociado.reset();
    document.getElementById("idAsociado").value = "";
    modalAsociado.hide();
});

renderizarTabla();