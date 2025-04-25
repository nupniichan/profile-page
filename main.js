import { links } from "./links.js";

particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle"
      },
      "opacity": {
        "value": 0.5,
        "random": false
      },
      "size": {
        "value": 3,
        "random": true
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      }
    },
    "retina_detect": true
  }
);

// Add avatar hover effect only if avatar exists
const avatar = document.querySelector('.avatarContainer');
if (avatar) {
    avatar.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        avatar.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = 'rotateY(0) rotateX(0)';
    });
}

const texts = [
    "Rất vui được gặp cậu (≧∇≦)/",
    "は じ め ま し て (≧∇≦)/",
    "Nice to meet you (≧∇≦)/"
];
let textIndex = 0;
let charIndex = 0;
let isTyping = false;
const typingElement = document.querySelector('.typing-text');

function eraseText() {
    if (!isTyping) return;
    const currentText = typingElement.textContent;
    if (currentText.length > 0) {
        typingElement.textContent = currentText.slice(0, -1);
        setTimeout(eraseText, 90);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        charIndex = 0;
        setTimeout(type, 200);
    }
}

function type() {
    if (!isTyping) return;
    const currentText = texts[textIndex];
    if (charIndex < currentText.length) {
        typingElement.textContent += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(eraseText, 2000);
    }
}

function resetTyping() {
    isTyping = false;
    
    typingElement.textContent = '';
    textIndex = 0;
    charIndex = 0;
    
    setTimeout(() => {
        isTyping = true;
        type();
    }, 500);
}

let isSidebarOpen = localStorage.getItem('sidebarOpen') === 'true';

document.addEventListener('DOMContentLoaded', () => {
    // Typing animation
    if (typingElement) {
        setTimeout(() => {
            isTyping = true;
            type();
        }, 3000);
    }

    // Sidebar Toggle with improved mobile handling
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('main');

    if (sidebarToggle && sidebar) {
        function toggleSidebar(open) {
            isSidebarOpen = open;
            localStorage.setItem('sidebarOpen', open);
            
            if (open) {
                sidebar.classList.add('active');
                sidebarToggle.querySelector('i').classList.remove('fa-bars');
                sidebarToggle.querySelector('i').classList.add('fa-times');
                if (window.innerWidth <= 768) {
                    document.body.style.overflow = 'hidden';
                }
            } else {
                sidebar.classList.remove('active');
                sidebarToggle.querySelector('i').classList.remove('fa-times');
                sidebarToggle.querySelector('i').classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        }

        // Close sidebar on mobile when clicking a link
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleSidebar(false);
                }
            });
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    document.body.style.overflow = '';
                    if (!isSidebarOpen) {
                        sidebar.style.transform = 'translateX(-250px)';
                    }
                }
            }, 250);
        });

        // Set initial sidebar state
        const hasVisitedBefore = localStorage.getItem('hasVisited');
        if (hasVisitedBefore && isSidebarOpen) {
            toggleSidebar(true);
        } else {
            toggleSidebar(false);
        }

        sidebarToggle.addEventListener('click', () => {
            toggleSidebar(!isSidebarOpen);
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (isSidebarOpen && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target) &&
                !e.target.closest('.sidebar')) {
                toggleSidebar(false);
            }
        });
    }

    // Sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // If it's an anchor link (contains #), handle smooth scrolling
                if (href.includes('#') && !href.startsWith('#')) {
                    const [pagePath, anchor] = href.split('#');
                    // If we're already on the same page
                    if (window.location.pathname.endsWith(pagePath)) {
                        e.preventDefault();
                        const targetElement = document.querySelector(`#${anchor}`);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 50,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
                
                // Add active class to the clicked link
                sidebarLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Audio Player Logic
    const audioButton = document.getElementById('audioButton');
    const bgMusic = document.getElementById('bgMusic');
    const musicProgress = document.getElementById('musicProgress');
    const progressContainer = document.querySelector('.progress-container');

    if (audioButton && bgMusic && musicProgress && progressContainer) {
        let isPlaying = false;
        const isMobile = () => window.innerWidth <= 600;

        function updateProgressBar() {
            if (bgMusic.duration) {
                const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
                musicProgress.style.width = progressPercent + '%';
            }
            if (isPlaying) {
                requestAnimationFrame(updateProgressBar);
            }
        }

        audioButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isPlaying) {
                bgMusic.pause();
                audioButton.innerHTML = '<i class="fas fa-play"></i>';
                audioButton.classList.remove('playing');
            } else {
                bgMusic.play();
                audioButton.innerHTML = '<i class="fas fa-pause"></i>';
                audioButton.classList.add('playing');
                requestAnimationFrame(updateProgressBar);
            }
            isPlaying = !isPlaying;
        });

        window.addEventListener('resize', () => {
            const mobile = isMobile();
            if (mobile) {
                progressContainer.style.width = '90px';
            } else {
                progressContainer.style.width = '100px';
            }
        });

        progressContainer.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isPlaying) {
                const progressRect = this.getBoundingClientRect();
                const clickPosition = e.clientX - progressRect.left;
                const percentageClicked = clickPosition / progressRect.width;
                const seekTime = percentageClicked * bgMusic.duration;
                
                bgMusic.currentTime = seekTime;
                musicProgress.style.width = (percentageClicked * 100) + '%';
            }
        });
    }

    // Highlight active section while scrolling
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

