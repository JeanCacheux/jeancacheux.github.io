document.documentElement.classList.add("js-animations");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let particles = [];
let pointer = { x: -9999, y: -9999 };

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(210, Math.floor((width * height) / 7600));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.22 + Math.random() * 0.42,
    phase: Math.random() * Math.PI * 2,
    size: 0.7 + Math.random() * 1.5
  }));
}

function updatePointer(x, y) {
  pointer.x = x;
  pointer.y = y;
}

window.addEventListener("pointermove", (e) => updatePointer(e.clientX, e.clientY));
window.addEventListener("pointerleave", () => updatePointer(-9999, -9999));
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) updatePointer(t.clientX, t.clientY);
}, { passive: true });

function animate(time) {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    const field =
      Math.sin((p.y + time * 0.03) * 0.008 + p.phase) +
      Math.cos((p.x - time * 0.02) * 0.006);

    p.x += Math.cos(field) * p.speed;
    p.y += Math.sin(field) * p.speed;

    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 120) {
      const force = (120 - dist) / 120;
      p.x += (dx / (dist || 1)) * force * 1.4;
      p.y += (dy / (dist || 1)) * force * 1.4;
    }

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = i % 13 === 0
      ? "rgba(239, 51, 78, 0.34)"
      : "rgba(80, 189, 211, 0.29)";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

resize();
window.addEventListener("resize", resize);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(animate);
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}


// Automatic publications: fast, non-blocking and failure-safe.
(() => {
  const ORCID = "0000-0001-6671-5533";
  const list = document.getElementById("publication-list");
  const status = document.getElementById("publication-update-status");
  if (!list || list.dataset.autoPublications !== "true") return;

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const authorName = (authorship) => authorship?.author?.display_name || "";

  function jeanPosition(work) {
    const authors = work.authorships || [];
    const index = authors.findIndex((entry) => {
      const orcid = entry?.author?.orcid || "";
      return orcid.endsWith(ORCID);
    });

    if (index < 0) return { priority: 0, label: "" };
    if (index === 0) return { priority: 3, label: "First author" };
    if (index === authors.length - 1) return { priority: 3, label: "Last author" };
    if (index === authors.length - 2) return { priority: 2, label: "Penultimate author" };
    return { priority: 1, label: "" };
  }

  function isJournalArticle(work) {
    const locations = work.locations || [];
    const source = work.primary_location?.source;
    const journal =
      source?.type === "journal" ||
      locations.some((location) => location?.source?.type === "journal");

    return work.type === "article" && journal && !work.is_retracted;
  }

  function journalName(work) {
    return (
      work.primary_location?.source?.display_name ||
      work.locations?.find((location) => location?.source?.type === "journal")
        ?.source?.display_name ||
      "International journal"
    );
  }

  function workUrl(work) {
    return (
      work.doi ||
      work.primary_location?.landing_page_url ||
      work.primary_location?.pdf_url ||
      work.id ||
      "#"
    );
  }

  function formattedAuthors(work) {
    const names = (work.authorships || []).map(authorName).filter(Boolean);
    return names.length <= 6
      ? names.join(", ")
      : `${names.slice(0, 5).join(", ")} et al.`;
  }

  function chooseWorks(works) {
    const eligible = works.filter(isJournalArticle);
    const lead = eligible
      .filter((work) => jeanPosition(work).priority >= 2)
      .sort((a, b) =>
        String(b.publication_date || "").localeCompare(String(a.publication_date || ""))
      );

    const newest = eligible
      .sort((a, b) =>
        String(b.publication_date || "").localeCompare(String(a.publication_date || ""))
      );

    const selected = [];
    const seen = new Set();

    // First take the newest first/last/penultimate-author papers.
    for (const work of lead) {
      if (selected.length >= 4) break;
      const key = work.doi || work.id;
      if (!seen.has(key)) {
        selected.push(work);
        seen.add(key);
      }
    }

    // Complete with the newest journal papers if fewer than four qualify.
    for (const work of newest) {
      if (selected.length >= 4) break;
      const key = work.doi || work.id;
      if (!seen.has(key)) {
        selected.push(work);
        seen.add(key);
      }
    }

    // Keep the final selection chronologically ordered.
    return selected.sort((a, b) =>
      String(b.publication_date || "").localeCompare(String(a.publication_date || ""))
    );
  }

  function render(works) {
    list.innerHTML = works
      .map((work) => {
        const position = jeanPosition(work);
        const positionHtml = position.label
          ? `<span class="authorship-role">${escapeHtml(position.label)}</span>`
          : "";

        return `
          <article class="publication">
            <div class="pub-year">${escapeHtml(work.publication_year || "")}</div>
            <div>
              <h3>${escapeHtml(work.title || "Untitled publication")}</h3>
              <p>${escapeHtml(formattedAuthors(work))} · <em>${escapeHtml(journalName(work))}</em></p>
              ${positionHtml ? `<div class="publication-meta">${positionHtml}</div>` : ""}
            </div>
            <a href="${escapeHtml(workUrl(work))}" target="_blank" rel="noreferrer" aria-label="Open publication">↗</a>
          </article>
        `;
      })
      .join("");
  }

  async function refreshPublications() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);

    const filter = [
      `author.orcid:${ORCID}`,
      "type:article",
      "is_retracted:false"
    ].join(",");

    const fields = [
      "id",
      "doi",
      "title",
      "publication_year",
      "publication_date",
      "type",
      "is_retracted",
      "authorships",
      "primary_location",
      "locations"
    ].join(",");

    const url =
      `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}` +
      `&sort=publication_date:desc&per-page=40` +
      `&select=${encodeURIComponent(fields)}` +
      `&mailto=${encodeURIComponent("jean.cacheux@laas.fr")}`;

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`OpenAlex HTTP ${response.status}`);

      const data = await response.json();
      const chosen = chooseWorks(data.results || []);

      if (chosen.length) {
        render(chosen);
        if (status) {
          status.textContent =
            "Automatically refreshed from OpenAlex. Full publication record available on Google Scholar.";
        }
      }
    } catch (error) {
      console.warn("Automatic publication refresh unavailable; keeping fallback list.", error);
      if (status) {
        status.textContent =
          "Curated publications shown. Automatic refresh is temporarily unavailable.";
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }

  // The static list is already visible; refresh quietly after the page has loaded.
  if ("requestIdleCallback" in window) {
    requestIdleCallback(refreshPublications, { timeout: 1200 });
  } else {
    window.setTimeout(refreshPublications, 250);
  }
})();
