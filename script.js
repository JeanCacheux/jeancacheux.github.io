
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

  carousel.addEventListener('pointerdown', e => {
    dragging = true; paused = true; startX = e.clientX; startOffset = offset;
    carousel.classList.add('dragging'); carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener('pointermove', e => {
    if (!dragging) return;
    offset = startOffset - (e.clientX - startX);
    const limit = halfWidth();
    while (offset < 0) offset += limit;
    while (offset >= limit) offset -= limit;
    render();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false; paused = false; carousel.classList.remove('dragging');
    try { carousel.releasePointerCapture(e.pointerId); } catch {}
  }

  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);

  render();
  requestAnimationFrame(tick);
}
