(() => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  const canvas = document.getElementById("net");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let w, h, nodes = [];
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(55, Math.floor(w / 28));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = "rgba(110,170,255,0.85)";
      ctx.arc(a.x, a.y, 2, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 140) {
          ctx.strokeStyle = `rgba(120,160,255,${(1 - d / 140) * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  resize();
  draw();
  window.addEventListener("resize", resize);
})();
