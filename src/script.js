const content = {
    frame1: {
      "headline-highlighted": "The phones you want",
      "headline": "at the speed you need"
    },
    frame2: {
      "headline-highlighted": "Free",
      "headline": "5G phones",
      "subtext": "with qualified plan purchase",
      "products": [
        {
          image: "../public/assets/300x250_DCO_MockTest_product01.png",
          price: "$ 3 99 /month"
        },
        {
          image: "../public/assets/300x250_DCO_MockTest_product02.png",
          price: "$ 4 99 /month"
        },
        {
          image: "../public/assets/300x250_DCO_MockTest_product03.png",
          price: "$ 5 99 /month"
        }
      ],
      "buttonText": "Learn More"
    }
  };
  
  function renderFrame1() {
    document.querySelector('.frame1 .headline-highlighted').textContent = content.frame1["headline-highlighted"];
    document.querySelector('.frame1 .headline').textContent = content.frame1.headline;
  
    gsap.from(".frame1 .headline-highlighted", { duration: 1, opacity: 0, y: -20 });
    gsap.from(".frame1 .headline", { duration: 1, opacity: 0, x: -200, delay: 0.75 });
    gsap.from(".frame1 .terms-btn", { duration: 1, opacity: 0, delay: 1.5 });
  }
  
  function renderFrame2() {
    document.querySelector('.frame2 .headline-highlighted').textContent = content.frame2["headline-highlighted"];
    document.querySelector('.frame2 .headline').textContent = content.frame2.headline;
    document.querySelector('.frame2 .subtext').textContent = content.frame2.subtext;
    document.querySelector('.frame2 .learn-more-btn').textContent = content.frame2.buttonText;
  
    let currentIndex = 0;
    const products = content.frame2.products;
    const productImage = document.querySelector('.product-image');
    const priceElement = document.querySelector('.price');
    const dots = document.querySelectorAll('.dot');
  
    function showProduct(index) {
      productImage.src = products[index].image;
      priceElement.textContent = products[index].price;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    }
  
    showProduct(currentIndex);
  
    let carouselInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % products.length;
      showProduct(currentIndex);
    }, 2000);
  
    setTimeout(() => clearInterval(carouselInterval), products.length * 2000);
  
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        currentIndex = parseInt(e.target.getAttribute('data-index'));
        showProduct(currentIndex);
      });
    });
  }
  
  function transitionFrames() {
    gsap.to(".frame1", {
      duration: 1,
      opacity: 0,
      onComplete: () => {
        const frame1 = document.querySelector('.frame1');
        if (frame1) frame1.remove();
  
        const frame2 = document.querySelector('.frame2');
        frame2.style.visibility = "visible";
        gsap.to(".frame2", { duration: 1, opacity: 1 });
        renderFrame2();
      }
    });
  }
  
  renderFrame1();
  setTimeout(transitionFrames, 4000);
  