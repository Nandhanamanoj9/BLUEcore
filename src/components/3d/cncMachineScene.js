/**
 * BLU CORE — Cinematic 3D CNC Wood Machining Experience
 *
 * Modeled directly from the user's reference photograph:
 * - Prominent heavy cylindrical stainless-steel CNC spindle with brushed metal sheen
 * - Stepped lower collar, dark industrial collet nut, and spinning carbide milling bit
 * - Real-time active machining into an intricately carved architectural wood panel (acanthus scrollwork & relief frames)
 * - Dynamic centrifugal wood chips and glowing amber sawdust particles flying from the contact point
 * - Settled wood shavings and dust resting in the carved grooves
 * - Background CNC gantry with precision dual linear guide rails and runner blocks
 * - Dramatic warm workshop raking sunlight casting deep relief shadows
 * - Smooth continuous parametric carving cycle and interactive mouse parallax
 */

import * as THREE from 'three';

/**
 * Creates high-resolution procedural textures for the intricately carved wood panel.
 * Directly captures the ornate acanthus scrolls, floral volutes, and architectural frames in the reference photo.
 */
function createCarvedWoodTextures() {
  // 1. Diffuse & Relief Canvas (2048x2048 for crisp ornamental detail)
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Base rich natural warm walnut/teak wood tone
  const baseGrad = ctx.createLinearGradient(0, 0, 2048, 2048);
  baseGrad.addColorStop(0, '#94582A');
  baseGrad.addColorStop(0.28, '#824B22');
  baseGrad.addColorStop(0.62, '#6E3C18');
  baseGrad.addColorStop(1, '#562E12');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 2048, 2048);

  // Natural wood grain flow
  ctx.fillStyle = 'rgba(38, 18, 6, 0.08)';
  for (let i = 0; i < 9500; i++) {
    const gx = Math.random() * 2048;
    const gy = Math.random() * 2048;
    const gw = Math.random() * 7 + 1.2;
    const gh = Math.random() * 1.8 + 0.5;
    ctx.fillRect(gx, gy, gw, gh);
  }

  // Natural wavy growth rings
  ctx.strokeStyle = 'rgba(50, 24, 8, 0.06)';
  ctx.lineWidth = 3.5;
  for (let y = -200; y < 2300; y += 38) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 2048; x += 110) {
      const cy = y + Math.sin((x + y) * 0.0075) * 20;
      ctx.lineTo(x, cy);
    }
    ctx.stroke();
  }

  // Helper to draw beveled ornamental relief borders (matching the photo's framed panel sections)
  function drawFramedSection(x, y, w, h, borderW) {
    // Deepest carved recess shadow
    ctx.strokeStyle = '#1E0B03';
    ctx.lineWidth = 18;
    ctx.strokeRect(x, y, w, h);

    // Secondary bevel shadow
    ctx.strokeStyle = '#2A1205';
    ctx.lineWidth = 10;
    ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);

    // Beveled raised moulding ridge (warm golden wood crest)
    ctx.strokeStyle = '#B6793E';
    ctx.lineWidth = 7;
    ctx.strokeRect(x + 18, y + 18, w - 36, h - 36);

    // Inner relief drop shadow
    ctx.strokeStyle = '#2E1406';
    ctx.lineWidth = 9;
    ctx.strokeRect(x + borderW, y + borderW, w - borderW * 2, h - borderW * 2);

    // Soft carved interior background
    ctx.fillStyle = 'rgba(38, 16, 5, 0.42)';
    ctx.fillRect(x + borderW, y + borderW, w - borderW * 2, h - borderW * 2);
  }

  // Draw architectural framing dividers matching the photo
  drawFramedSection(60, 60, 930, 930, 48);
  drawFramedSection(1058, 60, 930, 930, 48);
  drawFramedSection(60, 1058, 930, 930, 48);
  drawFramedSection(1058, 1058, 930, 930, 48);

  // Helper to draw ornate Baroque acanthus leaves and swirling volutes
  function drawAcanthusScroll(cx, cy, scale, angle, flip = 1) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale * flip, scale);

    // 1. Deep carved shadow under leaf cluster
    ctx.fillStyle = '#160802';
    ctx.beginPath();
    ctx.arc(0, 0, 190, 0, Math.PI * 1.5);
    ctx.bezierCurveTo(-60, 130, 140, 270, 250, 190);
    ctx.bezierCurveTo(350, 90, 290, -80, 130, -150);
    ctx.closePath();
    ctx.fill();

    // 2. Main swirling acanthus leaf body
    const leafGrad = ctx.createRadialGradient(80, 40, 20, 120, 80, 330);
    leafGrad.addColorStop(0, '#A66B35');
    leafGrad.addColorStop(0.35, '#8D5325');
    leafGrad.addColorStop(0.75, '#683915');
    leafGrad.addColorStop(1, '#3B1A06');

    ctx.fillStyle = leafGrad;
    ctx.strokeStyle = '#220D03';
    ctx.lineWidth = 6;

    // Spiral volute horn
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(80, -120, 240, -100, 290, 10);
    ctx.bezierCurveTo(340, 120, 260, 260, 110, 270);
    ctx.bezierCurveTo(-20, 270, -110, 180, -100, 70);
    ctx.bezierCurveTo(-90, -20, -10, -50, 40, -40);
    ctx.bezierCurveTo(90, -30, 100, 40, 60, 70);
    ctx.bezierCurveTo(30, 90, -10, 70, 0, 30);
    ctx.fill();
    ctx.stroke();

    // 3. Carved serrated leaf lobes radiating outward (like the acanthus in the photo)
    const lobes = [
      { angle: -0.65, len: 165, w: 46 },
      { angle: -0.22, len: 195, w: 52 },
      { angle: 0.24, len: 215, w: 56 },
      { angle: 0.68, len: 185, w: 50 },
      { angle: 1.12, len: 155, w: 44 },
      { angle: 1.52, len: 135, w: 38 },
    ];

    lobes.forEach(({ angle: la, len, w }) => {
      ctx.save();
      ctx.rotate(la);
      ctx.beginPath();
      ctx.moveTo(70, 0);
      ctx.quadraticCurveTo(len * 0.6, -w, len, 0);
      ctx.quadraticCurveTo(len * 0.6, w, 70, 0);
      ctx.fillStyle = leafGrad;
      ctx.fill();
      ctx.strokeStyle = '#220C03';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Carved central leaf rib & crisp highlight ridge
      ctx.beginPath();
      ctx.moveTo(70, 0);
      ctx.lineTo(len - 10, 0);
      ctx.strokeStyle = '#C9894F';
      ctx.lineWidth = 4.5;
      ctx.stroke();

      // Shadow in valley between lobes
      ctx.beginPath();
      ctx.moveTo(70, -w * 0.85);
      ctx.quadraticCurveTo(len * 0.5, -w * 0.95, len * 0.8, -w * 0.3);
      ctx.strokeStyle = '#180802';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.restore();
    });

    // 4. Central rosette/volute spiral bead
    ctx.beginPath();
    ctx.arc(45, 20, 34, 0, Math.PI * 2);
    ctx.fillStyle = '#AD7138';
    ctx.fill();
    ctx.strokeStyle = '#271004';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(42, 17, 19, 0, Math.PI * 2);
    ctx.fillStyle = '#C7874A';
    ctx.fill();

    ctx.restore();
  }

  // Draw rich floral carvings in each panel quadrant
  // Panel 1 (Top Left)
  drawAcanthusScroll(525, 525, 1.25, 0.2, 1);
  drawAcanthusScroll(525, 525, 1.05, Math.PI + 0.2, 1);
  drawAcanthusScroll(320, 720, 0.75, -0.6, -1);
  drawAcanthusScroll(730, 320, 0.75, 2.2, -1);

  // Panel 2 (Top Right — active machining area directly under the spindle!)
  drawAcanthusScroll(1523, 525, 1.3, -0.3, 1);
  drawAcanthusScroll(1523, 525, 1.1, Math.PI - 0.3, 1);
  drawAcanthusScroll(1320, 720, 0.8, 0.5, -1);
  drawAcanthusScroll(1725, 330, 0.8, 2.7, -1);

  // Active Toolpath Carving Groove (Freshly milled wood with bright raw cut core)
  ctx.save();
  ctx.strokeStyle = '#1A0A03'; // Deep shadow groove
  ctx.lineWidth = 28;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(1320, 520);
  ctx.bezierCurveTo(1400, 380, 1600, 380, 1680, 500);
  ctx.bezierCurveTo(1740, 600, 1640, 720, 1500, 680);
  ctx.bezierCurveTo(1380, 650, 1380, 520, 1520, 500);
  ctx.stroke();

  // Fresh raw cut lighter wood inner groove (revealed core)
  ctx.strokeStyle = '#DEAA72';
  ctx.lineWidth = 15;
  ctx.stroke();

  // Fine cutter toolmarks inside groove
  ctx.strokeStyle = 'rgba(255, 230, 195, 0.7)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Panel 3 (Bottom Left)
  drawAcanthusScroll(525, 1523, 1.25, -0.4, 1);
  drawAcanthusScroll(525, 1523, 1.05, Math.PI - 0.4, 1);
  drawAcanthusScroll(720, 1725, 0.75, 0.8, -1);

  // Panel 4 (Bottom Right)
  drawAcanthusScroll(1523, 1523, 1.25, 0.5, 1);
  drawAcanthusScroll(1523, 1523, 1.05, Math.PI + 0.5, 1);
  drawAcanthusScroll(1320, 1320, 0.8, -0.7, -1);

  // 2. Create Bump / Normal map from luminance for realistic raking-light relief
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 1024;
  bumpCanvas.height = 1024;
  const bctx = bumpCanvas.getContext('2d');
  bctx.drawImage(canvas, 0, 0, 1024, 1024);

  // Convert to high-contrast grayscale bump
  const imgData = bctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = luma;
    data[i + 1] = luma;
    data[i + 2] = luma;
  }
  bctx.putImageData(imgData, 0, 0);

  const diffuseTex = new THREE.CanvasTexture(canvas);
  diffuseTex.generateMipmaps = true;
  diffuseTex.colorSpace = THREE.SRGBColorSpace;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.generateMipmaps = true;

  return { diffuseTex, bumpTex };
}

