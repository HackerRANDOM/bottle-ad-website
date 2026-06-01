// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bottleCanvas'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a1a, 0);
camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffd700, 0.8);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// Bottle Group
const bottleGroup = new THREE.Group();
scene.add(bottleGroup);

// Create Bottle
function createBottle() {
    // Bottle body
    const bodyGeometry = new THREE.CapsuleGeometry(0.6, 2, 8, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0x5a0000
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -0.3;
    bottleGroup.add(body);

    // Bottle neck
    const neckGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 32);
    const neckMaterial = new THREE.MeshStandardMaterial({
        color: 0xa00000,
        metalness: 0.7,
        roughness: 0.3
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 1.4;
    bottleGroup.add(neck);

    // Bottle cap
    const capGeometry = new THREE.CylinderGeometry(0.4, 0.35, 0.3, 32);
    const capMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xffaa00
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 2.0;
    cap.name = 'cap';
    cap.userData.isClickable = true;
    bottleGroup.add(cap);

    // Cap shine effect
    const capShineGeometry = new THREE.CylinderGeometry(0.38, 0.33, 0.28, 32);
    const capShineMaterial = new THREE.MeshStandardMaterial({
        color: 0xffed4e,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xffff00
    });
    const capShine = new THREE.Mesh(capShineGeometry, capShineMaterial);
    capShine.position.y = 2.02;
    capShine.position.z = 0.01;
    bottleGroup.add(capShine);

    // Glass bottle interior glow
    const glassGeometry = new THREE.CapsuleGeometry(0.55, 1.95, 8, 32);
    const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        metalness: 0.4,
        roughness: 0.5,
        transparent: true,
        opacity: 0.1,
        emissive: 0x660000
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.y = -0.3;
    bottleGroup.add(glass);
}

createBottle();

// Particles for luxury effect
function createParticles() {
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    return particles;
}

const particles = createParticles();

// Mouse raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// State management
let isBottleOpen = false;
let isAnimating = false;
let capRotation = 0;

// Click detection
window.addEventListener('click', onMouseClick);

function onMouseClick(event) {
    if (isAnimating || isBottleOpen) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bottleGroup.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'cap' || (intersects[i].object.parent && intersects[i].object.parent.name === 'cap')) {
            openBottle();
            break;
        }
    }
}

// Open bottle animation
function openBottle() {
    isAnimating = true;
    const cap = bottleGroup.children.find(child => child.name === 'cap');
    const startRotation = cap.rotation.z;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Rotate cap
        cap.rotation.z = startRotation + progress * Math.PI * 2;
        cap.position.y = 2.0 + progress * 0.5;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isBottleOpen = true;
            isAnimating = false;
            showContent();
        }
    };

    animate();
}

// Show content
function showContent() {
    document.getElementById('mainScene').classList.add('hidden');
    document.getElementById('contentSection').classList.add('show');
}

// Close button
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('contentSection').classList.remove('show');
    document.getElementById('mainScene').classList.remove('hidden');
    isBottleOpen = false;
    resetBottle();
});

// Reset bottle
function resetBottle() {
    const cap = bottleGroup.children.find(child => child.name === 'cap');
    cap.rotation.z = 0;
    cap.position.y = 2.0;
}

// Hide loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('mainScene').classList.remove('hidden');
    }, 1500);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate bottle
    if (!isBottleOpen) {
        bottleGroup.rotation.y += 0.005;
        bottleGroup.rotation.z += 0.001;
    }

    // Rotate particles
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;

    // Bob animation
    bottleGroup.position.y = Math.sin(Date.now() * 0.001) * 0.3;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Touch support for mobile
window.addEventListener('touchstart', (event) => {
    if (isAnimating || isBottleOpen) return;

    const touch = event.touches[0];
    const clickEvent = new MouseEvent('click', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    window.dispatchEvent(clickEvent);
});