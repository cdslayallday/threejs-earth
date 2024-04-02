import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);

const detail = 50;
const geometry = new THREE.IcosahedronGeometry(1, detail);
// earthGroup.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x2266aa, wireframe: true }))); // Optional: Add a base sphere as a reference

const linesMaterial = new THREE.LineBasicMaterial({ color:  });

// Create lines of latitude (Parallel lines)
for (let lat = -90; lat <= 90; lat += 10) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const points = [];
  for (let lon = -180; lon <= 180; lon += 10) {
    const theta = THREE.MathUtils.degToRad(lon);
    points.push(new THREE.Vector3().setFromSphericalCoords(1, phi, theta));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.LineLoop(geometry, linesMaterial);
  earthGroup.add(line);
}

// Create lines of longitude (Meridian lines)
for (let lon = -180; lon <= 180; lon += 10) {
  const points = [];
  for (let lat = -90; lat <= 90; lat += 10) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);
    points.push(new THREE.Vector3().setFromSphericalCoords(1, phi, theta));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, linesMaterial);
  earthGroup.add(line);
}

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);
  earthGroup.rotation.y += 0.002; // Rotate the entire group for a dynamic effect
  renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);