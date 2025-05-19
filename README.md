# Next.js 3D Avatar & Clothing Fitter

A simple web application built with Next.js, React, Three.js (via @react-three/fiber), and Material UI that allows users to upload a 3D avatar model and fit a piece of clothing onto it.

## Features

-   **Upload Avatar:** Users can upload 3D avatar models in GLB/GLTF format.
-   **Upload Clothing:** Users can upload 3D clothing models in GLB/GLTF format.
-   **3D Viewport:**
    -   Interactive camera (orbit, zoom, pan) using OrbitControls.
    -   Avatar is automatically centered in the scene.
    -   Clothing is positioned relative to the avatar (basic fit - relies on model origins).
    -   Basic lighting setup (ambient and directional lights).
    -   Environment mapping for reflections.
-   **Material UI Control Panel:**
    -   Buttons for uploading avatar and clothing.
    -   Toggle switch to show/hide clothing.
    -   Button to reset or clear the scene.
    -   Loading indicators while models are being processed.
-   **Bonus Features:**
    -   **Drag-and-Drop Upload:** Files can be dragged onto the upload button areas.
    -   **Garment Color Picker:** Change the color of the loaded garment.
    -   **Loading Spinners:** Visual feedback during model loading.

## Tech Stack

-   **Next.js:** React framework for server-side rendering, static site generation, and routing.
-   **React.js:** JavaScript library for building user interfaces.
-   **Three.js:** 3D graphics library.
    -   **@react-three/fiber:** React reconciler for Three.js, enabling a declarative way to build 3D scenes.
    -   **@react-three/drei:** Helper components and utilities for @react-three/fiber.
-   **Material UI (MUI):** React component library for a clean and modern UI.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourGitHubUsername/nextjs-threejs-avatar-fitter.git
    cd nextjs-threejs-avatar-fitter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Code Structure

-   `pages/index.js`: Main application page, manages state and layout.
-   `components/ThreeScene.js`: Handles all 3D rendering logic using @react-three/fiber.
    -   `Avatar` component: Loads and centers the avatar model.
    -   `Clothing` component: Loads the clothing model, handles visibility and color changes.
    -   `Model` component: Generic GLTF model loader using `useGLTF` and `Suspense`.
-   `components/ControlPanel.js`: MUI-based UI for user interactions.
    -   `FileInput` component: Reusable file input with drag-and-drop support.
-   `pages/_app.js`: Custom Next.js App component for MUI theme integration.
-   `src/theme.js`: MUI theme configuration.
-   `public/`: For any static assets (though models are dynamically uploaded).

## Notes on 3D Models

-   **Avatar Models:** For best results, use avatars in a T-pose or A-pose. The system will attempt to center them.
-   **Clothing Models:** Clothing models should be designed to fit a standard, centered T-pose/A-pose avatar. The origin/pivot point of the clothing model is crucial for correct "basic fitting". If a clothing item appears at the avatar's feet, its origin is likely too low.
-   **Format:** GLB (binary GLTF) is generally recommended as it's a single file. GLTF with separate .bin and texture files will also work if the paths are relative and correct.

## (Optional) Screenshots/Video
