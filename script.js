\
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

  const count = Math.min(165, Math.floor((width * height) / 10000));
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
      ? "rgba(239, 51, 78, 0.24)"
      : "rgba(80, 189, 211, 0.19)";
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

// Publications
const OPENALEX_ORCID = "https://orcid.org/0000-0001-6671-5533";
const OPENALEX_MAILTO = "jean.cacheux@laas.fr";
const publicationList = document.getElementById("publication-list");
const publicationStatus = document.getElementById("publication-status");
const publicationTabs = document.querySelectorAll("[data-publication-mode]");
let publicationData = [];
let publicationMode = "recent";
let openAlexAuthorId = "";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAuthors(authorships = []) {
  const names = authorships.map((item) => item?.author?.display_name).filter(Boolean);
  if (names.length <= 5) return names.join(", ");
  return `${names.slice(0, 4).join(", ")} et al.`;
}

function journalName(work) {
  return (
    work?.primary_location?.source?.display_name ||
    work?.locations?.find((location) => location?.source?.type === "journal")?.source?.display_name ||
    "Journal article"
  );
}

function publicationUrl(work) {
  return (
    work?.doi ||
    work?.primary_location?.landing_page_url ||
    work?.primary_location?.pdf_url ||
    work?.id ||
    "#"
  );
}

function isJournalArticle(work) {
  const sourceType = work?.primary_location?.source?.type;
  const hasJournalLocation = work?.locations?.some(
    (location) => location?.source?.type === "journal"
  );

  return (
    work?.type === "article" &&
    !work?.is_retracted &&
    (sourceType === "journal" || hasJournalLocation)
  );
}

function jeanAuthorship(work) {
  const authorships = work?.authorships || [];
  const index = authorships.findIndex((item) => item?.author?.id === openAlexAuthorId);
  if (index < 0) return { index: -1, total: authorships.length, role: "Author" };

  const total = authorships.length;
  let role = "Middle author";
  if (index === 0) role = "First author";
  else if (index === total - 1) role = "Last author";
  else if (index === total - 2) role = "Penultimate author";

  return { index, total, role };
}

function selectedPublications() {
  const sorted = [...publicationData];

  if (publicationMode === "lead") {
    return sorted
      .filter((work) => {
        const { index, total } = jeanAuthorship(work);
        return index === 0 || index === total - 1 || index === total - 2;
      })
      .sort((a, b) =>
        String(b.publication_date || "").localeCompare(String(a.publication_date || ""))
      )
      .slice(0, 6);
  }

  return sorted
    .sort((a, b) =>
      String(b.publication_date || "").localeCompare(String(a.publication_date || ""))
    )
    .slice(0, 6);
}

function renderPublications() {
  if (!publicationList) return;

  const works = selectedPublications();
  if (!works.length) {
    publicationStatus.textContent =
      publicationMode === "lead"
        ? "No matching first, last or penultimate-author journal articles were found."
        : "No journal articles were found.";
    publicationList.innerHTML = "";
    return;
  }

  publicationStatus.textContent = "";
  publicationList.innerHTML = works
    .map((work) => {
      const year = work.publication_year || "";
      const title = escapeHtml(work.title || "Untitled publication");
      const authors = escapeHtml(formatAuthors(work.authorships));
      const journal = escapeHtml(journalName(work));
      const url = escapeHtml(publicationUrl(work));
      const authorship = jeanAuthorship(work);
      const role = escapeHtml(authorship.role);

      return `
        <article class="publication">
          <div class="pub-year">${escapeHtml(year)}</div>
          <div>
            <h3>${title}</h3>
            <p>${authors} · <em>${journal}</em></p>
            <div class="publication-meta">
              <span class="authorship-role">${role}</span>
            </div>
          </div>
          <a href="${url}" target="_blank" rel="noreferrer" aria-label="Open ${title}">↗</a>
        </article>
      `;
    })
    .join("");
}

async function loadPublications() {
  if (!publicationList) return;

  try {
    const authorResponse = await fetch(
      `https://api.openalex.org/authors/https://orcid.org/0000-0001-6671-5533?mailto=${encodeURIComponent(OPENALEX_MAILTO)}`
    );
    if (!authorResponse.ok) throw new Error(`OpenAlex author lookup returned ${authorResponse.status}`);

    const author = await authorResponse.json();
    openAlexAuthorId = author.id;

    const filter = [
      `author.id:${openAlexAuthorId}`,
      "type:article",
      "is_retracted:false",
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
      "locations",
    ].join(",");

    const url =
      `https://api.openalex.org/works?filter=${encodeURIComponent(filter)}` +
      `&select=${encodeURIComponent(fields)}` +
      `&per-page=100&mailto=${encodeURIComponent(OPENALEX_MAILTO)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`OpenAlex works lookup returned ${response.status}`);

    const payload = await response.json();
    publicationData = (payload.results || []).filter(isJournalArticle);
    renderPublications();
  } catch (error) {
    console.error(error);
    publicationStatus.innerHTML =
      'The automatic publication list is temporarily unavailable. ' +
      '<a href="https://scholar.google.com/citations?user=5zyfPC8AAAAJ" target="_blank" rel="noreferrer">Open Google Scholar ↗</a>';
  }
}

publicationTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    publicationMode = tab.dataset.publicationMode;
    publicationTabs.forEach((button) => {
      const selected = button === tab;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    renderPublications();
  });
});

loadPublications();
