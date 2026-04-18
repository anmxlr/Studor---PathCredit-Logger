# 🚀 PathCredit Logger for Studor

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)

**PathCredit Logger** is a professional, high-performance single-page application built for **Studor** to track academic, technical, cultural, and sports milestones. It provides a clean and intuitive interface for logging activities with rich media support and persistent local storage.

---

## ✨ Key Features

- **📝 Comprehensive Logging**: Record activity names, categories, dates, and detailed descriptions.
- **🖼️ Media Attachments**: Support for up to **2 images** per log for visual proof.
- **📄 Document Support**: Attach certificates or supporting documents (PDF, Image, Word).
- **🔍 Smart Filtering**: Organize and view your feed by categories: *Academic, Technical, Cultural, Sports*.
- **⚡ Performance First**: Built with Vanilla JS and Vite for lightning-fast interactions and zero bloat.
- **💾 Local Persistence**: All data is saved directly in your browser's `localStorage`—no backend required.
- **🛡️ Custom Modals**: Tailored UI for delete confirmations, activity details, and media previews.
- **📱 Responsive Design**: A premium, mobile-friendly interface with sleek animations and micro-interactions.

---

## 🛠️ Project Structure

```text
Studor/
├── public/              # Static assets (logos, icons)
├── src/
│   ├── main.js         # Core application logic & state management
│   └── style.css       # Design system and component styling
├── index.html          # Main entry point & layout
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anmxlr/Studor---PathCredit-Logger.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production

Build the optimized application for deployment:
```bash
npm run build
```

---

## 📖 Using the App

1. **Log Activity**: Fill out the form on the left. You can add a description and attach images or documents.
2. **Review Feed**: Your activities appear on the right. Use the filter dropdown to narrow down specific categories.
3. **View Details**: Click on any activity card to open a full details view with high-res previews of attachments.
4. **Manage Logs**: Use the **Edit** (pencil) or **Delete** (trash) icons to modify or remove entries. Deleting requires a custom confirmation.

---

## 🔒 Data & Privacy

- **Local Storage**: All your logged data, including base64-encoded images and documents, is stored in your browser's `localStorage`.
- **Privacy**: No data is sent to any server. Your milestones stay on your device.
- **Storage Limits**: Note that `localStorage` has a limit (typically ~5MB-10MB). Attaching many large images may eventually clear the storage or cause errors.

---

## 🔮 Future Roadmap

To further enhance the PathCredit Logger, the following features could be implemented:

- **🔐 User Authentication**: Enable secure logins to sync activity logs across multiple devices and browsers.
- **📊 Analytics Dashboard**: Visual charts and graphs to track progress and activity distribution over time.
- **☁️ Cloud Storage**: Transition from `localStorage` to a cloud-based database (like Firebase) for limitless storage of attachments.
- **📥 Export Options**: Download your activity feed as a professional PDF report or CSV for external use.
- **🌙 Dark Mode**: A sleek dark theme option for better accessibility and night-time use.
- **🔍 Advanced Search**: Real-time search functionality to quickly find specific logs by keywords.
- **🎯 Milestone Goals**: Set and track specific targets/goals for each category.
- **🌍 Social Sharing**: Ability to share achievements or certificates directly to social profiles or via email.

---

Developed for **Studor**.

