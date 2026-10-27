//Lista temporal de usuarios para probar el inicio de sesión
const usuarios = [
    { usuario: 'mateo@gmail.com', clave: '123', rol: 'admin', nombre: 'Mateo Plazas' },
    { usuario: 'bayron@gmail.com', clave: '123', rol: 'asociado', nombre: 'Bayron Plazas' }
];

document.getElementById('formLogin').addEventListener('submit', function (e) {
    e.preventDefault(); 
    const usuarioInput = document.getElementById('Usuario').value;
    const claveInput = document.getElementById('password').value;

    const usuarioEncontrado = usuarios.find(
        u => u.usuario === usuarioInput && u.clave === claveInput
    );

    if (usuarioEncontrado) {
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('rol', usuarioEncontrado.rol);
        localStorage.setItem('nombre', usuarioEncontrado.nombre);
        window.location.href = 'dashboard.html';
    }else {
        alert('Usuario o contraseña incorrectos');
    }

});