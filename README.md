<h1>
  <img src="public/DinoLogo.svg" width="93" height="92" alt="Planossauro Logo" />
  Planossauro Frontend
</h1>

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Vue](https://img.shields.io/badge/Vue-3.5-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)

Planosaurus is a planning management platform that allows users to create, manage, and preview weekly and daily planning documents with customizable templates.

## Features

- **Planning Management**: Create and manage weekly and daily plans
- **Document Preview**: Real-time document preview with multiple template styles
- **Template Customization**: Choose from various template styles and types
- **Authentication**: GitHub and Google OAuth integration
- **Payments**: Stripe integration for subscription plans
- **Internationalization**: Support for Portuguese (Brazil) and English
- **Dark/Light Mode**: Toggle between themes

## Screenshots

| Dashboard | Plan Editor |
|-----------|-------------|
| ![Dashboard](src/assets/screenshots/screenshot1.png) | ![Plan Editor](src/assets/screenshots/screenshot2.png) |

| Template Selection | Document Preview |
|--------------------|------------------|
| ![Templates](src/assets/screenshots/screenshot3.png) | ![Preview](src/assets/screenshots/screenshot4.png) |

## Prerequisites

- Node.js 18+ and npm
- A running backend server (or configure `VITE_API_URL` for API endpoints)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd planossauro-frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Docker

### Development

```bash
docker build -f dev.Dockerfile -t planossauro-dev .
docker run -p 5173:5173 -v $(pwd):/app planossauro-dev
```

### Production

```bash
docker build -t planossauro .
docker run -p 8080:8080 planossauro
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Linting

Run the linter:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
```

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Router**: Vue Router 4
- **State Management**: Vue Provide/Inject with Composition API
- **Internationalization**: Vue i18n
- **HTTP Client**: Axios
- **Date Picker**: @vuepic/vue-datepicker
- **UI Icons**: PrimeIcons
- **Utilities**: VueUse, Lodash ES
- **Document Generation**: docxtemplater, pizzip
- **Styling**: SCSS

## License

Private - All rights reserved
