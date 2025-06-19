document.addEventListener("DOMContentLoaded", () => {
    // Set current year in footer
    document.getElementById("current-year").textContent = new Date().getFullYear()
  
    // Video player functionality
    const playBtn = document.querySelector(".play-btn")
    const videoThumbnail = document.querySelector(".video-thumbnail")
    const videoIframe = document.querySelector(".video-iframe")
    const videoItems = document.querySelectorAll(".video-item")
  
    if (playBtn && videoThumbnail && videoIframe) {
      playBtn.addEventListener("click", () => {
        videoThumbnail.style.display = "none"
        videoIframe.style.display = "block"
        videoIframe.querySelector("iframe").src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
      })
    }
  
    if (videoItems) {
      videoItems.forEach((item) => {
        item.addEventListener("click", () => {
          if (videoThumbnail && videoIframe) {
            videoThumbnail.style.display = "none"
            videoIframe.style.display = "block"
            videoIframe.querySelector("iframe").src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          }
        })
      })
    }
  
    // Chat functionality
    const chatButton = document.querySelector(".chat-button")
    const chatContainer = document.getElementById("chat-container")
    const closeChat = document.querySelector(".close-chat")
    const chatTriggers = document.querySelectorAll(".chat-trigger")
  
    if (chatButton && chatContainer && closeChat) {
      chatButton.addEventListener("click", () => {
        chatContainer.classList.toggle("hidden")
      })
  
      closeChat.addEventListener("click", () => {
        chatContainer.classList.add("hidden")
      })
    }
  
    if (chatTriggers) {
      chatTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          if (chatContainer) {
            chatContainer.classList.remove("hidden")
          }
        })
      })
    }
  })
