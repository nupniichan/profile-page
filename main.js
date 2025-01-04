import { links } from "./links.js";

// Particle.js config
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

// 3D Avatar Effect
const avatar = document.querySelector('.avatarContainer');
avatar.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    avatar.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

avatar.addEventListener('mouseleave', () => {
    avatar.style.transform = 'rotateY(0) rotateX(0)';
});

// Typing Animation
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
        setTimeout(eraseText, 100);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        charIndex = 0;
        setTimeout(type, 500);
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
    // Dừng animation hiện tại
    isTyping = false;
    
    // Clear text và reset các biến
    typingElement.textContent = '';
    textIndex = 0;
    charIndex = 0;
    
    // Đợi một chút trước khi bắt đầu lại
    setTimeout(() => {
        isTyping = true;
        type();
    }, 500);
}

// Bắt đầu animation khi trang load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        isTyping = true;
        type();
    }, 3000);
});

// Theme Switcher
const toggleSwitch = document.querySelector('#checkbox');
const overlay = document.querySelector('.theme-transition-overlay');
const particlesContainer = document.querySelector('#particles-js');

// Thêm biến để kiểm soát
let isThemeSwitching = false;

function switchTheme(e) {
    e.preventDefault();
    
    if (isThemeSwitching) {
        return;
    }

    isThemeSwitching = true;
    toggleSwitch.disabled = true;
    overlay.classList.add('active');
    isTyping = false;
    
    const isLightMode = e.target.checked;
    
    if (isLightMode) {
        // Light mode
        particlesContainer.style.opacity = '0';
        
        // Đợi overlay hiển thị hoàn toàn trước khi thay đổi theme
        setTimeout(() => {
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.move.enable = false;
            }
            
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            
            const img = new Image();
            img.src = 'Image/background.gif';
            img.onload = () => {
                setTimeout(() => {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        resetTyping();
                    }, 100); // Đợi overlay biến mất một chút rồi mới reset typing
                    isThemeSwitching = false;
                    toggleSwitch.disabled = false;
                    toggleSwitch.checked = true;
                }, 400);
            };
        }, 400); // Giảm thời gian chờ xuống để transition mượt hơn
    } else {
        // Dark mode
        // Đợi overlay hiển thị hoàn toàn trước khi thay đổi theme
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.move.enable = true;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
            
            setTimeout(() => {
                particlesContainer.style.opacity = '1';
                
                setTimeout(() => {
                    overlay.classList.remove('active');
                    setTimeout(() => {
                        resetTyping();
                    }, 100); // Đợi overlay biến mất một chút rồi mới reset typing
                    isThemeSwitching = false;
                    toggleSwitch.disabled = false;
                    toggleSwitch.checked = false;
                }, 400);
            }, 200);
        }, 400);
    }
}

// Kiểm tra theme khi trang web load
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light' && window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.move.enable = false;
    }
});

toggleSwitch.addEventListener('change', switchTheme);

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
    }
} else {
    // Nếu chưa có theme được lưu, set mặc định là light mode
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    toggleSwitch.checked = true;
    
    // Tắt particles khi ở light mode
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.particles.move.enable = false;
    }
}

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

// Đợi cho loading screen biến mất rồi mới hiển thị links với animation
document.addEventListener('DOMContentLoaded', () => {
    // Thêm links vào container
    linkContainer.innerHTML = allLinks;
    
    // Đợi loading overlay biến mất (3 giây)
    setTimeout(() => {
        const linkElements = document.querySelectorAll('.link');
        linkElements.forEach((link, index) => {
            link.style.setProperty('--order', index + 1);
            // Reset animation
            link.style.animation = 'none';
            link.offsetHeight; // Trigger reflow
            link.style.animation = null;
        });
    }, 3000); // Thời gian này phải khớp với animation fadeOut của loading-overlay
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

