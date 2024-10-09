// Seleccionamos el canvas y el contexto
const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');

// Variables para la imagen de la pelota
let imagenPelota = new Image();
imagenPelota.src = './bola.png'; // Imagen con fondo transparente

// Variables para la portería y el portero
let porteriaX = canvas.width - 100;
let porteroY = canvas.height / 2 - 50;
let velocidadPortero = 5;

// Variables para la posición de la pelota
let pelotaX = canvas.width / 4;
let pelotaY = canvas.height / 2;
let velocidadPelota = 10;
let velocidadSuavizado = 0.3; // Factor de suavizado
let velocidadPelotaX = 0;
let velocidadPelotaY = 0;

// Variables para el defensor
let defensorX = canvas.width / 2;
let defensorY = Math.random() * canvas.height;
let velocidadDefensor = 4;

// Variables para el control del input del usuario
let teclas = {};

// Configuramos los eventos para el teclado
window.addEventListener('keydown', function (e) {
    teclas[e.code] = true;
});

window.addEventListener('keyup', function (e) {
    teclas[e.code] = false;
});

// Dibujar la pelota
function dibujarPelota() {
    ctx.drawImage(imagenPelota, pelotaX, pelotaY, 50, 50);
}

// Dibujar la portería y el portero
function dibujarPorteria() {
    // Porteria
    ctx.fillStyle = 'white';
    ctx.fillRect(porteriaX, 200, 10, 200); // Porteria
    // Portero
    ctx.fillStyle = 'red';
    ctx.fillRect(porteriaX - 20, porteroY, 20, 50);
}

// Dibujar el defensor
function dibujarDefensor() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(defensorX, defensorY, 20, 50);
}

// Actualizar la posición de la pelota basado en el input del usuario
function actualizarPosicionPelota(deltaTime) {
    let movimientoY = 0;
    let movimientoX = 0;

    if (teclas['ArrowUp']) {
        movimientoY = -velocidadPelota;
    } else if (teclas['ArrowDown']) {
        movimientoY = velocidadPelota;
    }

    if (teclas['ArrowLeft']) {
        movimientoX = -velocidadPelota;
    } else if (teclas['ArrowRight']) {
        movimientoX = velocidadPelota;
    }

    pelotaX += movimientoX * deltaTime * 0.01;
    pelotaY += movimientoY * deltaTime * 0.01;

    // Limitar la posición de la pelota dentro del canvas
    if (pelotaY < 0) pelotaY = 0;
    if (pelotaY > canvas.height - 50) pelotaY = canvas.height - 50;
    if (pelotaX < 0) pelotaX = 0;
    if (pelotaX > canvas.width - 50) pelotaX = canvas.width - 50;
}

// Actualizar la posición del portero
function actualizarPosicionPortero(deltaTime) {
    porteroY += velocidadPortero * deltaTime * 0.01;
    if (porteroY <= 0 || porteroY >= canvas.height - 50) {
        velocidadPortero *= -1; // Cambia de dirección
    }
}

// Actualizar la posición del defensor
function actualizarPosicionDefensor(deltaTime) {
    if (pelotaY > defensorY) {
        defensorY += velocidadDefensor * deltaTime * 0.01;
    } else {
        defensorY -= velocidadDefensor * deltaTime * 0.01;
    }

    if (pelotaX > defensorX) {
        defensorX += velocidadDefensor * deltaTime * 0.01;
    } else {
        defensorX -= velocidadDefensor * deltaTime * 0.01;
    }
}

// Comprobar colisión con el defensor
function comprobarColision() {
    if (
        pelotaX < defensorX + 20 &&
        pelotaX + 50 > defensorX &&
        pelotaY < defensorY + 50 &&
        pelotaY + 50 > defensorY
    ) {
        alert("¡El defensor te ha quitado la pelota!");
        resetearJuego();
    }
}

// Comprobar si hay gol
function comprobarGol() {
    if (pelotaX + 50 >= porteriaX && pelotaY >= 200 && pelotaY <= 400) {
        alert("¡Gool!");
        resetearJuego();
    }
}

// Función para resetear el juego
function resetearJuego() {
    pelotaX = canvas.width / 4;
    pelotaY = canvas.height / 2;
    defensorX = canvas.width / 2;
    defensorY = Math.random() * canvas.height;
    velocidadPelotaX = 0;
    velocidadPelotaY = 0;
}

// Función principal de la animación
let ultimoTiempo = 0;
function cicloDeJuego(timestamp) {
    let deltaTime = timestamp - ultimoTiempo;
    ultimoTiempo = timestamp;

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar posiciones
    actualizarPosicionPelota(deltaTime);
    actualizarPosicionPortero(deltaTime);
    actualizarPosicionDefensor(deltaTime);

    // Dibujar los elementos
    dibujarPorteria();
    dibujarPelota();
    dibujarDefensor();

    // Comprobar colisiones y goles
    comprobarColision();
    comprobarGol();

    // Llamar a cicloDeJuego de nuevo para la próxima animación
    window.requestAnimationFrame(cicloDeJuego);
}

// Esperar a que la imagen se cargue y empezar la animación
imagenPelota.onload = function () {
    window.requestAnimationFrame(cicloDeJuego);
};