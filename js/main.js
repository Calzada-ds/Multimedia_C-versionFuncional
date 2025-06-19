document.addEventListener("DOMContentLoaded", () => {
    // 1. Año actual en el footer
    document.getElementById("current-year").textContent = new Date().getFullYear();

    // 2. Función global para reproducir videos
    window.playVideo = (videoId, thumbnailId, imgId) => {
        // Ocultar miniatura y mostrar video
        document.getElementById(thumbnailId).style.display = "none";
        const videoElement = document.getElementById(videoId);
        videoElement.style.display = "block";
        
        // Reproducir el video automáticamente
        const videoPlayer = videoElement.querySelector("video");
        videoPlayer.play();
        
        // Pausar otros videos al reproducir uno nuevo
        document.querySelectorAll(".video-iframe").forEach(video => {
            if (video.id !== videoId) {
                video.style.display = "none";
                const thumbId = video.id.replace("video", "thumbnail");
                document.getElementById(thumbId).style.display = "block";
                const otherVideo = video.querySelector("video");
                if (otherVideo) otherVideo.pause();
            }
        });
    };

    // 3. Botón de reinicio para videos
    document.querySelectorAll("video").forEach(video => {
        video.addEventListener("ended", () => {
            video.currentTime = 0;
        });
    });
  
    // 4. Funcionalidad del chat
    const chatButton = document.querySelector(".chat-button");
    const chatContainer = document.getElementById("chat-container");
    const closeChat = document.querySelector(".close-chat");
    const chatTriggers = document.querySelectorAll(".chat-trigger");

    if (chatButton && chatContainer && closeChat) {
        chatButton.addEventListener("click", () => {
            chatContainer.classList.toggle("hidden");
        });

        closeChat.addEventListener("click", () => {
            chatContainer.classList.add("hidden");
        });
    }

    if (chatTriggers) {
        chatTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                if (chatContainer) {
                    chatContainer.classList.remove("hidden");
                }
            });
        });
    }
});  // <-- Cierre correcto del único DOMContentLoaded