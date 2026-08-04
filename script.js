
document.getElementById('year').textContent = new Date().getFullYear();

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), particles = [];
function resizeParticles(){
  width = innerWidth; height = innerHeight;
  canvas.width = width*dpr; canvas.height = height*dpr;
  canvas.style.width = width+'px'; canvas.style.height = height+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const n = Math.min(180, Math.floor(width*height/9000));
  particles = Array.from({length:n},()=>({x:Math.random()*width,y:Math.random()*height,s:.2+Math.random()*.35,p:Math.random()*Math.PI*2,r:.6+Math.random()*1.3}));
}
function drawParticles(t){
  ctx.clearRect(0,0,width,height);
  for(let i=0;i<particles.length;i++){
    const q=particles[i];
    const f=Math.sin((q.y+t*.025)*.008+q.p)+Math.cos((q.x-t*.018)*.006);
    q.x+=Math.cos(f)*q.s; q.y+=Math.sin(f)*q.s;
    if(q.x<-10)q.x=width+10;if(q.x>width+10)q.x=-10;if(q.y<-10)q.y=height+10;if(q.y>height+10)q.y=-10;
    ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,Math.PI*2);
    ctx.fillStyle=i%15===0?'rgba(239,51,78,.20)':'rgba(80,189,211,.18)';ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
resizeParticles(); addEventListener('resize',resizeParticles);
if(!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(drawParticles);

// Reliable JS-driven infinite carousel.
const carousel = document.getElementById('research-carousel');
const track = carousel?.querySelector('.carousel-track');
if (carousel && track) {
  const original = Array.from(track.children);
  original.forEach(node => track.appendChild(node.cloneNode(true)));

  let offset = 0;
  let paused = false;
  let dragging = false;
  let startX = 0;
  let startOffset = 0;
  let last = performance.now();
  const speed = 34; // pixels per second

  function halfWidth() {
    return track.scrollWidth / 2;
  }

  function render() {
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  }

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!paused && !dragging) {
      offset += speed * dt;
      const limit = halfWidth();
      if (limit > 0 && offset >= limit) offset -= limit;
      render();
    }
    requestAnimationFrame(tick);
  }

  carousel.addEventListener('mouseenter', () => paused = true);
  carousel.addEventListener('mouseleave', () => { if (!dragging) paused = false; });
  carousel.addEventListener('touchstart', () => paused = true, {passive:true});
  carousel.addEventListener('touchend', () => paused = false, {passive:true});

  let pointerActive = false;
  let dragMoved = false;
  const dragThreshold = 7;

  carousel.addEventListener('pointerdown', e => {
    // Do not capture clicks that begin on a link or another interactive control.
    // Firefox may otherwise treat the pointer capture as a drag and cancel navigation.
    if (e.button !== 0 || e.target.closest('a, button, input, select, textarea')) {
      paused = true;
      return;
    }

    pointerActive = true;
    dragMoved = false;
    startX = e.clientX;
    startOffset = offset;
  });

  carousel.addEventListener('pointermove', e => {
    if (!pointerActive) return;

    const deltaX = e.clientX - startX;

    if (!dragging && Math.abs(deltaX) < dragThreshold) return;

    if (!dragging) {
      dragging = true;
      dragMoved = true;
      paused = true;
      carousel.classList.add('dragging');
      try { carousel.setPointerCapture(e.pointerId); } catch {}
    }

    offset = startOffset - deltaX;
    const limit = halfWidth();
    if (limit > 0) {
      while (offset < 0) offset += limit;
      while (offset >= limit) offset -= limit;
    }
    render();
    e.preventDefault();
  });

  function endDrag(e) {
    pointerActive = false;

    if (dragging) {
      dragging = false;
      carousel.classList.remove('dragging');
      try { carousel.releasePointerCapture(e.pointerId); } catch {}
    }

    paused = false;
  }

  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);

  // Keep the carousel paused while a highlight link is hovered or focused.
  carousel.addEventListener('focusin', e => {
    if (e.target.closest('a')) paused = true;
  });

  carousel.addEventListener('focusout', e => {
    if (e.target.closest('a')) paused = false;
  });

  carousel.addEventListener('click', e => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved = false;
    }
  }, true);

  render();
  requestAnimationFrame(tick);
}


// Subtle parallax for research images.
const parallaxCards = document.querySelectorAll(".parallax-card");

function updateParallax() {
  const viewportCenter = window.innerHeight / 2;

  parallaxCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    const normalized = Math.max(-1, Math.min(1, (cardCenter - viewportCenter) / window.innerHeight));
    card.style.setProperty("--parallax-y", `${normalized * -12}px`);
  });
}

let parallaxScheduled = false;
function scheduleParallax() {
  if (parallaxScheduled) return;
  parallaxScheduled = true;

  requestAnimationFrame(() => {
    updateParallax();
    parallaxScheduled = false;
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", scheduleParallax, { passive: true });
  window.addEventListener("resize", scheduleParallax);
  updateParallax();
}