/**
 * Procedurally builds the close-up CNC Spindle Head, Tool Holder, and Gantry Crossbeam.
 * Closely matches the industrial stainless steel spindle in the reference photograph.
 */
function buildCNCSpindleAssembly() {
  const assemblyGroup = new THREE.Group();

  // -------------------------------------------------------------
  // MATERIALS
  // -------------------------------------------------------------
  // Heavy Polished Stainless Steel (Main spindle body with brilliant specular gleam)
  const stainlessSteelMat = new THREE.MeshStandardMaterial({
    color: 0xE8EDF2,
    roughness: 0.14,
    metalness: 0.96,
  });

  // Brushed Lower Machined Collar
  const brushedCollarMat = new THREE.MeshStandardMaterial({
    color: 0xD4DAE0,
    roughness: 0.24,
    metalness: 0.90,
  });

  // Dark Anodized Steel / Hardened Collet Nut (Black/Charcoal)
  const colletNutMat = new THREE.MeshStandardMaterial({
    color: 0x1B1E22,
    roughness: 0.36,
    metalness: 0.85,
  });

  // Precision Tungsten Carbide Cutting Bit (Spiral Flutes)
  const cuttingBitMat = new THREE.MeshStandardMaterial({
    color: 0xF4F7FB,
    roughness: 0.1,
    metalness: 0.98,
  });

  // Background Gantry Aluminum Beam
  const gantryBeamMat = new THREE.MeshStandardMaterial({
    color: 0x828C98,
    roughness: 0.4,
    metalness: 0.74,
  });

  // Chrome Linear Guide Rails
  const chromeRailMat = new THREE.MeshStandardMaterial({
    color: 0xEEF2F6,
    roughness: 0.08,
    metalness: 0.98,
  });

  // Industrial Bolt Hardware & Linear Runner Blocks
  const darkHardwareMat = new THREE.MeshStandardMaterial({
    color: 0x16181B,
    roughness: 0.48,
    metalness: 0.68,
  });

  // -------------------------------------------------------------
  // 1. BACKGROUND GANTRY & LINEAR RAILS (Crossbeam behind spindle)
  // -------------------------------------------------------------
  const gantryGroup = new THREE.Group();
  assemblyGroup.add(gantryGroup);
  gantryGroup.position.set(0, 1.9, -1.1);

  // Heavy extruded aluminum crossbeam
  const beamGeo = new THREE.BoxGeometry(8.0, 1.4, 0.45);
  const beamMesh = new THREE.Mesh(beamGeo, gantryBeamMat);
  beamMesh.castShadow = true;
  gantryGroup.add(beamMesh);

  // Precision dual horizontal chrome linear guide rails
  const railGeo = new THREE.CylinderGeometry(0.045, 0.045, 7.8, 16);
  const topRail = new THREE.Mesh(railGeo, chromeRailMat);
  topRail.rotation.z = Math.PI / 2;
  topRail.position.set(0, 0.38, 0.24);
  gantryGroup.add(topRail);

  const bottomRail = new THREE.Mesh(railGeo, chromeRailMat);
  bottomRail.rotation.z = Math.PI / 2;
  bottomRail.position.set(0, -0.38, 0.24);
  gantryGroup.add(bottomRail);

  // Industrial socket screws along the rails
  const screwGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 10);
  for (let x = -3.4; x <= 3.4; x += 0.85) {
    const sTop = new THREE.Mesh(screwGeo, darkHardwareMat);
    sTop.rotation.x = Math.PI / 2;
    sTop.position.set(x, 0.52, 0.23);
    gantryGroup.add(sTop);

    const sBot = new THREE.Mesh(screwGeo, darkHardwareMat);
    sBot.rotation.x = Math.PI / 2;
    sBot.position.set(x, -0.52, 0.23);
    gantryGroup.add(sBot);
  }

  // -------------------------------------------------------------
  // 2. MOVING SPINDLE CARRIAGE & VERTICAL Z-AXIS
  // -------------------------------------------------------------
  const carriageGroup = new THREE.Group();
  assemblyGroup.add(carriageGroup);
  carriageGroup.position.set(0, 1.9, -0.85);

  // Carriage backplate & linear runner blocks
  const backplateGeo = new THREE.BoxGeometry(1.65, 1.6, 0.16);
  const backplate = new THREE.Mesh(backplateGeo, gantryBeamMat);
  backplate.castShadow = true;
  carriageGroup.add(backplate);

  // 4 Linear Runner Blocks (Black anodized with chrome seals)
  const blockGeo = new THREE.BoxGeometry(0.24, 0.34, 0.14);
  const runnerPositions = [
    [-0.55, 0.38, -0.06],
    [0.55, 0.38, -0.06],
    [-0.55, -0.38, -0.06],
    [0.55, -0.38, -0.06],
  ];
  runnerPositions.forEach(([bx, by, bz]) => {
    const block = new THREE.Mesh(blockGeo, darkHardwareMat);
    block.position.set(bx, by, bz);
    carriageGroup.add(block);
  });

  // Vertical Z-axis linear rails on carriage face
  const zRailGeo = new THREE.BoxGeometry(0.06, 1.5, 0.05);
  const zRailL = new THREE.Mesh(zRailGeo, chromeRailMat);
  zRailL.position.set(-0.5, 0, 0.11);
  carriageGroup.add(zRailL);

  const zRailR = new THREE.Mesh(zRailGeo, chromeRailMat);
  zRailR.position.set(0.5, 0, 0.11);
  carriageGroup.add(zRailR);

  // Heavy Spindle Clamp Bracket (Cast aluminum clamp wrapping around spindle)
  const clampGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.45, 32, 1, false, 0, Math.PI * 1.35);
  const clamp = new THREE.Mesh(clampGeo, darkHardwareMat);
  clamp.rotation.y = -Math.PI * 0.67;
  clamp.position.set(0, 0.1, 0.52);
  clamp.castShadow = true;
  carriageGroup.add(clamp);

  // Clamp tightening hex bolts
  const boltGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.15, 12);
  const bolt1 = new THREE.Mesh(boltGeo, chromeRailMat);
  bolt1.rotation.z = Math.PI / 2;
  bolt1.position.set(0.74, 0.18, 0.72);
  carriageGroup.add(bolt1);

  const bolt2 = new THREE.Mesh(boltGeo, chromeRailMat);
  bolt2.rotation.z = Math.PI / 2;
  bolt2.position.set(0.74, 0.02, 0.72);
  carriageGroup.add(bolt2);

  // -------------------------------------------------------------
  // 3. VERTICAL Z-PLUNGE SPINDLE HEAD
  // -------------------------------------------------------------
  const spindleHeadGroup = new THREE.Group();
  carriageGroup.add(spindleHeadGroup);
  spindleHeadGroup.position.set(0, 0, 0.72);

  // Spindle Top Motor Enclosure Cap
  const topCapGeo = new THREE.CylinderGeometry(0.68, 0.72, 0.35, 48);
  const topCap = new THREE.Mesh(topCapGeo, darkHardwareMat);
  topCap.position.set(0, 0.95, 0);
  topCap.castShadow = true;
  spindleHeadGroup.add(topCap);

  // Main Cylindrical Stainless Steel Spindle Body
  // Prominently featured in the reference photograph
  const spindleBodyGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.15, 64);
  const spindleBody = new THREE.Mesh(spindleBodyGeo, stainlessSteelMat);
  spindleBody.position.set(0, 0.22, 0);
  spindleBody.castShadow = true;
  spindleHeadGroup.add(spindleBody);

  // Brushed Stepped Lower Collar
  const collarGeo = new THREE.CylinderGeometry(0.64, 0.66, 0.28, 64);
  const collar = new THREE.Mesh(collarGeo, brushedCollarMat);
  collar.position.set(0, -0.48, 0);
  collar.castShadow = true;
  spindleHeadGroup.add(collar);

  // Tapered Nose Cone Transition
  const noseGeo = new THREE.CylinderGeometry(0.48, 0.62, 0.22, 48);
  const nose = new THREE.Mesh(noseGeo, stainlessSteelMat);
  nose.position.set(0, -0.71, 0);
  nose.castShadow = true;
  spindleHeadGroup.add(nose);

  // Dark Anodized Hexagonal ER Collet Chuck Nut
  const colletNutGeo = new THREE.CylinderGeometry(0.32, 0.34, 0.32, 8); // 8-sided industrial collet
  const colletNut = new THREE.Mesh(colletNutGeo, colletNutMat);
  colletNut.position.set(0, -0.96, 0);
  colletNut.castShadow = true;
  spindleHeadGroup.add(colletNut);

  // -------------------------------------------------------------
  // 4. ROTATING CARBIDE CUTTING BIT (High-Speed Spindle Rotor)
  // -------------------------------------------------------------
  const bitRotorGroup = new THREE.Group();
  spindleHeadGroup.add(bitRotorGroup);
  bitRotorGroup.position.set(0, -1.12, 0);

  // Polished Tool Shank (Inserted in collet)
  const shankGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.26, 24);
  const shank = new THREE.Mesh(shankGeo, cuttingBitMat);
  shank.position.set(0, -0.06, 0);
  bitRotorGroup.add(shank);

  // Spiral Carbide Router Milling Bit (With tapered flutes)
  const bitBodyGeo = new THREE.CylinderGeometry(0.058, 0.024, 0.42, 24);
  const bitBody = new THREE.Mesh(bitBodyGeo, cuttingBitMat);
  bitBody.position.set(0, -0.38, 0);
  bitBody.castShadow = true;
  bitRotorGroup.add(bitBody);

  // Helical cutting flutes (Visual spiral bands on bit)
  const fluteGeo = new THREE.TorusGeometry(0.062, 0.012, 8, 24);
  for (let f = 0; f < 3; f++) {
    const fluteRing = new THREE.Mesh(fluteGeo, darkHardwareMat);
    fluteRing.rotation.x = Math.PI / 2.8;
    fluteRing.position.set(0, -0.26 - f * 0.09, 0);
    bitRotorGroup.add(fluteRing);
  }

  return {
    assemblyGroup,
    gantryGroup,
    carriageGroup,
    spindleHeadGroup,
    bitRotorGroup,
    materialsList: [
      stainlessSteelMat,
      brushedCollarMat,
      colletNutMat,
      cuttingBitMat,
      gantryBeamMat,
      chromeRailMat,
      darkHardwareMat,
    ],
  };
}