const toggleSwitch = document.querySelector('#checkbox');
const overlay = document.querySelector('.theme-transition-overlay');
const particlesContainer = document.querySelector('#particles-js');
const loadingOverlay = document.querySelector('.loading-overlay');
const mainContent = document.querySelector('main') || document.body;

let isThemeSwitching = false;

function fadeOutContent() {
    return new Promise(resolve => {
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.5s ease';
        }
        setTimeout(resolve, 500);
    });
}

function fadeInContent() {
    return new Promise(resolve => {
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.5s ease';
        }
        setTimeout(resolve, 500);
    });
}

function showLoadingOverlay() {
    return new Promise(resolve => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.add('show');
        setTimeout(resolve, 1500);
    });
}

function hideLoadingOverlay() {
    return new Promise(resolve => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.add('hide');
        setTimeout(() => {
            loadingOverlay.classList.remove('show', 'hide');
            resolve();
        }, 500);
    });
}

async function switchTheme(e) {
    e.preventDefault();
    
    if (isThemeSwitching) return;
    isThemeSwitching = true;
    toggleSwitch.disabled = true;
    
    const isLightMode = e.target.checked;
    
    try {
        await fadeOutContent();
        await showLoadingOverlay();
 
        if (isLightMode) {
            particlesContainer.style.opacity = '0';
            
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.move.enable = false;
            }
            
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            
            try {
                await Promise.race([
                    new Promise(resolve => {
                        const img = new Image();
                        img.src = 'Assets/Image/background.gif';
                        img.onload = resolve;
                    }),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Image load timeout')), 5000)
                    )
                ]);
            } catch (error) {
                console.error('Background image load failed:', error);
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.move.enable = true;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
            
            particlesContainer.style.opacity = '1';
        }
        
        resetLinksAnimation();
        resetTyping();
        
        setTimeout(async () => {
            await hideLoadingOverlay();
            await fadeInContent();
            
            toggleSwitch.checked = isLightMode;
            isThemeSwitching = false;
            toggleSwitch.disabled = false;
        }, 500);
        
    } catch (error) {
        console.error('Error during theme switch:', error);
        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.remove('show', 'hide');
        mainContent.style.opacity = '1';
        isThemeSwitching = false;
        toggleSwitch.disabled = false;
    }
}

toggleSwitch.addEventListener('change', switchTheme);

// Initial page load
document.addEventListener('DOMContentLoaded', async () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const hasVisitedBefore = localStorage.getItem('hasVisited');
    
    // Only show loading overlay if this is the first visit to the website
    if (!hasVisitedBefore) {
        loadingOverlay.classList.add('show');
        localStorage.setItem('hasVisited', 'true');
        
        // Wait for initial animations and loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        await hideLoadingOverlay();
    }

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            toggleSwitch.checked = true;
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.move.enable = false;
            }
        }
    }
    
    mainContent.style.opacity = '1';
});

const linkContainer = document.getElementById("links");

function addLink(name, link, image) {
    return `
        <a href="${link}" class="link" target="_blank"> 
            <img src="${image}" alt=""/> 
            <span>${name}</span> 
            <img class="linkIcon" src="${image}" alt=""/> 
        </a> 
    `;
}

let allLinks = "";
links.forEach((ele) => {
    allLinks += addLink(ele.name, ele.link, ele.image);
});

document.addEventListener('DOMContentLoaded', () => {
    linkContainer.innerHTML = allLinks;
    
    setTimeout(() => {
        const links = document.querySelectorAll('.link');
        links.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.setProperty('--order', index + 1);
        });
        
        resetLinksAnimation();
    }, 2000);
});

const openModal = document.getElementById("openModal");
const modal = document.getElementById("myModal");

openModal.onclick = function () {
    modal.style.display = "block";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.link');
    links.forEach((link, index) => {
        link.style.setProperty('--order', index + 1);
    });
});

