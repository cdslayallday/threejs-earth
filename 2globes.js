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

const detail = 50;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const moonGroup = new THREE.Group();
moonGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(moonGroup);
moonGroup.position.x = 4; // Start 5 units away on the x-axis

new OrbitControls(camera, renderer.domElement);

const linesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

// Function to create lines of latitude and longitude
function addLatLongLines(group, radius, detail) {
  // Create lines of latitude (Parallel lines)
  for (let lat = -90; lat <= 90; lat += 10) {
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const points = [];
    for (let lon = -180; lon <= 180; lon += 10) {
      const theta = THREE.MathUtils.degToRad(lon);
      points.push(new THREE.Vector3().setFromSphericalCoords(radius, phi, theta));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, linesMaterial);
    group.add(line);
  }

  // Create lines of longitude (Meridian lines)
  for (let lon = -180; lon <= 180; lon += 10) {
    const points = [];
    for (let lat = -90; lat <= 90; lat += 10) {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      points.push(new THREE.Vector3().setFromSphericalCoords(radius, phi, theta));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, linesMaterial);
    group.add(line);
  }
}

// Add latitude and longitude lines to the earth and moon
addLatLongLines(earthGroup, 1, detail); // Earth radius 1
addLatLongLines(moonGroup, 1, detail); // Moon radius 0.5

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  // Adjust the moon's approach speed based on its x position
  // As it gets closer to 1, the speed decreases
  const targetX = 0; // The final x position for the moon
  if (moonGroup.position.x > targetX) {
    // Calculate the distance from the moon to its target position
    let distance = moonGroup.position.x - targetX;
    
    // Use a fraction of the distance as the movement amount,
    // creating a slow down effect as it gets closer
    let moveAmount = Math.max(distance / 200, 0.0005); // Ensure there's a minimum move amount to avoid halting too early
    moonGroup.position.x -= moveAmount;
  }

  // Optional: Adjust rotation to slow down as well if desired
  // This example keeps a constant rotation for simplicity
  moonGroup.rotation.y += 0.002;
  moonGroup.rotation.x += 0.0005;

  // Continue rotating the Earth for a dynamic effect
  earthGroup.rotation.y += 0.002;

  renderer.render(scene, camera);
}


animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);