/**
 * Builds the 3D Carved Wood Panel with architectural stiles, rails, and relief depth.
 */
function buildCarvedWoodWorkpiece(diffuseTex, bumpTex) {
  const woodGroup = new THREE.Group();

  // Natural warm wood material with relief bump and subtle satin sheen
  const woodMat = new THREE.MeshStandardMaterial({
    map: diffuseTex,
    bumpMap: bumpTex,
    bumpScale: 0.048,
    roughness: 0.54,
    metalness: 0.09,
  });

  // Base carved wood block (4.4m width x 3.8m length x 0.35m thickness)
  const baseGeo = new THREE.BoxGeometry(4.4, 0.32, 3.8, 64, 1, 64);
  const baseMesh = new THREE.Mesh(baseGeo, woodMat);
  baseMesh.position.set(0, -0.16, 0);
  baseMesh.receiveShadow = true;
  woodGroup.add(baseMesh);

  // 3D Raised Architectural Frame Mouldings (Stiles & Rails dividing the panels)
  // Directly matches the grid of raised wooden borders visible in the reference photo
  const frameBorderMat = new THREE.MeshStandardMaterial({
    color: 0x854E25,
    roughness: 0.46,
    metalness: 0.12,
  });

  const dividerGeoH = new THREE.BoxGeometry(4.36, 0.06, 0.16);
  const divCenterH = new THREE.Mesh(dividerGeoH, frameBorderMat);
  divCenterH.position.set(0, 0.03, 0);
  divCenterH.castShadow = true;
  divCenterH.receiveShadow = true;
  woodGroup.add(divCenterH);

  const dividerGeoV = new THREE.BoxGeometry(0.16, 0.06, 3.76);
  const divCenterV = new THREE.Mesh(dividerGeoV, frameBorderMat);
  divCenterV.position.set(0, 0.03, 0);
  divCenterV.castShadow = true;
  divCenterV.receiveShadow = true;
  woodGroup.add(divCenterV);

  // Outer perimeter raised border mouldings
  const borderTop = new THREE.Mesh(dividerGeoH, frameBorderMat);
  borderTop.position.set(0, 0.03, -1.82);
  woodGroup.add(borderTop);

  const borderBottom = new THREE.Mesh(dividerGeoH, frameBorderMat);
  borderBottom.position.set(0, 0.03, 1.82);
  woodGroup.add(borderBottom);

  const borderLeft = new THREE.Mesh(dividerGeoV, frameBorderMat);
  borderLeft.position.set(-2.12, 0.03, 0);
  woodGroup.add(borderLeft);

  const borderRight = new THREE.Mesh(dividerGeoV, frameBorderMat);
  borderRight.position.set(2.12, 0.03, 0);
  woodGroup.add(borderRight);

  // -------------------------------------------------------------
  // SETTLED WOOD CHIPS & SHAVINGS IN CARVED GROOVES
  // Exactly matching the clusters of wood chips resting on the wood in the photo
  // -------------------------------------------------------------
  const settledCount = 180;
  const chipGeo = new THREE.BoxGeometry(0.024, 0.008, 0.018);
  const chipMat = new THREE.MeshStandardMaterial({
    color: 0xD2A46C,
    roughness: 0.72,
    metalness: 0.05,
  });

  const chipInstanced = new THREE.InstancedMesh(chipGeo, chipMat, settledCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < settledCount; i++) {
    // Clustered predominantly along the active cutting groove in quadrant 2
    const u = Math.random();
    let cx, cz;
    if (u < 0.65) {
      // Near active toolpath (X: 0.2 to 1.4, Z: -0.8 to 0.6)
      cx = 0.35 + (Math.random() - 0.5) * 1.1;
      cz = -0.15 + (Math.random() - 0.5) * 0.9;
    } else {
      // Scattered in surrounding relief corners
      cx = (Math.random() - 0.5) * 3.4;
      cz = (Math.random() - 0.5) * 3.0;
    }

    dummy.position.set(cx, 0.015 + Math.random() * 0.01, cz);
    dummy.rotation.set(
      Math.random() * 0.3,
      Math.random() * Math.PI * 2,
      Math.random() * 0.3
    );
    const scale = 0.6 + Math.random() * 0.9;
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();
    chipInstanced.setMatrixAt(i, dummy.matrix);
  }
  chipInstanced.receiveShadow = true;
  woodGroup.add(chipInstanced);

  return {
    woodGroup,
    woodMat,
    frameBorderMat,
    chipMat,
    chipInstanced,
  };
}

