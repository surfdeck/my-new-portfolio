'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShaderMaterial } from 'three';

// === Enhanced Warp Shader ===
const enhancedWarpShader = {
  uniforms: {
    time: { value: 0.0 },
    warpIntensity: { value: 0.5 },
    colorShift: { value: 0.1 },
    aiNoiseIntensity: { value: 0.0 }, // AI-driven noise intensity for dynamic effects
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 newPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 2.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float warpIntensity;
    uniform float colorShift;
    uniform float aiNoiseIntensity;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float distortion = sin(time * 1.0 + uv.x * 6.0) * warpIntensity;
      vec2 warpedUv = uv + distortion;

      // AI-driven noise effect that fluctuates over time
      float aiNoise = sin(uv.x * 10.0 + time) * aiNoiseIntensity;
      warpedUv += aiNoise * 0.1; // Applying AI effect on UV

      // Color palette with AI-driven dynamic color shift
      vec3 color1 = vec3(0.0, 0.5 + colorShift, 0.2);
      vec3 color2 = vec3(0.0, 0.3, 0.9);
      vec3 color3 = vec3(0.0, 1.0, 1.0);

      vec3 baseColor = mix(color1, color2, uv.y);
      vec3 finalColor = mix(baseColor, color3, warpedUv.x);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const Hero3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // === Scene ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050515);

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 300, 350);
    camera.lookAt(0, 0, 0);

    // === Particle Setup (AI-Influenced) ===
    const particleCount = 18000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3); // AI-driven particle velocities
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color();
    const particleDistance = 1200;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const distance = Math.random() * particleDistance;
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = Math.cos(angle) * distance;
      positions[i3 + 1] = (Math.random() - 0.5) * particleDistance * 0.5;
      positions[i3 + 2] = Math.sin(angle) * distance;

      const hue = Math.random() * 0.1 + 0.65;
      color.setHSL(hue, 0.9, 0.6 + Math.random() * 0.3);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 1;

      // AI-driven velocities: random fluctuation
      velocities[i3] = Math.random() * 0.1 - 0.05; // X velocity
      velocities[i3 + 1] = Math.random() * 0.1 - 0.05; // Y velocity
      velocities[i3 + 2] = Math.random() * 0.1 - 0.05; // Z velocity
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3)); // Add velocity attribute

    // Points Material
    const material = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // === Enhanced Nebula with Shader ===
    const nebulaGeometry = new THREE.SphereGeometry(450, 64, 64);
    const nebulaMaterial = new ShaderMaterial(enhancedWarpShader);
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // === Interactive Controls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.zoomSpeed = 0.7;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // === Dynamic AI Noise and Warp Intensity ===
    let time = 0;
    let zoomLevel = 0;
    let warpIntensityFactor = 12.0;
    let colorShiftFactor = 0.0;

    window.addEventListener('wheel', (event) => {
      zoomLevel += event.deltaY * 0.003;
      zoomLevel = Math.max(-40, Math.min(40, zoomLevel));

      // Dynamic warp and color shift based on zoom
      warpIntensityFactor = 1.0 + Math.sin(zoomLevel * 0.1) * 0.8;
      colorShiftFactor = Math.cos(zoomLevel * 10.08) * 0.15;
    });

    // === AI-Driven Particle Movement ===
    const updateParticles = () => {
      const positionsArray = geometry.attributes.position.array;
      const velocitiesArray = geometry.attributes.velocity.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionsArray[i3] += velocitiesArray[i3];
        positionsArray[i3 + 1] += velocitiesArray[i3 + 1];
        positionsArray[i3 + 2] += velocitiesArray[i3 + 2];

        // Apply AI-driven behavior: small random noise to the velocity
        velocitiesArray[i3] += (Math.random() - 0.5) * 0.001;
        velocitiesArray[i3 + 1] += (Math.random() - 0.5) * 0.001;
        velocitiesArray[i3 + 2] += (Math.random() - 0.5) * 0.001;
      }

      geometry.attributes.position.needsUpdate = true; // Update particle positions
    };

    // === Animation Loop ===
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.01;
      enhancedWarpShader.uniforms.time.value = time;
      enhancedWarpShader.uniforms.warpIntensity.value = enhancedWarpShader.uniforms.warpIntensity.value + (warpIntensityFactor - enhancedWarpShader.uniforms.warpIntensity.value) * 0.03;
      enhancedWarpShader.uniforms.colorShift.value = enhancedWarpShader.uniforms.colorShift.value + (colorShiftFactor - enhancedWarpShader.uniforms.colorShift.value) * 0.02;

      // Update AI noise intensity over time
      enhancedWarpShader.uniforms.aiNoiseIntensity.value = Math.sin(time * 0.5) * 0.1;

      // Update particles based on AI
      updateParticles();

      // Subtle particle rotation and nebula scaling
      particles.rotation.y += 0.0003 + zoomLevel * 0.00005;
      nebula.scale.set(
        1 + Math.sin(time * 0.8) * 0.03,
        1 + Math.cos(time * 0.8) * 0.03,
        1 + Math.sin(time * 0.8) * 0.03
      );

      camera.position.z = camera.position.z + (350 + zoomLevel * 15 - camera.position.z) * 0.04;
      camera.position.y = camera.position.y + (300 - zoomLevel * 8 - camera.position.y) * 0.03;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // === Resize Handling ===
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // === Cleanup ===
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      nebulaMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 object-cover" />
    </div>
  );
};

export default Hero3D;
