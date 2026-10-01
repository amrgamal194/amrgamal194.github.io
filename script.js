(() => {
  const year = document.getElementById("y");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  // Cursor glow
  const glow = document.getElementById("cursorGlow");
  window.addEventListener("pointermove", (e) => {
    if (!glow) return;
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  // Particles
  const canvas = document.getElementById("particles");
  const ctx = canvas?.getContext("2d");
  let particles = [];
  const resize = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  const initParticles = () => {
    particles = Array.from({ length: Math.min(60, Math.floor(window.innerWidth / 18)) }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };
  const drawParticles = () => {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(110,231,255,0.55)";
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  };
  if (canvas && ctx && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resize(); initParticles(); drawParticles();
    window.addEventListener("resize", () => { resize(); initParticles(); });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) en.target.classList.add("visible"); }),
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));

  // Typewriter
  const phrases = ["thinks with you.", "ships AI agents.", "powers products.", "automates work."];
  const typeEl = document.getElementById("typeTarget");
  let pi = 0, ci = 0, deleting = false;
  const typeLoop = () => {
    if (!typeEl) return;
    const word = phrases[pi];
    typeEl.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) ci++;
    else if (!deleting && ci === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    } else if (deleting && ci > 0) ci--;
    else { deleting = false; pi = (pi + 1) % phrases.length; }
    setTimeout(typeLoop, deleting ? 35 : 70);
  };
  typeLoop();

  // Count-up stats
  const nums = document.querySelectorAll(".stat-num");
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = Number(el.dataset.count || 0);
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        n = Math.min(target, n + step);
        el.textContent = String(n);
        if (n < target) requestAnimationFrame(tick);
      };
      tick();
      countIo.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach((el) => countIo.observe(el));

  // 3D tilt
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-2px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  // Magnetic buttons
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });

  // AI Lab demo
  const plans = {
    summarize: [
      "> goal: summarize a doc",
      "✓ ingest document chunks",
      "✓ extract key claims",
      "✓ draft concise brief",
      "✓ cite source sections",
      "★ done — summary ready",
    ],
    research: [
      "> goal: research a topic",
      "✓ clarify research question",
      "✓ gather sources",
      "✓ cluster insights",
      "✓ write structured notes",
      "★ done — research pack ready",
    ],
    automate: [
      "> goal: automate a workflow",
      "✓ map current steps",
      "✓ pick tools / APIs",
      "✓ design agent loop",
      "✓ add human checkpoints",
      "★ done — automation plan ready",
    ],
    build: [
      "> goal: build a feature",
      "✓ define user story",
      "✓ sketch UI flow",
      "✓ wire AI capability",
      "✓ ship MVP + iterate",
      "★ done — build plan ready",
    ],
  };
  let goal = "summarize";
  const log = document.getElementById("agentLog");
  const chips = document.getElementById("goalChips");
  chips?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    chips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    goal = btn.dataset.goal;
    if (log) log.textContent = `> selected: ${btn.textContent.trim()}\n  press Run agent ▶`;
  });
  if (log) log.textContent = "> ready\n  pick a goal, then Run agent ▶";

  let running = false;
  document.getElementById("runAgent")?.addEventListener("click", async () => {
    if (running || !log) return;
    running = true;
    log.textContent = "";
    const lines = plans[goal] || plans.summarize;
    for (const line of lines) {
      log.textContent += line + "\n";
      log.parentElement.scrollTop = log.parentElement.scrollHeight;
      await new Promise((r) => setTimeout(r, 420));
    }
    running = false;
  });

  document.getElementById("scrollLab")?.addEventListener("click", () => {
    document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" });
  });
})();
