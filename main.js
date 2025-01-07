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

const avatar = document.querySelector('.avatarContainer');
avatar.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    avatar.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = 'rotateY(0) rotateX(0)';
});

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

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        isTyping = true;
        type();
    }, 3000);
});

const toggleSwitch = document.querySelector('#checkbox');
const overlay = document.querySelector('.theme-transition-overlay');
const particlesContainer = document.querySelector('#particles-js');
const loadingOverlay = document.querySelector('.loading-overlay');
const mainContent = document.querySelector('main');

let isThemeSwitching = false;

function fadeOutContent() {
    return new Promise(resolve => {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease';
        setTimeout(resolve, 500);
    });
}

function fadeInContent() {
    return new Promise(resolve => {
        mainContent.style.opacity = '1';
        mainContent.style.transition = 'opacity 0.5s ease';
        setTimeout(resolve, 500);
    });
}

function showLoadingOverlay() {
    return new Promise(resolve => {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.opacity = '1';
        loadingOverlay.style.visibility = 'visible';
        loadingOverlay.style.animation = 'none';
        
        setTimeout(resolve, 1500); 
    });
}

function hideLoadingOverlay() {
    return new Promise(resolve => {
        loadingOverlay.style.animation = 'fadeOut 0.5s ease-in-out forwards';
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
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
                        img.src = 'Image/background.gif';
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
        loadingOverlay.style.display = 'none';
        mainContent.style.opacity = '1';
        isThemeSwitching = false;
        toggleSwitch.disabled = false;
    }
}

toggleSwitch.addEventListener('change', switchTheme);

document.addEventListener('DOMContentLoaded', () => {
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
