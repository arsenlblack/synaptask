# SynapTask Documentation

<p align="center">
  <img src="static/img/logo.svg" alt="SynapTask logo" width="120"/>
</p>

Official documentation for **[SynapTask](https://synaptask.space)** — a graph-based task manager for complex projects.  
This repository contains the source of the documentation website, built with [Docusaurus 3](https://docusaurus.io).

---

## 🌐 Live Site

👉 [**docs.synaptask.space**](https://docs.synaptask.space)  

All public guides, API references, and tutorials are published here.

---

## 📂 Repository Structure

docs/                  # Markdown/MDX documentation pages
static/                # Static assets (images, icons, etc.)
src/                   # Custom React components & styling
docusaurus.config.ts   # Main Docusaurus configuration
sidebars.ts            # Sidebar configuration

---

## 🚀 Getting Started Locally

To run and preview the documentation site locally:

```bash
# Clone the repository
git clone https://github.com/arsenlblack/synaptask.git
cd synaptask

# Install dependencies
npm install

# Start local dev server
npm run start
```

Open http://localhost:3000 to see the site.  
The page will reload automatically when you edit files.

---

## 🛠️ Build & Deployment

Build optimized static files:

```bash
    npm run build
```

Serve the build locally to test production mode:

```bash
    npm run serve
```

Deployment is automated via GitHub Actions → branch `gh-pages`.  
Custom domain: docs.synaptask.space

---

## ✨ Contributing

Contributions are welcome!  
- Fix typos or improve explanations in Markdown files (/docs).  
- Update or extend API references and guides.  
- For bigger changes, open an issue first to discuss.

---

## 📜 License

Documentation content is licensed under the CC BY-SA 4.0 license.  
Code snippets and configuration examples are provided under the MIT license.

---

<p align="center"> Made with ❤️ by the SynapTask team </p> ```
