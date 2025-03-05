'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShaderMaterial } from 'three';
import * as dat from 'dat.gui'; // Import dat.gui for UI controls (optional)


// === Enhanced Warp Shader ===
const enhancedWarpShader = {
  uniforms: {
    time: { value: 0.0 },
    warpIntensity: { value: 0.5 }, // Renamed and adjusted intensity
    colorShift: { value: 0.1 },     // New color shift parameter
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 newPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float warpIntensity;
    uniform float colorShift;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float distortion = sin(time * 3.0 + uv.x * 12.0) * warpIntensity; // Faster warp
      vec2 warpedUv = uv + distortion;

      // New Color palette: Green, Blue, and Cyan
      vec3 color1 = vec3(0.0, 0.5 + colorShift, 0.2);   // Vibrant Green base
      vec3 color2 = vec3(0.0, 0.3, 0.9);                 // Deep Blue
      vec3 color3 = vec3(0.0, 1.0, 1.0);                 // Bright Cyan

      vec3 baseColor = mix(color1, color2, uv.y);       // Vertical gradient
      vec3 finalColor = mix(baseColor, color3, warpedUv.x); // Horizontal warp color shift

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
    scene.background = new THREE.Color(0x050515); // Darker, richer cosmic background

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000); // Slightly wider FOV
    camera.position.set(0, 300, 350); // Adjusted position
    camera.lookAt(0, 0, 0);

    // === Particle Setup (Refined) ===
    const particleCount = 18000; // Slightly increased particle count
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount); // Particle sizes

    const color = new THREE.Color();
    const particleDistance = 1200; // Increased particle spread

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const distance = Math.random() * particleDistance;
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = Math.cos(angle) * distance;
      positions[i3 + 1] = (Math.random() - 0.5) * particleDistance * 0.5; // Vertical spread, less than horizontal
      positions[i3 + 2] = Math.sin(angle) * distance;

      // Neon particle colors, more controlled
      const hue = Math.random() * 0.1 + 0.65;  // Hue range around Cyan-Blue
      color.setHSL(hue, 0.9, 0.6 + Math.random() * 0.3); // High saturation, varied brightness
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 1; // Slightly larger size range
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1)); // Set sizes attribute

    // Points Material with Size Attenuation
    const material = new THREE.PointsMaterial({
      size: 2.5, // Adjusted base size
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true, // Enable size attenuation for depth
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);


    // === Enhanced Nebula with Shader ===
    const nebulaGeometry = new THREE.SphereGeometry(450, 64, 64); // More detailed sphere
    const nebulaMaterial = new ShaderMaterial(enhancedWarpShader); // Use enhanced shader
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);


    // === Interactive Controls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true; // Re-enable zoom for more exploration
    controls.zoomSpeed = 0.7;     // Control zoom speed
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Smoother damping
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3; // Slightly faster auto-rotate


    // === Dynamic Warp Intensity and Color Shift ===
    let time = 0;
    let zoomLevel = 0;
    let warpIntensityFactor = 1.0;  // Base warp intensity factor
    let colorShiftFactor = 0.0;     // Base color shift factor

    window.addEventListener('wheel', (event) => {
      zoomLevel += event.deltaY * 0.003; // Slower zoom
      zoomLevel = Math.max(-40, Math.min(40, zoomLevel)); // Extended zoom range, still clamped

      // Dynamic warp and color shift based on zoom
      warpIntensityFactor = 1.0 + Math.sin(zoomLevel * 0.1) * 0.8; // Warp intensity oscillates with zoom
      colorShiftFactor = Math.cos(zoomLevel * 0.08) * 0.15;       // Color shift oscillates too
    });


     // === dat.GUI controls (Optional - for development/experimentation) ===
    // const gui = new dat.GUI(); // Uncomment to use dat.GUI
    // const shaderControls = gui.addFolder('Shader Controls');
    // shaderControls.add(enhancedWarpShader.uniforms.warpIntensity, 'value', 0, 2.0).name('Warp Intensity');
    // shaderControls.add(enhancedWarpShader.uniforms.colorShift, 'value', -0.5, 0.5).name('Color Shift');
    // shaderControls.open();
    // gui.close(); // Initially close GUI


    // === Animation Loop ===
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.01;
      enhancedWarpShader.uniforms.time.value = time;
      enhancedWarpShader.uniforms.warpIntensity.value = enhancedWarpShader.uniforms.warpIntensity.value + (warpIntensityFactor - enhancedWarpShader.uniforms.warpIntensity.value) * 0.03; // Smoothly transition warp
      enhancedWarpShader.uniforms.colorShift.value = enhancedWarpShader.uniforms.colorShift.value + (colorShiftFactor - enhancedWarpShader.uniforms.colorShift.value) * 0.02; // Smooth color shift

      // Subtle particle rotation
      particles.rotation.y += 0.0003 + zoomLevel * 0.00005; // Less rotation

      // Dynamic nebula scale (less extreme)
      nebula.scale.set(
        1 + Math.sin(time * 0.8) * 0.03, // Less scaling
        1 + Math.cos(time * 0.8) * 0.03,
        1 + Math.sin(time * 0.8) * 0.03
      );

      // Smoother zoom and position change
      camera.position.z = camera.position.z + (350 + zoomLevel * 15 - camera.position.z) * 0.04; // Smoother zoom to target
      camera.position.y = camera.position.y + (300 - zoomLevel * 8 - camera.position.y) * 0.03; // Subtle vertical position change

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
      nebulaMaterial.dispose(); // Dispose nebula material
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 object-cover" />
    </div>
  );
};

export default Hero3D;