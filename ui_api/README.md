# Demo E-Commerce Frontend

A demo e-commerce React app is available in the `frontend-demo/` directory. It uses Redux and TypeScript, and can be started with:

```
cd frontend-demo
npm install --legacy-peer-deps
npm start
```

This app is currently set up with mock API calls. To connect it to your backend, update the API logic in `src/features/` to use real HTTP requests to your backend endpoints.

---

# Auto Wireframes

This project is a full-stack application for automatic wireframe generation, featuring:
- **React** frontend (in `frontend/`)
- **Node.js/Express** backend (in `backend/`)
- **GitHub Actions** workflow for automatic wireframe generation on push/PR

## Usage

- On every push or pull request to `main`, the GitHub Action runs the wireframe generation script.
- The backend's `generate-wireframe.js` script creates a sample SVG wireframe in the frontend's `public/` folder.

## Local Development

1. **Install dependencies:**
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. **Run backend:**
   - `node backend/generate-wireframe.js` (for wireframe generation)
   - Or set up an Express server as needed
3. **Run frontend:**
   - `npm start` inside `frontend/`

## Customization
- Replace the logic in `backend/generate-wireframe.js` with your own wireframe generation code.

---

**Note:** The React app was scaffolded with Create React App (PWA template). If you encounter dependency issues, use `npm install --legacy-peer-deps` in the frontend directory.
