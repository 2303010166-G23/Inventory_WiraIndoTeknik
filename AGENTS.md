# AGENTS

## Purpose
This repository contains a single-page static inventory web app in `index.html`. It is not a Node.js or backend project.

## What an agent should know
- The app is implemented entirely in one HTML file with embedded CSS and JavaScript.
- There is no package manager, build process, or server-side code in the workspace.
- The app currently provides:
  - a login screen
  - dashboard statistics
  - barang masuk / barang keluar forms
  - supplier management
  - laporan and transaction history
- Data is stored in an in-memory JavaScript object inside the HTML page, so changes do not persist across reloads.

## Recommended agent behavior
- Prefer editing `index.hrml` directly when adding features or fixing UI/UX.
- Avoid introducing backend frameworks or external build tooling unless the user explicitly asks for a full-stack or persistent implementation.
- If persistence is needed, suggest a simple browser-based option first (e.g. `localStorage`) or a lightweight server only after confirming requirements.
- If the user wants a deployable app, ask whether they want a static client-only version or a proper PHP/Node.js backend.

## Useful context
- The current user interface uses Font Awesome and Google Fonts via CDN.
- The app is designed for Indonesian language users.
- `index.hrml` appears to be a typo for `index.html`, but it is the active project file.
