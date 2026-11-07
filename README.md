<div align="center">

# ATS CV Maker

An **ATS-friendly** CV editor built on Nuxt 4 — fill in the form, watch the live preview, export to PDF.

[![Status](https://img.shields.io/badge/status-%F0%9F%9A%A7%20work%20in%20progress-orange?style=flat-square)](#)
[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?style=flat-square&logo=nuxt&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**English** · [Bahasa Indonesia](README.id.md)

</div>

---

> ## 🚧 This project is unfinished
>
> The editor and PDF export work, but **nothing is persisted — your CV is lost on page refresh**. There are no theme presets, no autosave, and no input validation yet. See the [Roadmap](#-roadmap) below.

---

## About

Many CVs are rejected early because an **Applicant Tracking System (ATS)** cannot read them — multi-column layouts, tables, icons, and unusual fonts all break text extraction. This project produces CVs with a plain-text structure that survives parsing while still looking tidy.

Built with Nuxt 4, a reactive client-side editor, and **Puppeteer** on the server to render a real PDF (rather than the browser's built-in `print`).

## What Already Works

- A structured form for personal details, summary, work experience, education, and skills.
- The preview panel updates as you type.
- Two sliders: font size (4–24pt) and element spacing (8–32px).
- PDFs render server-side through `/api/generate-pdf` (Puppeteer), so the output is identical across browsers.
- On small screens, editor and preview collapse into separate tabs.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Nuxt 4 |
| UI | Vue 3 + SCSS |
| Language | TypeScript |
| Icons | `@lucide/vue` |
| PDF | Puppeteer (server-side) |
| Fonts | `@nuxt/fonts` |

## Getting Started

```bash
git clone https://github.com/Ilhamaji/ats-cv-maker.git
cd ats-cv-maker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Puppeteer downloads Chromium (~150 MB) during `npm install` — budget time and disk for it.

## Project Layout

```
app/
  app.vue                    # main layout, mobile tabs, slider controls
  components/
    CvEditor.vue             # CV editing form
    CvPreview.vue            # document preview
  assets/scss/main.scss      # styling and glass system
server/api/generate-pdf.post.ts   # PDF render via Puppeteer
public/pdf/CV_John_Doe.pdf        # sample output
```

## 🗺️ Roadmap

### High priority
- [ ] **Persistence** — save to `localStorage` (or IndexedDB) so a refresh does not wipe the CV.
- [ ] **Autosave and draft recovery** — save periodically and restore the last draft.
- [ ] **Input validation** — check email, phone, and LinkedIn URL formats before export.
- [ ] **JSON import/export** — save a CV to a file and re-edit it on another device.

### Medium priority
- [ ] **Template presets** — 3–5 layout variants that all pass ATS checks.
- [ ] **Multiple CVs** — keep several versions (e.g. one per job application).
- [ ] **Drag-and-drop reordering** — rearrange sections and experience entries.
- [ ] **More sections** — certification, languages, and projects.

### Low priority
- [ ] **ATS score** — a simple indicator of how parser-safe the CV is (flags tables and multi-column layouts).
- [ ] **Cover letter generator** — build a cover letter from the CV data.
- [ ] **Dark mode** for the editor.
- [ ] **Unit tests** for the editor components and the PDF endpoint.

### Known gaps and bugs
- [ ] `public/pdf/CV_John_Doe.pdf` is still dummy data — replace it with a real sample.
- [ ] No error handling when Puppeteer fails to launch (e.g. a server without Chromium).
- [ ] PDF page numbers and header/footer are not configurable.

---

<div align="center">
Built by <a href="https://github.com/Ilhamaji">Ilham Aji</a>
</div>
