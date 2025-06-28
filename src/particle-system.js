// Particle System for Desktop OS
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 10000;
    this.isRunning = false;
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;
    
    this.setupEventListeners();
    this.initParticles();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random()
      });
    }
  }

  updateParticles() {
    const mouseForce = 50;
    const mouseRadius = 100;
    
    for (let particle of this.particles) {
      // Mouse interaction
      const dx = particle.x - this.mouse.x;
      const dy = particle.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * mouseForce * 0.01;
        particle.vy += Math.sin(angle) * force * mouseForce * 0.01;
      }

      // Add some noise-based movement
      const noiseX = (Math.sin(particle.x * 0.01 + Date.now() * 0.001) * 0.5);
      const noiseY = (Math.cos(particle.y * 0.01 + Date.now() * 0.001) * 0.5);
      
      particle.vx += noiseX * 0.1;
      particle.vy += noiseY * 0.1;

      // Apply velocity damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Update life for fade effect
      particle.life += 0.01;
      if (particle.life > 1) particle.life = 0;
    }
  }

  render() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let particle of this.particles) {
      const alpha = Math.sin(particle.life * Math.PI) * 0.8 + 0.2;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate() {
    if (!this.isRunning) return;
    
    this.updateParticles();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  reset() {
    this.stop();
    this.initParticles();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setParticleCount(count) {
    this.particleCount = count;
    this.initParticles();
  }
}

// Global particle system instance
let particleSystem = null;

// Global functions for HTML onclick handlers
window.toggleParticles = function() {
  const canvas = document.getElementById('particleCanvas');
  const toggleBtn = document.getElementById('toggleBtn');
  
  if (!canvas) return;
  
  if (!particleSystem) {
    particleSystem = new ParticleSystem(canvas);
  }
  
  if (particleSystem.isRunning) {
    particleSystem.stop();
    toggleBtn.textContent = '開始';
  } else {
    particleSystem.start();
    toggleBtn.textContent = '停止';
  }
};

window.resetParticles = function() {
  if (particleSystem) {
    particleSystem.reset();
    const toggleBtn = document.getElementById('toggleBtn');
    toggleBtn.textContent = '開始';
  }
};

// Initialize particle count control
window.addEventListener('load', () => {
  const countSlider = document.getElementById('particleCount');
  const countValue = document.getElementById('particleCountValue');
  
  if (countSlider && countValue) {
    countSlider.addEventListener('input', (e) => {
      const count = parseInt(e.target.value);
      countValue.textContent = count;
      if (particleSystem) {
        particleSystem.setParticleCount(count);
      }
    });
  }
});