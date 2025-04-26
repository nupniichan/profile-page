/*
  Main Script
  - Initialize essential components and features
  - Load non-critical features asynchronously
*/

// Import necessary modules
import { initSidebar, highlightActiveSection } from './sidebar.js';
import { initThemeSwitch } from './theme.js';
import { initModal } from './modal.js';
import { optimizeAvatarGif } from './optimize-images.js';
import { initPersistentAudio } from './persistent-audio.js';

// Initialize reset functions
const resetFunctions = {}; 

document.addEventListener('DOMContentLoaded', async () => {
  // Optimize avatar GIF
  optimizeAvatarGif();
  
  // Initialize sidebar
  initSidebar();
  // Initialize persistent audio player with sessionStorage
  initPersistentAudio();
  highlightActiveSection();
  initThemeSwitch();
  initModal();
  
  const loadingOverlay = document.querySelector('.loading-overlay');
  const hasVisitedBefore = sessionStorage.getItem('hasVisited');
  
  if (!hasVisitedBefore) {
    sessionStorage.setItem('hasVisited', 'true');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Hide loading overlay regardless of whether this is first visit or not
  loadingOverlay.classList.add('hide');
  
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.style.opacity = '1';
  }

  loadNonCriticalFeatures();
});

// Function to load non-critical features
async function loadNonCriticalFeatures() {
  const [
    { initParticles },
    { initAvatarEffect },
    { initTypingAnimation, resetTyping },
    { initSocialLinks, resetLinksAnimation },
    { initImageOptimization }
  ] = await Promise.all([
    import('./particles-config.js'),
    import('./avatar.js'),
    import('./typing.js'),
    import('./social-links.js'),
    import('./optimize-images.js')
  ]);

  initImageOptimization();

  initParticles();
  
  initAvatarEffect();
  initTypingAnimation();
  initSocialLinks();
  
  resetFunctions.resetLinksAnimation = resetLinksAnimation;
  resetFunctions.resetTyping = resetTyping;
  
  window.resetLinksAnimation = resetLinksAnimation;
  window.resetTyping = resetTyping;
}

window.addEventListener('themeChanged', (event) => {
  if (resetFunctions.resetLinksAnimation) {
    resetFunctions.resetLinksAnimation();
  }
  
  if (resetFunctions.resetTyping) {
    resetFunctions.resetTyping();
  }
});
