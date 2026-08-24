// Cargar datos desde el JSON
fetch('jugadores.json?v=' + new Date().getTime()) // Desactiva caché
  .then(response => response.json())
  .then(data => {
    
    // --- NUEVO: Cargar Video de Fondo .mp4 ---
    const videoPlayer = document.getElementById('background-video');
    const videoSource = document.getElementById('video-source');

    if (data.videoFondo && videoPlayer && videoSource) {
      videoSource.src = data.videoFondo; // Asigna la ruta del video (ej: gifs/1.mp4)
      videoPlayer.load(); // Recarga el reproductor para ver el cambio
      videoPlayer.play(); // Intenta reproducir
    }
    // ------------------------------------------

    // 2. Cargar Fechas y Texto
    document.getElementById('fechaInicio').innerText = data.fechaInicio;
    document.getElementById('ultimaActualizacion').innerText = data.ultimaActualizacion;

    // 3. Formatear y mostrar fecha fin
    const fechaFinObj = new Date(data.fechaFin);
    document.getElementById('fechaFinMostrar').innerText = fechaFinObj.toLocaleDateString('es-AR');

    // 4. Ordenar jugadores
    const jugadoresOrdenados = data.jugadores.sort((a, b) => b.cargas - a.cargas);

    // 5. Renderizar Ranking
    const contenedor = document.getElementById('ranking');
    contenedor.innerHTML = '';

    jugadoresOrdenados.forEach((jugador, index) => {
      const pos = index + 1;
      let claseTop = '';
      let medalla = `#${pos}`;

      if (pos === 1) { claseTop = 'top-1'; medalla = '🥇'; }
      else if (pos === 2) { claseTop = 'top-2'; medalla = '🥈'; }
      else if (pos === 3) { claseTop = 'top-3'; medalla = '🥉'; }

      const div = document.createElement('div');
      div.className = `item-jugador ${claseTop}`;
      div.innerHTML = `
        <div class="pos">${medalla}</div>
        <div class="nombre">${jugador.usuario}</div>
        <div class="cargas">${jugador.cargas.toLocaleString('es-AR')} pts</div>
      `;
      contenedor.appendChild(div);
    });

    // 6. Iniciar Cuenta Regresiva
    iniciarCountdown(data.fechaFin);
  })
  .catch(error => console.error('Error al cargar el ranking:', error));

function iniciarCountdown(fechaFinStr) {
  const destino = new Date(fechaFinStr).getTime();

  const timer = setInterval(() => {
    const ahora = new Date().getTime();
    const diferencia = destino - ahora;

    if (diferencia < 0) {
      clearInterval(timer);
      document.getElementById('countdown').innerText = '¡TORNEO FINALIZADO!';
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerText = 
      `${dias}d ${horas < 10 ? '0' + horas : horas}h ${minutos < 10 ? '0' + minutos : minutos}m ${segundos < 10 ? '0' + segundos : segundos}s`;
  }, 1000);
}