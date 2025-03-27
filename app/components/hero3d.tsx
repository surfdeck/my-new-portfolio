'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShaderMaterial } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

// === Enhanced Warp Shader ===
const enhancedWarpShader = {
  uniforms: {
    time: { value: 0.0 },
    warpIntensity: { value: 0.5 },
    colorShift: { value: 0.1 },
    aiNoiseIntensity: { value: 0.0 },
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
      float distortion = sin(time * 2.0 + uv.x * 2.0) * warpIntensity;
      vec2 warpedUv = uv + distortion;

      float aiNoise = sin(uv.x * 2.0 + time) * aiNoiseIntensity;
      warpedUv += aiNoise * 0.1;

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

    // === Load Background Image ===
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/space.jpg', (texture) => {
      scene.background = texture;
    });

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 700, 350);
    camera.lookAt(0, 20, 0);

    // === Particle Setup ===
  const particleCount = 18000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

const color = new THREE.Color();
const particleDistance = 1200;

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  
  const distance = Math.random() * particleDistance;
  const angle = Math.random() * Math.PI * 2;

  // Ensure that the position values are valid
  const x = Math.cos(angle) * distance;
  const y = (Math.random() - 0.5) * particleDistance * 20.5;
  const z = Math.sin(angle) * distance;

  // Add a check for NaN
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    console.error(`Invalid position values at index ${i}: x=${x}, y=${y}, z=${z}`);
  }

  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;

  const hue = Math.random() * 0.1 + 0.65;
  color.setHSL(hue, 0.9, 0.6 + Math.random() * 0.3);
  colors[i3] = color.r;
  colors[i3 + 1] = color.g;
  colors[i3 + 2] = color.b;

  sizes[i] = Math.random() * 2 + 2;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// Compute the bounding sphere
geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({
      size: 7.,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // === Composer & Effects ===
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.00005;
    composer.addPass(rgbShiftPass);

    // === Interactive Controls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.zoomSpeed = 0.7;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;

    // === Animation Loop ===
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      time += 0.01;
      enhancedWarpShader.uniforms.time.value = time;

      // Adjusting particle rotation speed
      particles.rotation.y += 0.0003;

      // Update OrbitControls for user interaction (rotating with mouse)
      controls.update();

      // Render the scene with the postprocessing effects
      composer.render();
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 object-cover" />;
};

export default Hero3D;

