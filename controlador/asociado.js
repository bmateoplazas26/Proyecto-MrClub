const formulario = document.getElementById("formRegistro");

    formulario.addEventListener("submit", async (event) => {
    alert("Hola, estoy funcionando correctamente");

    //Evita recargar la página al enviar el formulario
    event.preventDefault();

    const botonGuardar = formulario.querySelector('button[type="submit"]');

    //Lee los campos del formulario y los convirte en un objeto
    const asociado = Object.fromEntries(new FormData(formulario).entries());
    alert("Datos del formulario: " + JSON.stringify(asociado));

    if(asociado.contraseña !== asociado.confirmarContraseña) {
        document.getElementById("mensajeRegistro").textContent = "Las contraseñas no coinciden.";
    }

    botonGuardar.disabled = true; // Deshabilita el botón mientras se procesa la solicitud
    document.getElementById("mensajeRegistro").textContent = 'Guardando...';
        
    document.getElementById("mensajeRegistro").dataset.tipo = '';

    try {
        const respuesta =await fetch(formulario.action, {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(asociado)});

        //passar la respuesta JSON a un objeto de JavaScript
        const resultado = await respuesta.json();
        

        document.getElementById("mensajeRegistro").textContent = resultado.mensaje;

        if (respuesta.ok && resultado.success) {
            formulario.reset(); // Limpia el formulario si la respuesta es exitosa

        }

     } catch (error) {
        console.log("Error al enviar el formulario:", error);
        document.getElementById("mensajeRegistro").textContent =
        "Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.";

    }finally {
        botonGuardar.disabled = false; // Habilita el botón después de procesar la solicitud
    }

});