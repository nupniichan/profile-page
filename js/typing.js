
/*
  Typing Animation
  - Initialize typing animation functionality
*/

// Texts to display in the typing animation
const texts = [
  "Rất vui được gặp cậu (≧∇≦)/",
  "は じ め ま し て (≧∇≦)/",
  "Nice to meet you (≧∇≦)/"
];

let textIndex = 0;
let charIndex = 0;
let isTyping = false;
let typingElement;

// Function to erase text
function eraseText() {
  if (!isTyping || !typingElement) return;
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

// Function to type text
function type() {
  if (!isTyping || !typingElement) return;
  const currentText = texts[textIndex];
  if (charIndex < currentText.length) {
    typingElement.textContent += currentText.charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(eraseText, 2000);
  }
}

// Function to reset typing animation
export function resetTyping() {
  if (!typingElement) return;
  
  isTyping = false;
  typingElement.textContent = '';
  textIndex = 0;
  charIndex = 0;
  
  setTimeout(() => {
    isTyping = true;
    type();
  }, 500);
}

// Function to initialize typing animation
export function initTypingAnimation() {
  typingElement = document.querySelector('.typing-text');
  
  if (typingElement) {
    setTimeout(() => {
      isTyping = true;
      type();
    }, 3000);
  }
} 