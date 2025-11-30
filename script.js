const particleCount = 700;
const particlePropCount = 9;
const particlePropsLength = particleCount * particlePropCount;
const rangeY = 100;
const baseTime = 50;
const rangeTime = 150;
const baseSpeed = 0.1;
const rangeSpeed = 2;
const baseRadius = 1;
const rangeRadius = 4;
const baseHue = 220;
const rangeHue = 100;
const noiseSteps = 8;
const xOff = 0.00125;
const yOff = 0.00125;
const zOff = 0.0005;
const backgroundColor = "hsla(260,40%,5%,1)";

let container, canvas, ctx, center, tick, simplex;
let particleProps;

const TAU = Math.PI * 2;
const cos = Math.cos;
const sin = Math.sin;

function rand(n) { return Math.random() * n; }
function randRange(n) { return (Math.random() - 0.5) * n * 2; }
function lerp(a, b, t) { return a + (b - a) * t; }
function fadeInOut(t, m) {
    let hm = 0.5 * m;
    return Math.abs((t + hm) % m - hm) / hm;
}

function createCanvas() {
    container = document.querySelector('.content--canvas');
    if (!container) return;

    canvas = {
        a: document.createElement("canvas"),
        b: document.createElement("canvas")
    };

    canvas.b.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events:none;
        z-index: 0;
    `;

    container.appendChild(canvas.b);

    ctx = {
        a: canvas.a.getContext("2d"),
        b: canvas.b.getContext("2d")
    };

    center = [];
}

function resize() {
    if (!canvas) return;
    canvas.a.width = innerWidth;
    canvas.a.height = innerHeight;
    ctx.a.drawImage(canvas.b, 0, 0);
    canvas.b.width = innerWidth;
    canvas.b.height = innerHeight;
    ctx.b.drawImage(canvas.a, 0, 0);
    center[0] = canvas.a.width * 0.5;
    center[1] = canvas.a.height * 0.5;
}

function initParticles() {
    tick = 0;
    simplex = new SimplexNoise();
    particleProps = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        initParticle(i);
    }
}

function initParticle(i) {
    const x = rand(canvas.a.width);
    const y = center[1] + randRange(rangeY);
    const vx = 0, vy = 0, life = 0;
    const ttl = baseTime + rand(rangeTime);
    const speed = baseSpeed + rand(rangeSpeed);
    const radius = baseRadius + rand(rangeRadius);
    const hue = baseHue + rand(rangeHue);
    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
}

function updateParticle(i) {
    const x = particleProps[i];
    const y = particleProps[i + 1];
    const n = simplex.noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
    const vx = lerp(particleProps[i + 2], cos(n), 0.5);
    const vy = lerp(particleProps[i + 3], sin(n), 0.5);
    let life = particleProps[i + 4];
    const ttl = particleProps[i + 5];
    const speed = particleProps[i + 6];
    const x2 = x + vx * speed;
    const y2 = y + vy * speed;
    const radius = particleProps[i + 7];
    const hue = particleProps[i + 8];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue);
    life++;
    particleProps[i] = x2;
    particleProps[i + 1] = y2;
    particleProps[i + 2] = vx;
    particleProps[i + 3] = vy;
    particleProps[i + 4] = life;

    if (x2 < 0 || x2 > canvas.a.width || y2 < 0 || y2 > canvas.a.height || life > ttl) {
        initParticle(i);
    }
}

function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
    ctx.a.save();
    ctx.a.lineCap = "round";
    ctx.a.lineWidth = radius;
    ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.a.beginPath();
    ctx.a.moveTo(x, y);
    ctx.a.lineTo(x2, y2);
    ctx.a.stroke();
    ctx.a.restore();
}

function drawParticles() {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
        updateParticle(i);
    }
}

function renderGlow() {
    ctx.b.save();
    ctx.b.filter = "blur(8px) brightness(200%)";
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
}

function renderToScreen() {
    ctx.b.save();
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();
}

function draw() {
    tick++;
    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
    ctx.b.fillStyle = backgroundColor;
    ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);
    drawParticles();
    renderGlow();
    renderToScreen();
    requestAnimationFrame(draw);
}

window.addEventListener("load", () => {
    createCanvas();
    resize();
    initParticles();
    draw();
});
window.addEventListener("resize", resize);

document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriter');
    const phrases = ["Hello, I am MOHAMED", "Bonjour, je suis MOHAMED", "Ciao, sono MOHAMED", "مرحبا, أنا محمد"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) 
        {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } 
        else 
        {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }
        if (!isDeleting && charIndex === currentPhrase.length) 
        {
            typeSpeed = 2000;
            isDeleting = true;
        } 
        else if (isDeleting && charIndex === 0) 
        {
            isDeleting = false;
            phraseIndex++;
            typeSpeed = 500;
            if (phraseIndex === phrases.length) 
            { 
                phraseIndex = 0; 
            }
        }
        setTimeout(type, typeSpeed);
    }

    if (textElement) 
    {
        type();
    }

    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-links a, .nav-logo, .hero-buttons a[href^="#"]');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') 
            {
                const targetSection = document.querySelector(targetId);
                if (targetSection) 
                {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            if (navLinksContainer && navLinksContainer.classList.contains('active')) 
            {
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    if (status === 'success') 
    {
        alert("Message sent successfully!");
        window.history.replaceState({}, document.title, window.location.pathname);
    } 
    else if (status === 'error') 
    {
        alert("Error: Please fill in all fields.");
    }
    else if (status === 'server_error') 
    {
        alert("Server error: Sending failed.");
    }

    const filterButtons = document.querySelectorAll('#project-filters button');
    const projectCards = document.querySelectorAll('.project-card');
    const allButton = document.querySelector('#project-filters button[data-filter="all"]');
    let activeFilters = new Set();

    if (filterButtons.length > 0) {

        filterButtons.forEach(btn => {

            btn.addEventListener('click', () => {

                const filter = btn.getAttribute('data-filter');

                if (filter === 'all') 
                {
                    activeFilters.clear();

                    filterButtons.forEach(b => b.classList.remove('active'));

                    allButton.classList.add('active');
                } 
                else 
                {
                    allButton.classList.remove('active');

                    if (activeFilters.has(filter)) 
                    {
                        activeFilters.delete(filter);
                        btn.classList.remove('active');
                    } 
                    else 
                    {
                        activeFilters.add(filter);
                        btn.classList.add('active');
                    }

                    if (activeFilters.size === 0) {
                        allButton.classList.add('active');
                    }
                }

                projectCards.forEach(card => {

                    let tags = [];

                    const dataCat = card.getAttribute('data-category');

                    if (dataCat) {
                        tags = dataCat.split(' ');
                    }

                    const spanTags = Array.from(card.querySelectorAll('.project-tags span')).map(s => s.textContent.toLowerCase());

                    tags = tags.concat(spanTags.map(t => t.toLowerCase()));

                    const show = activeFilters.size === 0 || [...activeFilters].every(f => tags.includes(f.toLowerCase()));

                    if (show) 
                    {
                        card.style.display = "flex"
                    }
                    else
                    {
                        card.style.display = "none"
                    }
                });
            });
        });
    }

    const techcarousel = document.getElementById("carousel-tech");
    if (techcarousel) 
    {
        const children = Array.from(techcarousel.children);
        for (let i = 0; i < 4; i++) 
        {
            children.forEach(child => {
                const clone = child.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                techcarousel.appendChild(clone);
            });
        }
    }

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) 
    {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) 
            {
                backToTopBtn.classList.add('visible');
            } 
            else 
            {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption'); 
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const counter = document.getElementById('lightbox-counter');
    
    let currentImages = [];
    let currentCaptions = [];
    let currentIndex = 0;

    function updateLightboxImage() {
        lightboxImg.style.opacity = 0;
        
        if(lightboxCaption)     
        {
            lightboxCaption.style.opacity = 0;
        }

        setTimeout(() => {
            if (currentImages.length > 0) 
            {
                lightboxImg.src = currentImages[currentIndex];

                if (lightboxCaption) 
                {
                    if (currentCaptions.length > currentIndex && currentCaptions[currentIndex]) 
                    {
                        lightboxCaption.textContent = currentCaptions[currentIndex];
                        lightboxCaption.style.display = 'block';
                    } 
                    else 
                    {
                        lightboxCaption.textContent = "";
                        lightboxCaption.style.display = 'none';
                    }
                }

                if (counter) 
                {
                    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                }
                
                lightboxImg.style.opacity = 1;
                
                if(lightboxCaption) 
                {
                    lightboxCaption.style.opacity = 1;
                }
            }
        }, 200);
    }

    function openLightbox(imagesArray, captionsArray) {
        currentImages = imagesArray;
        if (captionsArray)
        {
            currentCaptions = captionsArray;
            currentIndex = 0;
        }
        else
        {
            currentCaptions = [];
            currentIndex = 0;
        }
        
        if (currentImages.length <= 1) 
        {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            counter.style.display = 'none';
        } 
        else 
        {
            prevBtn.style.display = 'flex'; 
            nextBtn.style.display = 'flex';
            counter.style.display = 'block';
        }

        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFunc() 
    {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) 
            {
                return; 
            }

            const imagesAttr = card.getAttribute('data-images');
            const captionsAttr = card.getAttribute('data-captions');

            if (imagesAttr) 
            {
                const imagesList = imagesAttr.split(',').map(img => img.trim());
                let captionsList = [];

                if (captionsAttr) 
                {
                    captionsList = captionsAttr.split('/').map(cap => cap.trim());
                }

                if (imagesList.length > 0 && imagesList[0] !== "") {
                    openLightbox(imagesList, captionsList);
                }
            }
        });
    });

    if (closeBtn) 
    {
        closeBtn.addEventListener('click', closeLightboxFunc);
    }

    if (lightbox) 
    {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) 
            {
                closeLightboxFunc();
            }
        });
    }

    if (nextBtn) 
    {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        });
    }

    if (prevBtn) 
    {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        });
    }
});