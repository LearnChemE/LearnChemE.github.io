// droplets.js
import { draw, canvasWidth, tableY, legWidth, surfaceWidth, dropletCount, gravityPixels, initialVelocityX, containerWidth } from './constants.js';
import {setDroplets, animationFrameId, diameter, isRotated, setAnimateFrameId } from './state.js';

let droplets = [];
export function createDroplets() {
  droplets.forEach(d => d.element.remove());
  droplets = [];

  const startX = canvasWidth / 2 + containerWidth / 2 + 100;
  const startY = tableY - legWidth - surfaceWidth - diameter / 2;

  for (let i = 0; i < dropletCount; i++) {
    const element = draw.circle(diameter * 0.3).fill('rgb(35, 137, 218)');
    droplets.push({
      element,
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * initialVelocityX,
      vy: 0,
      active: false,
      delay: Math.random() * 2
    });
  }
}

let lastTime = performance.now();
export function startDropletAnimation() {
  setAnimateFrameId(requestAnimationFrame(animate));
}

function animate(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  droplets.forEach(droplet => {
    if (droplet.delay > 0) {
      droplet.delay -= deltaTime;
      return;
    }

    if (!droplet.active) {
      droplet.active = true;
    }

    droplet.vy += gravityPixels * deltaTime;
    droplet.y += droplet.vy * deltaTime;
    droplet.x += droplet.vx * deltaTime;

    droplet.element.center(droplet.x, droplet.y);

    if (droplet.y >= tableY || droplet.x < 0 || droplet.x > canvasWidth) {
      resetDroplet(droplet);
    }
  });

  if (isRotated) {
    setAnimateFrameId(requestAnimationFrame(animate));
  }
}

function resetDroplet(droplet) {
  const startX = canvasWidth / 2 + containerWidth / 2 + 100;
  const startY = tableY - legWidth - surfaceWidth - diameter / 2;

  droplet.x = startX;
  droplet.y = startY;
  droplet.vx = (Math.random() - 0.5) * initialVelocityX;
  droplet.vy = 0;
  droplet.delay = Math.random() * 2;
  droplet.active = false;
  droplet.element.center(droplet.x, droplet.y);
}

export function animateDropletRemoval(droplet, duration = 500) {
  const startTime = performance.now();
  const initialScale = 1;
  const finalScale = 0;
  const initialOpacity = 1;
  const finalOpacity = 0;

  function animateFrame(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const scale = initialScale + (finalScale - initialScale) * progress;
    const opacity = initialOpacity + (finalOpacity - initialOpacity) * progress;

    droplet.element.scale(scale);
    droplet.element.opacity(opacity);

    if (progress < 1) {
      requestAnimationFrame(animateFrame);
    } else {
      resetDroplet(droplet);
      droplet.element.opacity(1);
      droplet.element.scale(1);
    }
  }

  requestAnimationFrame(animateFrame);
}

export function stopDropletAnimation() {
  cancelAnimationFrame(animationFrameId);
  droplets.forEach(animateDropletRemoval);
}