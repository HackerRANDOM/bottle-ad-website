# 🍾 Premium Bottle Advertisement Website

An interactive, high-quality 3D bottle advertisement website with smooth animations and immersive user experience.

## ✨ Features

- **Interactive 3D Bottle** - Click the golden cap to open the bottle and reveal content
- **Smooth Animations** - Professional transitions and effects
- **Luxury Design** - Premium visual aesthetics with gradient backgrounds and lighting effects
- **Responsive** - Works seamlessly on desktop and mobile devices
- **Particle Effects** - Beautiful floating particles for atmosphere
- **Modern Web Stack** - Built with Three.js and vanilla JavaScript

## 🎯 How to Use

1. Open `index.html` in your web browser
2. Wait for the loading animation to complete
3. Click on the **golden cap** of the bottle to open it
4. Explore the premium content inside
5. Click "Back to Bottle" to return to the 3D scene

## 🛠️ Technologies Used

- **Three.js** - 3D graphics rendering
- **WebGL** - Hardware-accelerated graphics
- **HTML5 & CSS3** - Structure and styling
- **JavaScript** - Interactive functionality

## 📦 Project Structure

```
bottle-ad-website/
├── index.html       # Main HTML file
├── styles.css       # Styling and animations
├── script.js        # Three.js and interactivity
└── README.md        # Documentation
```

## 🎨 Customization

### Change Bottle Color
In `script.js`, modify the bottle body color:
```javascript
const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b0000,  // Change this hex value
    metalness: 0.6,
    roughness: 0.4,
});
```

### Modify Content
Edit the content section in `index.html` inside the `contentSection` div to add your own text, images, and products.

### Adjust Animation Speed
In `script.js`, find the animation duration:
```javascript
const duration = 1000;  // Change this value in milliseconds
```

## 🚀 Deployment

This project can be easily deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 📱 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers with WebGL support

## 💡 Features to Explore

- Rotating 3D bottle with realistic lighting
- Interactive cap opening animation
- Smooth transitions between scenes
- Luxury particle effects
- Responsive design
- Touch support for mobile devices

## 🔮 Future Enhancements

- Add different bottle variants
- Implement AR viewer
- Add sound effects
- Create product carousel
- Add email subscription form
- Implement analytics tracking

## 📄 License

Free to use and modify for your projects.

---

**Made with ❤️ for premium experiences**