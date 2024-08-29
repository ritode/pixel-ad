async function fetchContent() {
  try {
    const response = await fetch('/content.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching content:', error);
    // Fallback or error message
    document.querySelector('.ad-container').innerHTML = '<p>Failed to load content. Please try again later.</p>';
  }
}


function animateHeadline(selector, { y = 0, x = 0, duration = 1, delay = 0, repeat = 0, yoyo = false } = {}) {
  return gsap.fromTo(selector, 
    { x: -x, y: -y }, 
    { x: x, y: y, duration, ease: "power2.out", delay, repeat, yoyo }
  );
}

function animateElement(selector, animationConfig) {
  gsap.from(selector, animationConfig);
}

function createParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.classList.add('particle-container');
  document.querySelector('.ad-container').appendChild(particleContainer);

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    gsap.set(particle, {
      x: Math.random() * 300,
      y: Math.random() * 250,
      backgroundColor: gsap.utils.random(['#ff4500', '#32cd32', '#1e90ff', '#ff69b4', '#ffd700']),
      opacity: 1,
      scale: Math.random() * 0.8 + 0.5,
      position: 'absolute',
      rotation: Math.random() * 360
    });
    particleContainer.appendChild(particle);
  }

  gsap.to('.particle', {
    duration: 2,
    x: 'random(-300, 300)',
    y: 'random(-300, 300)',
    opacity: 0,
    scale: 0,
    rotation: '+=360',
    stagger: 0.03,
    onComplete: () => {
      particleContainer.remove();
    }
  });
}

function glitchEffect(selector) {
  const glitchTimeline = gsap.timeline();
  
  glitchTimeline.from(selector, { duration: 1, opacity: 0, y: -20, ease: "power2.out", delay: 0.5 });
  
  for (let i = 0; i < 4; i++) {
    glitchTimeline.to(selector, {
      duration: 0.1,
      x: "+=5",
      yoyo: true,
      repeat: 5,
      delay: i === 0 ? 0 : 1
    });
  }
}

function updateProductDisplay(index, products, productImage, priceElement, dots) {
  const priceContent = products[index].price.split(' ');
  const priceHTML = `
    <span class="price-medium">${priceContent[0]}</span>
    <span class="price-large">${priceContent[1]}</span>
    <span class="price-medium">${priceContent[2]}</span>
    <span class="price-small">${priceContent[3]}</span>
  `;

  productImage.src = products[index].image;
  priceElement.innerHTML = priceHTML;

  gsap.fromTo(productImage, { rotationY: 360, y: -50, opacity: 0 }, { duration: 1.5, rotationY: 0, y: 0, opacity: 1, ease: "bounce.out" });
  gsap.from(".price", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });
  gsap.from(".price-large", { duration: 1.2, scale: 0, opacity: 0, ease: "elastic.out(1, 0.3)", delay: 0.5 });

  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

function setupCarousel(products, productImage, priceElement, dots) {
  let currentIndex = 0;
  
  updateProductDisplay(currentIndex, products, productImage, priceElement, dots);

  const carouselInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % products.length;
    updateProductDisplay(currentIndex, products, productImage, priceElement, dots);
  }, 2000);

  const carouselTimeout = setTimeout(() => clearInterval(carouselInterval), products.length * 2000);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      clearInterval(carouselInterval); // Stop the carousel when user interacts
      clearTimeout(carouselTimeout);   // Prevent any scheduled interval stop
      currentIndex = parseInt(e.target.getAttribute('data-index'));
      updateProductDisplay(currentIndex, products, productImage, priceElement, dots);
    });
  });
}

function transitionFrames() {
  createParticles();

  const transitionTimeout = setTimeout(() => {
    gsap.to(".frame1-content", {
      duration: 1,
      opacity: 0,
      onComplete: () => {
        const frame1Content = document.querySelector('.frame1-content');
        if (frame1Content) frame1Content.style.display = 'none';

        const frame2Content = document.querySelector('.frame2-content');
        frame2Content.style.display = "flex";
        gsap.to(".frame2-content", { duration: 1, opacity: 1 });
        renderFrame2();
      }
    });
  }, 500);

  return transitionTimeout;
}

function renderFrame1(content) {
  document.querySelector('.frame1-content .headline-highlighted').textContent = content.frame1["headline-highlighted"];
  document.querySelector('.frame1-content .headline').textContent = content.frame1.headline;

  // Animate the first headline with a fade-in effect
  animateElement(".frame1-content .headline-highlighted", { 
    duration: 1, 
    y: -40, 
    ease: "power2.out", 
    delay: 0.75 
  });

  // Animate the second headline with zoom past effect and final slow down
  const headlineTimeline = gsap.timeline();

  headlineTimeline.fromTo(".frame1-content .headline", 
    { x: -600 }, 
    { 
      duration: 0.8, 
      delay:1,
      x: 600, 
      ease: "power2.in", 
      repeat: 1, 
      onRepeat: () => {
        gsap.set(".frame1-content .headline", { x: -600 }); 
      }
    }
  );

  headlineTimeline.to(".frame1-content .headline", { 
    duration: 1.5, 
    x: 0, 
    ease: "power4.out" 
  });

  animateElement(".terms-btn", { 
    duration: 1, 
    opacity: 0, 
    delay: 1.5 
  });
}

function renderFrame2() {
  const content = JSON.parse(sessionStorage.getItem('content'));
  document.querySelector('.frame2-content .headline-highlighted').textContent = content.frame2["headline-highlighted"];
  document.querySelector('.frame2-content .headline').textContent = content.frame2.headline;
  document.querySelector('.frame2-content .subtext').textContent = content.frame2.subtext;
  document.querySelector('.learn-more-btn').textContent = content.frame2.buttonText;

  glitchEffect(".frame2-content .headline-highlighted");

  animateElement(".frame2-content .headline", { duration: 1, opacity: 0, y: 20, ease: "power2.out", delay: 0.7 });

  const productImage = document.querySelector('.product-image');
  const priceElement = document.querySelector('.price');
  const dots = document.querySelectorAll('.dot');
  setupCarousel(content.frame2.products, productImage, priceElement, dots);
}

fetchContent().then(content => {
  sessionStorage.setItem('content', JSON.stringify(content));

  renderFrame1(content);
  const transitionTimeout = setTimeout(transitionFrames, 5000);

  // Clear timeouts and intervals when necessary
  window.addEventListener('beforeunload', () => {
    clearTimeout(transitionTimeout);
  });

  // Modal functionality
  document.querySelectorAll('.terms-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.modal-overlay').style.display = 'flex';
    });
  });

  document.querySelector('.close-modal').addEventListener('click', () => {
    document.querySelector('.modal-overlay').style.display = 'none';
  });
});
