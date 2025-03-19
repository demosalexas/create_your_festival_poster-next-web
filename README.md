# 🎸 Festival Poster Generator  

A **React** application that lets you create and customize your own **music festival poster**. You can add artists, change festival details, customize colors, and export the poster as a **PNG image**.

---

## 🚀 Features

- ✅ **Edit Festival Details** – Change the name, date, and location of your festival.  
- ✅ **Add & Organize Artists** – Assign artists to specific festival days and reorder them.  
- ✅ **Customize Appearance** – Choose background colors with a **gradient effect**.  
- ✅ **Live Preview** – See real-time updates while editing.  
- ✅ **Export as PNG** – Download your poster for sharing or printing.  

---

## 🛠️ Installation & Setup  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/demosalexas/create_your_festival_poster-next-web.git
cd create_your_festival_poster-next-web
```

### 2️⃣ Install dependencies  
```sh
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Run the development server  
```sh
npm run dev
# or
yarn dev
# or
pnpm dev
```
The app will be available at **http://localhost:3000**.

---

## 🎨 How to Use  

### **1️⃣ Edit Festival Details**
- Enter a **festival name**, **date**, and **location**.
- Changes update **in real-time** on the poster.

### **2️⃣ Add Artists**
- Type the artist's name and select a festival day.
- Each day **supports up to 6 artists**.
- Click **➕ Add Artist** to insert them.

### **3️⃣ Organize Artists**
- Use **⬆️ Move Up** and **⬇️ Move Down** to adjust artist positions.
- Drag & drop artists between days.
- Remove artists with the **❌ button**.

### **4️⃣ Customize Background**
- Choose two colors for the **gradient background**.
- The **linear gradient** automatically updates.

### **5️⃣ Export as PNG**
- Click **📥 "Export as PNG"** to download your poster.
- The poster will be saved as `festival-name-poster.png`.

---

## ⚙️ Tech Stack  

This project is built using:  

- **React & Next.js** – Frontend framework.  
- **Tailwind CSS** – Styling and layout.  
- **Lucide React** – Icons.  
- **html2canvas-pro** – Converts poster to PNG.  
- **useMemo & useCallback** – Optimized rendering.  

---

## 📂 Project Structure  

```
/src
│── /components
│   ├── ui/button.tsx
│   ├── ui/input.tsx
│   ├── ui/card.tsx
│   ├── ui/slider.tsx
│   ├── ui/label.tsx
│   ├── ui/select.tsx
│── /app
│   ├── page.tsx (Main festival poster component)
│── /public
│   ├── images (for additional assets)
│── /styles
│   ├── global.css (Tailwind styles)
│── /utils
│   ├── helpers.ts (utility functions)
│── package.json
│── README.md
│── tsconfig.json (TypeScript configuration)
│── next.config.js (Next.js configuration)
```

---

## 📝 Notes  

### 📌 **Performance Optimizations**  
- Components use `memo()` to prevent unnecessary re-renders.  
- `useMemo()` caches computed values.  
- `useCallback()` ensures functions don’t recreate unnecessarily.  

### 📌 **Known Issues**  
- **Browser Compatibility** – Some gradients might look different in **older browsers**.  
- **Mobile Support** – Fully responsive, but editing works best on a **desktop**.  

---

## 🎸 Future Improvements  
- 🎨 Add **more design templates**.  
- 🎤 Support **multiple font styles**.  
- 🌎 Share directly to **social media**.  

---

## 🤝 Contributing  

Contributions are welcome! Feel free to **fork** the repo, submit **issues**, or create **pull requests**.  

1. **Fork the repo**  
2. **Create a new branch**  
   ```sh
   git checkout -b feature-name
   ```
3. **Make your changes**  
4. **Commit your changes**  
   ```sh
   git commit -m "Add new feature"
   ```
5. **Push the branch**  
   ```sh
   git push origin feature-name
   ```
6. **Submit a pull request** 🚀  

---

## 📄 License  

This project is **MIT Licensed**. Feel free to use, modify, and share!  

---

🔥 **Made with ❤️ for festival lovers!** 🎶