/**
 * Dynamic Wood Chips and Sawdust Particle System.
 * Simulates centrifugal expulsion of glowing golden wood chips from the rotating tool bit tip.
 */
function createSawdustParticleSystem() {
  const particleCount = 80;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  const lifeData = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    // Realistic tangential ejection angle and upward arc
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.03 + Math.random() * 0.06;
    velocities.push({
      vx: Math.cos(angle) * speed,
      vy: 0.025 + Math.random() * 0.05, // upward burst
      vz: Math.sin(angle) * speed,
      life: Math.random(), // staggered initial ages
      maxLife: 0.7 + Math.random() * 0.6,
    });
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Glowing warm golden wood dust particles
  const mat = new THREE.PointsMaterial({
    color: 0xF5C27A,
    size: 0.048,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particlesMesh = new THREE.Points(geo, mat);

  return {
    particlesMesh,
    geo,
    mat,
    velocities,
    particleCount,
    update(originX, originY, originZ) {
      const posArray = geo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const p = velocities[i];
        p.life += 0.024;

        if (p.life > p.maxLife) {
          // Re-spawn at cutting contact point
          p.life = 0;
          posArray[i * 3] = originX + (Math.random() - 0.5) * 0.04;
          posArray[i * 3 + 1] = originY;
          posArray[i * 3 + 2] = originZ + (Math.random() - 0.5) * 0.04;

          const angle = Math.random() * Math.PI * 2;
          const speed = 0.025 + Math.random() * 0.06;
          p.vx = Math.cos(angle) * speed;
          p.vy = 0.02 + Math.random() * 0.05;
          p.vz = Math.sin(angle) * speed;
        } else {
          // Physics step: velocity + gravity
          posArray[i * 3] += p.vx;
          posArray[i * 3 + 1] += p.vy;
          posArray[i * 3 + 2] += p.vz;
          p.vy -= 0.0028; // gravity pulling chips down
        }
      }
      geo.attributes.position.needsUpdate = true;
    },
  };
}

/**
 * Initializes the Three.js 3D CNC Machining Scene.
 */
export function initCNCMachineScene(container, { prefersReducedMotion = false } = {}) {
  let isDisposed = false;
  let isPaused = false;
  let animFrameId = null;

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 520;
  const isMobile = width < 600;

  // 1. Scene & Cinematic Perspective Camera
  // Camera framed in close-up raking angle matching the reference photograph
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 36, width / height, 0.1, 80);
  const baseCamX = isMobile ? 2.4 : 1.9;
  const baseCamY = isMobile ? 2.15 : 1.85;
  const baseCamZ = isMobile ? 3.35 : 2.75;
  camera.position.set(baseCamX, baseCamY, baseCamZ);
  camera.lookAt(0.35, 0.45, -0.15);

  // 2. High-Performance WebGL Renderer
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
  renderer.toneMappingExposure = 1.3;

  container.appendChild(renderer.domElement);

  // 3. Build Models & Textures
  const { diffuseTex, bumpTex } = createCarvedWoodTextures();
  const { woodGroup, woodMat, frameBorderMat, chipMat, chipInstanced } = buildCarvedWoodWorkpiece(diffuseTex, bumpTex);
  scene.add(woodGroup);
  woodGroup.position.set(0, -0.2, 0);

  const spindleAssembly = buildCNCSpindleAssembly();
  scene.add(spindleAssembly.assemblyGroup);

  const sawdustParticles = createSawdustParticleSystem();
  scene.add(sawdustParticles.particlesMesh);

  // 4. Dramatic Workshop Lighting Rig (Direct match to warm raking sunlight in reference image)
  // Ambient illumination
  const ambientLight = new THREE.AmbientLight(0xFFE8D0, 0.98);
  scene.add(ambientLight);

  // Hemisphere Light (Sky warm gold / Ground deep warm walnut)
  const hemiLight = new THREE.HemisphereLight(0xFFF0DA, 0x422612, 0.78);
  scene.add(hemiLight);

  // Primary Key Light (Warm Workshop Sunlight from upper-left raking across carved relief)
  const sunLight = new THREE.DirectionalLight(0xFFE2B0, 3.5);
  sunLight.position.set(-4.5, 6.2, 3.8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 18;
  sunLight.shadow.bias = -0.0006;
  sunLight.shadow.camera.left = -3;
  sunLight.shadow.camera.right = 3;
  sunLight.shadow.camera.top = 3;
  sunLight.shadow.camera.bottom = -3;
  scene.add(sunLight);

  // Cool Metallic Highlight Fill (Touches stainless spindle cylinder & chrome rails)
  const fillLight = new THREE.DirectionalLight(0xA8C8E8, 1.45);
  fillLight.position.set(5.2, 4.5, -2.5);
  scene.add(fillLight);

  // Warm Amber Rim Light on particles and wood edges
  const rimLight = new THREE.DirectionalLight(0xD68E42, 1.85);
  rimLight.position.set(2.8, 2.2, 4.2);
  scene.add(rimLight);

  // Cutting Contact Point Glow (Frictional warmth & raw wood reflection)
  const cutPointLight = new THREE.PointLight(0xFFAA44, 1.9, 1.4);
  cutPointLight.position.set(0.65, 0.08, -0.1);
  scene.add(cutPointLight);

  // Interactive Cursor-Tracking Spotlight
  const pointerLight = new THREE.PointLight(0xFDF0D8, 1.6, 10);
  pointerLight.position.set(0, 3.2, 2.8);
  scene.add(pointerLight);

  // 5. Interactive Mouse Parallax Controls
  let targetRotY = 0;
  let targetRotX = 0;
  let currentRotY = 0;
  let currentRotX = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let manualRotY = 0;
  let manualRotX = 0;

  const handlePointerMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      manualRotY += deltaX * 0.0035;
      manualRotX += deltaY * 0.0025;
      manualRotY = Math.max(-0.35, Math.min(0.35, manualRotY));
      manualRotX = Math.max(-0.18, Math.min(0.18, manualRotX));
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    } else {
      targetRotY = nx * 0.09;
      targetRotX = -ny * 0.06;
    }

    pointerLight.position.x = nx * 2.8;
    pointerLight.position.y = 2.8 + ny * 1.2;
  };

  const handlePointerDown = (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  };

  const handlePointerUp = () => {
    isDragging = false;
  };

  window.addEventListener('mousemove', handlePointerMove, { passive: true });
  window.addEventListener('mouseup', handlePointerUp);
  container.addEventListener('mousedown', handlePointerDown);

  // 6. Parametric Continuous CNC Machining Toolpath Loop
  // Traces an intricate acanthus rosette contour with realistic Z plunges
  function getToolpathPosition(t) {
    // Parametric rose/lemniscate curve over the active wood quadrant
    const cycle = t * 0.55;
    const r = 0.52 + 0.18 * Math.cos(3 * cycle);
    const x = 0.65 + r * Math.cos(cycle);
    const z = -0.15 + r * Math.sin(cycle) * 0.78;

    // Realistic vertical Z-axis carving depth:
    // Plunges into valleys (-0.035 to -0.015), retracts slightly when transitioning
    const depthMod = Math.sin(cycle * 6) * 0.025;
    const zHeight = 0.01 + depthMod;

    return { x, z, y: zHeight };
  }

  // 7. Animation Loop
  let startTime = performance.now();
  let pausedAt = 0;
  let totalPausedDuration = 0;

  function getElapsedTime() {
    if (isPaused) {
      return (pausedAt - startTime - totalPausedDuration) * 0.001;
    }
    return (performance.now() - startTime - totalPausedDuration) * 0.001;
  }

  function animate() {
    if (isDisposed) return;
    if (isPaused) return;

    animFrameId = requestAnimationFrame(animate);
    const elapsedTime = getElapsedTime();

    if (!prefersReducedMotion) {
      // 1. Toolpath position calculation
      const { x: toolX, z: toolZ, y: toolY } = getToolpathPosition(elapsedTime);

      // 2. Machine movements: Gantry & Spindle Carriage travel
      spindleAssembly.carriageGroup.position.x = toolX;
      spindleAssembly.carriageGroup.position.z = -0.85 + (toolZ + 0.15) * 0.35;

      // Vertical Z plunge of the spindle head
      spindleAssembly.spindleHeadGroup.position.y = toolY;

      // Continuous high-speed bit rotation (realistic high RPM)
      spindleAssembly.bitRotorGroup.rotation.y = elapsedTime * 65;

      // 3. Contact point coordinates for particles and contact glow
      // Tool bit tip world position:
      const bitTipX = toolX;
      const bitTipY = -0.2 + toolY + 0.22; // close to wood surface (-0.2 base offset)
      const bitTipZ = toolZ;

      // Update particle emission point & light
      sawdustParticles.update(bitTipX, bitTipY, bitTipZ);
      cutPointLight.position.set(bitTipX, bitTipY + 0.04, bitTipZ);

      // 4. Subtle camera breathing and interactive parallax
      currentRotY += (targetRotY + manualRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX + manualRotX - currentRotX) * 0.05;

      // Responsive camera framing: adjusts smoothly between desktop & mobile
      const currentWidth = container.clientWidth || width;
      const isNarrow = currentWidth < 600;
      const camDistMod = isNarrow ? 1.25 : 1.0;

      const baseCX = (1.9 + Math.sin(elapsedTime * 0.18) * 0.08) * camDistMod;
      const baseCY = (1.85 + Math.cos(elapsedTime * 0.22) * 0.04) * (isNarrow ? 1.15 : 1.0);
      const baseCZ = (2.75 + Math.sin(elapsedTime * 0.14) * 0.06) * camDistMod;

      camera.position.x = baseCX + currentRotY * 1.2;
      camera.position.y = baseCY + currentRotX * 0.8;
      camera.position.z = baseCZ;
      camera.lookAt(0.35 + currentRotY * 0.2, 0.45, -0.15);

      // Subtle dynamic sunlight sweep
      sunLight.position.x = -4.5 + Math.sin(elapsedTime * 0.25) * 0.6;
    } else {
      // Reduced motion: static beauty framing
      spindleAssembly.carriageGroup.position.x = 0.65;
      spindleAssembly.spindleHeadGroup.position.y = 0;
      spindleAssembly.bitRotorGroup.rotation.y = 0;
      camera.position.set(1.9, 1.85, 2.75);
      camera.lookAt(0.35, 0.45, -0.15);
    }

    renderer.render(scene, camera);
  }

  animate();

  return {
    resize(newWidth, newHeight) {
      if (isDisposed) return;
      const isNarrow = newWidth < 600;
      camera.fov = isNarrow ? 42 : 36;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    },
    pause() {
      if (isPaused) return;
      isPaused = true;
      pausedAt = performance.now();
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    },
    resume() {
      if (!isPaused || isDisposed) return;
      isPaused = false;
      if (pausedAt > 0) {
        totalPausedDuration += performance.now() - pausedAt;
        pausedAt = 0;
      }
      animate();
    },
    dispose() {
      isDisposed = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('mousedown', handlePointerDown);

      // Dispose textures
      diffuseTex.dispose();
      bumpTex.dispose();

      // Dispose materials
      woodMat.dispose();
      frameBorderMat.dispose();
      chipMat.dispose();
      spindleAssembly.materialsList.forEach((m) => {
        if (m.dispose) m.dispose();
      });
      sawdustParticles.mat.dispose();
      sawdustParticles.geo.dispose();

      // Traverse and dispose geometries
      scene.traverse((obj) => {
        if (obj.geometry && obj.geometry.dispose) {
          obj.geometry.dispose();
        }
      });

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
