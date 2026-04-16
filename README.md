# 🎓 PathCredit Logger for Studor

A robust, modern, single-page React application designed to help users log their personal milestones, events, and extra-curricular activities efficiently. Developed natively with a clean, Studor-inspired brand identity.

## ✨ Features

- **Activity Form**: Easily log activities providing a customized Name, Category, and Date.
- **Dynamic Activity Feed**: A list view populated automatically upon logging, showcasing color-coded category badges.
- **Live Filtering**: Sort through your events via a dropdown menu containing categories like Academic, Technical, Cultural, and Sports.
- **Offline Persistence**: The app leverages browser `localStorage` ensuring your path data doesn't disappear when you refresh the page.
- **Premium UI/UX**: Built with hover micro-interactions, custom icons, an elegant "Empty State," and soft shadows.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) to guarantee blazing fast load times.
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) for strict component-level UI designs.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, scalable vectors. 

---

## 🚀 Getting Started

If you dragged this project onto a new computer or just downloaded it, follow these steps to get your app running in under a minute.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### 1. Install Dependencies
Open your terminal inside the `Studor` folder and run:
```bash
npm install
```
*(This downloads all the necessary code tools to make the app work).*

### 2. Start the Development Server
```bash
npm run dev
```
Open the `http://localhost:5173` link printed in your terminal in your browser (like Chrome or Safari).

---

## 📱 How to View on Your Phone or Another Computer (Same Wi-Fi)

To view the logger on another device that shares the same network:
1. In your terminal, stop the current server (press `Ctrl + C`).
2. Run this networking command instead:
```bash
npm run dev -- --host
```
3. Look at your terminal for a link that says **Network** (e.g., `http://192.168.1.100:5173/`). Type that exact URL into your mobile device.

---

## 🏗️ Building for Production

Ready to share your platform with the world? You can bundle the app so it's optimized and ready to upload to a web host (like Vercel, Netlify, or GitHub Pages):

```bash
npm run build
```
This generates a `dist` directory with all of the finalized HTML/CSS/JS ready to deploy!
