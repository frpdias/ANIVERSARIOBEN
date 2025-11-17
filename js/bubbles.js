const bubblesContainer = document.getElementById('bubbles-container');

if (bubblesContainer) {
  setInterval(() => {
    const gifPool = Array.isArray(window.mcqueenGifPool) && window.mcqueenGifPool.length
      ? window.mcqueenGifPool
      : null;

    if (!gifPool) {
      return;
    }

    const bubble = document.createElement('div');
    bubble.className = 'gif-bubble';

    const size = Math.random() * 40 + 70;
    const duration = Math.random() * 5000 + 9000;
    bubble.style.setProperty('--gb-size', `${size}px`);
    bubble.style.setProperty('--gb-speed', `${duration}ms`);
    bubble.style.left = Math.random() * window.innerWidth + 'px';

    const thumb = document.createElement('span');
    thumb.className = 'thumb';

    const img = document.createElement('img');
    img.src = gifPool[Math.floor(Math.random() * gifPool.length)];
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');

    thumb.appendChild(img);
    bubble.appendChild(thumb);
    bubblesContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), duration);
  }, 350);
}
