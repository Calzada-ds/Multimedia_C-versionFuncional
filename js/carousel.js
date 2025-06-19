document.addEventListener("DOMContentLoaded", () => {
    // Hero carousel functionality
    const slides = document.querySelectorAll(".carousel-slide")
    const dots = document.querySelectorAll(".dot")
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")
  
    if (!slides.length || !dots.length) return
  
    let currentSlide = 0
    const slideCount = slides.length
  
    // Initialize carousel
    function showSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.classList.remove("active")
      })
  
      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })
  
      // Show the current slide and activate corresponding dot
      slides[index].classList.add("active")
      dots[index].classList.add("active")
    }
  
    // Next slide
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slideCount
      showSlide(currentSlide)
    }
  
    // Previous slide
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount
      showSlide(currentSlide)
    }
  
    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide)
    }
  
    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide)
    }
  
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index
        showSlide(currentSlide)
      })
    })
  
    // Auto slide
    let interval = setInterval(nextSlide, 5000)
  
    // Pause auto slide on hover
    const carouselContainer = document.querySelector(".carousel-container")
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", () => {
        clearInterval(interval)
      })
  
      carouselContainer.addEventListener("mouseleave", () => {
        interval = setInterval(nextSlide, 5000)
      })
    }
  })