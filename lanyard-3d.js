// Pastikan script ini dijalankan setelah DOM dimuat
const container = document.getElementById('canvas-container');
const canvas = document.getElementById('idCardCanvas');

// 1. Scene, Camera, & Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Tambahkan Pencahayaan (Lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 3. Buat Objek 3D ID Card (Mesh)
const cardWidth = 1.6;
const cardHeight = 2.4;
const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, 0.02);

// Membuat tekstur atau warna tampilan kartu
const cardMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0f172a, 
    roughness.value: 0.2,
    metalness.value: 0.8
});

const idCardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
scene.add(idCardMesh);

// 4. Efek Interaksi Kursor (Mouse Move Parallax & Tilt)
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 5. Animasi Loop (Render & Physics per frame)
function animate() {
    requestAnimationFrame(animate);

    // Menghitung rotasi halus berdasarkan posisi kursor
    targetRotationX = mouseY * 0.5;
    targetRotationY = mouseX * 0.5;

    // Efek lerp (smooth transition) rotasi kartu
    idCardMesh.rotation.x += (targetRotationX - idCardMesh.rotation.x) * 0.05;
    idCardMesh.rotation.y += (targetRotationY - idCardMesh.rotation.y) * 0.05;

    // Sedikit efek mengapung (floating animation)
    idCardMesh.position.y = Math.sin(Date.now() * 0.002) * 0.1;

    renderer.render(scene, camera);
}
animate();

// 6. Responsif saat ukuran layar berubah
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
