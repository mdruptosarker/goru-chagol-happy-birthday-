import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SceneId } from '../types';
import { createFriendshipFigures } from './friendshipFigures';
import { Cosmic2DFallback } from './Cosmic2DFallback';

interface ThreeCanvasProps {
  currentScene: SceneId;
  candlesBlownOut: boolean;
  wishTriggeredCount: number;
}

// Module-scope reusable math vectors to ensure zero GC during frame ticks
const _vec3Target = new THREE.Vector3();
const _camPosTarget = new THREE.Vector3();

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentScene,
  candlesBlownOut,
  wishTriggeredCount,
}) => {
  const [webGlSupported, setWebGlSupported] = useState<boolean>(() => {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl') || probe.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  });

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneStateRef = useRef({
    currentScene,
    candlesBlownOut,
    wishTriggeredCount,
  });

  // Keep ref up to date
  useEffect(() => {
    sceneStateRef.current = {
      currentScene,
      candlesBlownOut,
      wishTriggeredCount,
    };
  }, [currentScene, candlesBlownOut, wishTriggeredCount]);

  useEffect(() => {
    if (!webGlSupported) return;

    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene & Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#10091F');
    scene.fog = new THREE.FogExp2('#10091F', 0.038);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL initialization failed, switching to 2D Cosmic Canvas Fallback:', err);
      setWebGlSupported(false);
      return;
    }

    // 2. Room Environment PMREM for authentic studio reflections on glass & gold
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Lighting Rig (Warm Key, Cool Fill, Lavender Rim)
    const keyLight = new THREE.DirectionalLight('#FFF3E0', 1.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight('#A78BFA', '#1A1238', 0.85);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight('#F5D58A', 2.0, 15);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 4. Starfield & Nebula Particles
    const starCount = isSoftwareGl ? 300 : 650;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colLavender = new THREE.Color('#A78BFA');
    const colGold = new THREE.Color('#F5D58A');
    const colWhite = new THREE.Color('#FFF9FF');

    for (let i = 0; i < starCount; i++) {
      const r = 8 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const randC = Math.random();
      const c = randC > 0.6 ? colLavender : randC > 0.25 ? colGold : colWhite;
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Procedural Objects Groups

    // A. ENVELOPE GROUP (Opening & Letter scenes)
    const envelopeGroup = new THREE.Group();
    envelopeGroup.position.set(0, 0, 0);

    // Envelope body
    const envBodyGeo = new THREE.BoxGeometry(1.8, 1.2, 0.06);
    const envMat = new THREE.MeshPhysicalMaterial({
      color: '#1E1538',
      metalness: 0.15,
      roughness: 0.35,
      clearcoat: 0.4,
      transmission: 0.2,
      transparent: true,
      opacity: 0.95,
    });
    const envBody = new THREE.Mesh(envBodyGeo, envMat);
    envBody.castShadow = true;
    envelopeGroup.add(envBody);

    // Envelope flap (can rotate open)
    const flapGeo = new THREE.BufferGeometry();
    const flapVertices = new Float32Array([
      -0.9, 0.6, 0.035,
       0.9, 0.6, 0.035,
       0.0, 0.0, 0.045
    ]);
    flapGeo.setAttribute('position', new THREE.BufferAttribute(flapVertices, 3));
    flapGeo.computeVertexNormals();
    const flapMat = new THREE.MeshStandardMaterial({
      color: '#2A1F4E',
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapMesh.position.set(0, 0, 0);
    envelopeGroup.add(flapMesh);

    // Golden Wax Seal
    const sealGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24);
    const sealMat = new THREE.MeshStandardMaterial({
      color: '#F5D58A',
      metalness: 0.85,
      roughness: 0.25,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.set(0, 0.08, 0.05);
    envelopeGroup.add(sealMesh);

    // Orbiting stardust ring around envelope
    const ringGeo = new THREE.RingGeometry(1.4, 1.44, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#F5D58A',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const envelopeRing = new THREE.Mesh(ringGeo, ringMat);
    envelopeRing.rotation.x = Math.PI / 3;
    envelopeGroup.add(envelopeRing);

    scene.add(envelopeGroup);

    // B. BIRTHDAY CAKE GROUP (Birthday scene)
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -0.6, 0);

    // Cake Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.12, 36);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#241846',
      metalness: 0.6,
      roughness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.06;
    pedestal.receiveShadow = true;
    cakeGroup.add(pedestal);

    // Cake Bottom Tier
    const tier1Geo = new THREE.CylinderGeometry(1.3, 1.3, 0.7, 36);
    const cakeMat = new THREE.MeshStandardMaterial({
      color: '#342261', // Rich lavender velvet
      roughness: 0.4,
      metalness: 0.1,
    });
    const tier1 = new THREE.Mesh(tier1Geo, cakeMat);
    tier1.position.y = 0.35;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Bottom tier golden icing trim
    const trim1Geo = new THREE.TorusGeometry(1.31, 0.04, 16, 48);
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: '#F5D58A',
      metalness: 0.9,
      roughness: 0.2,
    });
    const trim1 = new THREE.Mesh(trim1Geo, goldTrimMat);
    trim1.rotation.x = Math.PI / 2;
    trim1.position.y = 0.7;
    cakeGroup.add(trim1);

    // Cake Top Tier
    const tier2Geo = new THREE.CylinderGeometry(0.85, 0.85, 0.6, 32);
    const tier2 = new THREE.Mesh(tier2Geo, cakeMat);
    tier2.position.y = 1.0;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    const trim2 = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.035, 16, 40), goldTrimMat);
    trim2.rotation.x = Math.PI / 2;
    trim2.position.y = 1.3;
    cakeGroup.add(trim2);

    // 15 Glowing Candles arranged in a circle on top tier
    const candleCount = 15;
    const candleRadius = 0.62;
    const candleMeshes: THREE.Mesh[] = [];
    const flameMeshes: THREE.Mesh[] = [];
    const flameLights: THREE.PointLight[] = [];

    const candleGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.28, 12);
    const candleMat = new THREE.MeshStandardMaterial({
      color: '#FFF9FF',
      roughness: 0.2,
    });

    const flameGeo = new THREE.ConeGeometry(0.032, 0.09, 12);
    const flameMat = new THREE.MeshBasicMaterial({
      color: '#FFA23A',
    });

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const cx = Math.cos(angle) * candleRadius;
      const cz = Math.sin(angle) * candleRadius;

      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(cx, 1.44, cz);
      candle.castShadow = true;
      cakeGroup.add(candle);
      candleMeshes.push(candle);

      const flame = new THREE.Mesh(flameGeo, flameMat.clone());
      flame.position.set(cx, 1.62, cz);
      cakeGroup.add(flame);
      flameMeshes.push(flame);
    }

    // Single performant warm candle glow light
    const candleCenterLight = new THREE.PointLight('#FFA23A', 1.6, 5);
    candleCenterLight.position.set(0, 1.7, 0);
    cakeGroup.add(candleCenterLight);
    flameLights.push(candleCenterLight);

    // Floating decorative balloons beside cake
    const balloonGroup = new THREE.Group();
    const balloonColors = ['#A78BFA', '#F5D58A', '#FFB6D9'];
    for (let b = 0; b < 4; b++) {
      const bGeo = new THREE.SphereGeometry(0.28, 24, 24);
      bGeo.scale(1, 1.25, 1);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: balloonColors[b % balloonColors.length],
        metalness: 0.1,
        roughness: 0.15,
        clearcoat: 0.8,
        transmission: 0.2,
      });
      const balloon = new THREE.Mesh(bGeo, bMat);
      const side = b % 2 === 0 ? 1 : -1;
      balloon.position.set(side * (1.6 + b * 0.3), 1.2 + b * 0.45, -0.4 + b * 0.2);
      balloonGroup.add(balloon);
    }
    cakeGroup.add(balloonGroup);

    scene.add(cakeGroup);

    // C. TRANSLUCENT GLASS HEART & COSMIC PLATFORM (Promise scene)
    const promiseGroup = new THREE.Group();
    promiseGroup.position.set(0, 0, 0);

    // Heart Shape
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 1.0);
    heartShape.bezierCurveTo(x + 0.65, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
    heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();
    // Rotate to orient right side up
    heartGeo.rotateZ(Math.PI);

    const glassHeartMat = new THREE.MeshPhysicalMaterial({
      color: '#FFB6D9',
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.92,
      transparent: true,
      opacity: isSoftwareGl ? 0.65 : 0.95,
      ior: 1.52,
      thickness: 1.2,
      attenuationColor: new THREE.Color('#A78BFA'),
      attenuationDistance: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const heartMesh = new THREE.Mesh(heartGeo, glassHeartMat);
    heartMesh.scale.set(1.4, 1.4, 1.4);
    heartMesh.position.set(0, 0.4, 0);
    promiseGroup.add(heartMesh);

    // Glowing cosmic pedestal beneath heart
    const platGeo = new THREE.CylinderGeometry(1.8, 2.1, 0.15, 36);
    const platMat = new THREE.MeshStandardMaterial({
      color: '#1E123D',
      roughness: 0.25,
      metalness: 0.7,
    });
    const platform = new THREE.Mesh(platGeo, platMat);
    platform.position.set(0, -0.85, 0);
    promiseGroup.add(platform);

    const platRing = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 1.95, 48),
      new THREE.MeshBasicMaterial({ color: '#A78BFA', side: THREE.DoubleSide })
    );
    platRing.rotation.x = Math.PI / 2;
    platRing.position.set(0, -0.77, 0);
    promiseGroup.add(platRing);

    // Orbiting particle stardust ring around heart
    const heartRingCount = 180;
    const hRingGeo = new THREE.BufferGeometry();
    const hRingPos = new Float32Array(heartRingCount * 3);
    for (let i = 0; i < heartRingCount; i++) {
      const a = (i / heartRingCount) * Math.PI * 2;
      const rad = 1.35 + (Math.random() - 0.5) * 0.25;
      hRingPos[i * 3] = Math.cos(a) * rad;
      hRingPos[i * 3 + 1] = 0.4 + (Math.random() - 0.5) * 0.3;
      hRingPos[i * 3 + 2] = Math.sin(a) * rad;
    }
    hRingGeo.setAttribute('position', new THREE.BufferAttribute(hRingPos, 3));
    const hRingMat = new THREE.PointsMaterial({
      size: 0.06,
      color: '#F5D58A',
      transparent: true,
      opacity: 0.8,
    });
    const heartRing = new THREE.Points(hRingGeo, hRingMat);
    promiseGroup.add(heartRing);

    scene.add(promiseGroup);

    // D. FIREWORKS & WISH BURST PARTICLES
    const burstCount = 350;
    const burstGeo = new THREE.BufferGeometry();
    const burstPositions = new Float32Array(burstCount * 3);
    const burstVelocities = new Float32Array(burstCount * 3);
    const burstColors = new Float32Array(burstCount * 3);

    for (let i = 0; i < burstCount; i++) {
      burstPositions[i * 3] = 0;
      burstPositions[i * 3 + 1] = -100; // start off-screen
      burstPositions[i * 3 + 2] = 0;

      // Spherical burst velocities
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const spd = 1.2 + Math.random() * 2.8;

      burstVelocities[i * 3] = Math.sin(phi) * Math.cos(theta) * spd;
      burstVelocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * spd;
      burstVelocities[i * 3 + 2] = Math.cos(phi) * spd;

      const c = Math.random() > 0.5 ? colGold : colLavender;
      burstColors[i * 3] = c.r;
      burstColors[i * 3 + 1] = c.g;
      burstColors[i * 3 + 2] = c.b;
    }

    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
    burstGeo.setAttribute('color', new THREE.BufferAttribute(burstColors, 3));

    const burstMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0,
    });
    const burstPoints = new THREE.Points(burstGeo, burstMat);
    scene.add(burstPoints);

    let burstLife = 0;
    let burstActive = false;

    const triggerBurst = (originY = 1.0) => {
      burstActive = true;
      burstLife = 1.0;
      burstMat.opacity = 1.0;
      const pos = burstGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < burstCount; i++) {
        pos[i * 3] = 0;
        pos[i * 3 + 1] = originY;
        pos[i * 3 + 2] = 0;
      }
      burstGeo.attributes.position.needsUpdate = true;
    };

    // E. STYLIZED FRIENDSHIP FIGURES (User & Bushra companion characters)
    const friendshipFigures = createFriendshipFigures();
    scene.add(friendshipFigures.group);

    // Watch for wishTriggeredCount changes
    let lastWishCount = sceneStateRef.current.wishTriggeredCount;

    // 6. Animation & Render Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.08);
      const elapsed = clock.getElapsedTime();
      const state = sceneStateRef.current;

      // Update friendship characters with scene-specific animations
      friendshipFigures.update(elapsed, delta, state.currentScene);

      // Check if user triggered wish
      if (state.wishTriggeredCount !== lastWishCount) {
        lastWishCount = state.wishTriggeredCount;
        triggerBurst(state.currentScene === 'birthday' ? 1.4 : 0.5);
      }

      // Rotate Starfield gently
      starField.rotation.y = elapsed * 0.02;
      starField.rotation.x = Math.sin(elapsed * 0.01) * 0.05;

      // Visibility & Positions based on active scene
      const sceneId = state.currentScene;

      // Scene Visibility Targets
      const targetEnvVis = (sceneId === 'opening' || sceneId === 'letter') ? 1 : 0;
      const targetCakeVis = (sceneId === 'birthday') ? 1 : 0;
      const targetHeartVis = (sceneId === 'promise' || sceneId === 'celebration') ? 1 : 0;

      envelopeGroup.visible = targetEnvVis > 0;
      cakeGroup.visible = targetCakeVis > 0;
      promiseGroup.visible = targetHeartVis > 0;

      // Animate Envelope
      if (envelopeGroup.visible) {
        envelopeGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.18;
        envelopeGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;
        envelopeRing.rotation.z = elapsed * 0.4;

        // If in letter scene, animate flap open
        if (sceneId === 'letter') {
          flapMesh.rotation.x = THREE.MathUtils.damp(flapMesh.rotation.x, Math.PI * 0.7, 4, delta);
        } else {
          flapMesh.rotation.x = THREE.MathUtils.damp(flapMesh.rotation.x, 0, 4, delta);
        }
      }

      // Animate Cake
      if (cakeGroup.visible) {
        cakeGroup.rotation.y = elapsed * 0.22;
        // Candle flame flicker
        const flicker = Math.sin(elapsed * 18) * 0.15 + 1.0;
        flameMeshes.forEach((flame) => {
          if (state.candlesBlownOut) {
            flame.scale.set(0.001, 0.001, 0.001);
            flame.visible = false;
          } else {
            flame.visible = true;
            flame.scale.set(flicker, flicker * 1.1, flicker);
          }
        });
        flameLights.forEach((light) => {
          light.intensity = state.candlesBlownOut ? 0 : 0.8 * flicker;
        });

        // Balloon float
        balloonGroup.children.forEach((b, idx) => {
          b.position.y = 1.2 + idx * 0.4 + Math.sin(elapsed * 2 + idx) * 0.06;
        });
      }

      // Animate Glass Heart
      if (promiseGroup.visible) {
        heartMesh.rotation.y = elapsed * 0.35;
        heartMesh.position.y = 0.4 + Math.sin(elapsed * 1.5) * 0.08;
        heartRing.rotation.y = -elapsed * 0.5;
        heartRing.rotation.x = Math.sin(elapsed * 0.7) * 0.2;
      }

      // Update particle burst
      if (burstActive) {
        burstLife -= delta * 0.75;
        burstMat.opacity = Math.max(0, burstLife);
        const pos = burstGeo.attributes.position.array as Float32Array;

        for (let i = 0; i < burstCount; i++) {
          pos[i * 3] += burstVelocities[i * 3] * delta;
          pos[i * 3 + 1] += (burstVelocities[i * 3 + 1] - 0.4 * (1 - burstLife)) * delta;
          pos[i * 3 + 2] += burstVelocities[i * 3 + 2] * delta;
        }
        burstGeo.attributes.position.needsUpdate = true;

        if (burstLife <= 0) {
          burstActive = false;
        }
      }

      // Camera Choreography per scene
      if (sceneId === 'opening') {
        _camPosTarget.set(0, 0.2, 3.8);
        _vec3Target.set(0, 0, 0);
      } else if (sceneId === 'birthday') {
        _camPosTarget.set(0, 1.4, 4.4);
        _vec3Target.set(0, 0.5, 0);
      } else if (sceneId === 'memories') {
        _camPosTarget.set(0, 0.8, 5.0);
        _vec3Target.set(0, 0, 0);
      } else if (sceneId === 'timeline') {
        _camPosTarget.set(0, 1.2, 5.2);
        _vec3Target.set(0, 0, 0);
      } else if (sceneId === 'letter') {
        _camPosTarget.set(0, 0.1, 3.2);
        _vec3Target.set(0, 0, 0);
      } else if (sceneId === 'promise') {
        _camPosTarget.set(0, 0.6, 4.2);
        _vec3Target.set(0, 0.3, 0);
      } else if (sceneId === 'celebration') {
        _camPosTarget.set(0, 1.0, 5.0);
        _vec3Target.set(0, 0.3, 0);
      }

      // Smooth camera interpolation
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _camPosTarget.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _camPosTarget.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camPosTarget.z, 3.5, delta);
      camera.lookAt(_vec3Target);

      try {
        renderer.render(scene, camera);
      } catch (err) {
        console.warn('Render tick issue:', err);
      }

      if (isSoftwareGl) {
        // Robust software GL pacing without fragile fenceSync blocking
        animationFrameId = window.setTimeout(tick, 35);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    }

    // Start loop
    if (isSoftwareGl) {
      animationFrameId = window.setTimeout(tick, 20);
    } else {
      animationFrameId = requestAnimationFrame(tick);
    }

    // 7. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        window.clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      envBodyGeo.dispose();
      envMat.dispose();
      flapGeo.dispose();
      flapMat.dispose();
      sealGeo.dispose();
      sealMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      tier1Geo.dispose();
      tier2Geo.dispose();
      cakeMat.dispose();
      goldTrimMat.dispose();
      candleGeo.dispose();
      candleMat.dispose();
      flameGeo.dispose();
      flameMat.dispose();
      heartGeo.dispose();
      glassHeartMat.dispose();
      platGeo.dispose();
      platMat.dispose();
      platRing.geometry.dispose();
      (platRing.material as THREE.Material).dispose();
      hRingGeo.dispose();
      hRingMat.dispose();
      burstGeo.dispose();
      burstMat.dispose();
      friendshipFigures.dispose();
    };
  }, [webGlSupported]);

  if (!webGlSupported) {
    return (
      <Cosmic2DFallback
        currentScene={currentScene}
        candlesBlownOut={candlesBlownOut}
        wishTriggeredCount={wishTriggeredCount}
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {/* Cinematic subtle vignette and gradient depth */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#10091F]/30 to-[#10091F]/80 pointer-events-none" />
    </div>
  );
};
