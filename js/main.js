 document.addEventListener("DOMContentLoaded", () => {
            // Set current year in footer
            document.getElementById("current-year").textContent = new Date().getFullYear();
            
            // Get all video items
            const videoItems = document.querySelectorAll('.video-item');
            
            // Get main video elements
            const mainVideo = document.getElementById('main-video');
            const mainVideoPlaceholder = document.getElementById('main-video-placeholder');
            const mainVideoPlayer = mainVideo.querySelector('video');
            
            // Function to load a new video in the main player
            function loadMainVideo(videoSrc, title, description) {
                // Update video source
                mainVideoPlayer.src = videoSrc;
                
                // Update placeholder content
                mainVideoPlaceholder.querySelector('h3').textContent = title;
                mainVideoPlaceholder.querySelector('p').textContent = description;
                
                // Show video and hide placeholder
                mainVideo.style.display = 'block';
                mainVideoPlaceholder.style.display = 'none';
                
                // Play the video
                mainVideoPlayer.play();
            }
            
            // Add click event to each video item
            videoItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Get video data from data attributes
                    const videoSrc = item.getAttribute('data-video');
                    const title = item.getAttribute('data-title');
                    const description = item.getAttribute('data-description');
                    
                    // Load the selected video in the main player
                    loadMainVideo(videoSrc, title, description);
                    
                    // Update active state
                    videoItems.forEach(v => v.classList.remove('active'));
                    item.classList.add('active');
                });
            });
            
            // Reset to placeholder when video ends
            mainVideoPlayer.addEventListener('ended', () => {
                mainVideo.style.display = 'none';
                mainVideoPlaceholder.style.display = 'flex';
            });
        });