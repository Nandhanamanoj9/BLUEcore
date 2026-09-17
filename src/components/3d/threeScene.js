/**
 * BLU CORE — 3D Architectural CNC Wood Panel Scene
 *
 * Built with Three.js.
 * Renders a tactile, precision-crafted CNC carved wood panel with:
 * - Procedural luxury walnut/teak wood texture
 * - Intricate geometric Jali cutouts with beveled relief geometry
 * - Recessed acoustic backing panel
 * - Brass/gold architectural mounting standoffs
 * - Dynamic sweeping key light & cursor-following warm spotlight
 * - Gentle atmospheric golden particles
 * - Performance-optimized RAF loop with off-screen pause capability
 */

import * as THREE from 'three';

/**
 * Procedurally generates a warm organic wood grain texture on an offscreen canvas.
 */
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base wood background gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#5C341B'); // Deep wood brown
  grad.addColorStop(0.3, '#6E3F20');
  grad.addColorStop(0.7, '#4D2914');
  grad.addColorStop(1, '#3A1E0D');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Draw natural grain fibers
  ctx.lineWidth = 1.2;
  for (let y = 0; y < 512; y += 3) {
    const opacity = 0.08 + Math.sin(y * 0.05) * 0.05;
    ctx.strokeStyle = `rgba(25, 12, 5, ${opacity})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 16) {
      const wobble = Math.sin(x * 0.015 + y * 0.02) * 4 + Math.cos(x * 0.03) * 2;
      ctx.lineTo(x, y + wobble);
    }
    ctx.stroke();
  }

  // Draw subtle warm golden highlights along grain
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 512;
    ctx.strokeStyle = 'rgba(199, 154, 93, 0.06)';
    ctx.lineWidth = 0.8 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 24) {
      ctx.lineTo(x, y + Math.sin(x * 0.01) * 3);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates the intricate CNC carved panel geometry with beveled Jali lattice cutouts.
 */
function createCNCPanelGeometry() {
  const width = 3.6;
  const height = 4.8;
  const cornerRadius = 0.12;

  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  // Outer rounded rectangle
  shape.moveTo(x + cornerRadius, y);
  shape.lineTo(x + width - cornerRadius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + cornerRadius);
  shape.lineTo(x + width, y + height - cornerRadius);
  shape.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height);
  shape.lineTo(x + cornerRadius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - cornerRadius);
  shape.lineTo(x, y + cornerRadius);
  shape.quadraticCurveTo(x, y, x + cornerRadius, y);

  // Helper to add diamond / rosette cutouts
  const addCutout = (cx, cy, size, points = 4) => {
    const hole = new THREE.Path();
    if (points === 4) {
      // Diamond cutout
      hole.moveTo(cx, cy + size);
      hole.lineTo(cx + size * 0.7, cy);
      hole.lineTo(cx, cy - size);
      hole.lineTo(cx - size * 0.7, cy);
      hole.closePath();
    } else {
      // 8-point geometric star cutout
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const r = i % 2 === 0 ? size : size * 0.52;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        if (i === 0) hole.moveTo(px, py);
        else hole.lineTo(px, py);
      }
      hole.closePath();
    }
    shape.holes.push(hole);
  };

  // Center primary architectural rosette
  addCutout(0, 0, 0.75, 8);
  addCutout(0, 0, 0.28, 4);

  // Quadrant geometric star cutouts
  const offsets = [
    [-0.95, 1.3],
    [0.95, 1.3],
    [-0.95, -1.3],
    [0.95, -1.3],
    [0, 1.6],
    [0, -1.6],
    [-1.0, 0],
    [1.0, 0],
  ];

  offsets.forEach(([ox, oy]) => {
    addCutout(ox, oy, 0.46, 8);
    addCutout(ox, oy, 0.18, 4);
  });

  // Corner subtle geometric accent cuts
  const cornerOffsets = [
    [-1.15, 1.85],
    [1.15, 1.85],
    [-1.15, -1.85],
    [1.15, -1.85],
  ];

  cornerOffsets.forEach(([cx, cy]) => {
    addCutout(cx, cy, 0.24, 4);
  });

  // Extrude with precision CNC beveling
  const extrudeSettings = {
    steps: 1,
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

/**
 * Initializes the Three.js 3D CNC Scene.
 */
export function initThreeScene(container, { prefersReducedMotion = false } = {}) {
  let isDisposed = false;
  let isPaused = false;
  let animFrameId = null;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 600;

  // 1. Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.8);

  // 2. Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  container.appendChild(renderer.domElement);

  // 3. Procedural Materials
  const woodTexture = createWoodTexture();
  const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0x8a5833,
    roughness: 0.42,
    metalness: 0.08,
  });

  // Dark espresso acoustic backing board
  const backingMaterial = new THREE.MeshStandardMaterial({
    color: 0x160c08,
    roughness: 0.85,
    metalness: 0.05,
  });

  // Brass/gold architectural standoff material
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xc79a5d,
    roughness: 0.22,
    metalness: 0.88,
  });

  // 4. Panel Meshes
  const panelGroup = new THREE.Group();
  scene.add(panelGroup);

  // A. Front Carved Panel
  const panelGeo = createCNCPanelGeometry();
  const panelMesh = new THREE.Mesh(panelGeo, woodMaterial);
  panelMesh.castShadow = true;
  panelMesh.receiveShadow = true;
  panelGroup.add(panelMesh);

  // B. Acoustic Backing Board
  const backingGeo = new THREE.BoxGeometry(3.7, 4.9, 0.08);
  const backingMesh = new THREE.Mesh(backingGeo, backingMaterial);
  backingMesh.position.set(0, 0, -0.16);
  backingMesh.receiveShadow = true;
  panelGroup.add(backingMesh);

  // C. Brass Mounting Standoffs (4 corners)
  const standoffGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.28, 16);
  const standoffPositions = [
    [-1.6, 2.2, 0.04],
    [1.6, 2.2, 0.04],
    [-1.6, -2.2, 0.04],
    [1.6, -2.2, 0.04],
  ];

  standoffPositions.forEach(([sx, sy, sz]) => {
    const standoff = new THREE.Mesh(standoffGeo, brassMaterial);
    standoff.rotation.x = Math.PI / 2;
    standoff.position.set(sx, sy, sz);
    standoff.castShadow = true;
    panelGroup.add(standoff);
  });

  // 5. Lighting Rig
  // Ambient fill
  const ambientLight = new THREE.AmbientLight(0xfdfaf5, 0.95);
  scene.add(ambientLight);

  // Warm sweeping directional key light
  const keyLight = new THREE.DirectionalLight(0xfaece1, 2.4);
  keyLight.position.set(4, 5, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 15;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Subtle warm gold rim light
  const rimLight = new THREE.DirectionalLight(0xc79a5d, 1.6);
  rimLight.position.set(-5, -4, 3);
  scene.add(rimLight);

  // Interactive mouse-tracking warm spotlight
  const pointerLight = new THREE.PointLight(0xe8be85, 2.2, 12);
  pointerLight.position.set(0, 0, 3.2);
  scene.add(pointerLight);

  // 6. Airborne Micro-Particles (subtle golden wood dust)
  const particleCount = 45;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 8;
    particlePositions[i + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i + 2] = (Math.random() - 0.5) * 4 + 1;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xc79a5d,
    size: 0.045,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // 7. Interactive Damping State
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  const handlePointerMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    // Subtle physical tilt (clamped to max ~11 degrees)
    targetRotY = nx * 0.2;
    targetRotX = -ny * 0.15;

    // Follow pointer with point light
    pointerLight.position.x = nx * 2.8;
    pointerLight.position.y = ny * 2.8;
  };

  window.addEventListener('mousemove', handlePointerMove, { passive: true });

  // 8. Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    if (isDisposed) return;
    if (isPaused) return;

    animFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Smooth interpolation toward cursor target (Decoupled idle wobble for high stability)
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      panelGroup.rotation.x = currentRotX;
      panelGroup.rotation.y = currentRotY;

      // Sweeping directional light highlight across the relief
      keyLight.position.x = 4 + Math.sin(elapsedTime * 0.35) * 1.5;
      keyLight.position.y = 5 + Math.cos(elapsedTime * 0.25) * 1.0;

      // Slow particle drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.003;
        if (positions[i] > 4) positions[i] = -4;
      }
      particleGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  return {
    resize(newWidth, newHeight) {
      if (isDisposed) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    },
    pause() {
      isPaused = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    },
    resume() {
      if (!isPaused || isDisposed) return;
      isPaused = false;
      clock.start();
      animate();
    },
    dispose() {
      isDisposed = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
      window.removeEventListener('mousemove', handlePointerMove);

      // Clean up geometries, textures, materials, and renderer DOM
      panelGeo.dispose();
      backingGeo.dispose();
      standoffGeo.dispose();
      particleGeo.dispose();
      woodTexture.dispose();
      woodMaterial.dispose();
      backingMaterial.dispose();
      brassMaterial.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
