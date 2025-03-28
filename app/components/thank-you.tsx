"use client";
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

export default function ThankYou() {
  useEffect(() => {
    const canvas = document.getElementById('threeCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create the grid
    const gridSize = 150;
    const gridHelper = new THREE.GridHelper(gridSize, gridSize);
    scene.add(gridHelper);

    // Create a sphere with neon material
    const geometry = new THREE.SphereGeometry(10, 1, 22);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffff,
      emissive: 0xff00ff,
      emissiveIntensity: 1,
      metalness: 0.5,
      roughness: 0.1
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(20, 5, 0);
    scene.add(sphere);

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Set camera position
    camera.position.z = 20;

    // Set up orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Set up post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.005;
    composer.addPass(rgbShiftPass);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.01; // Rotate sphere
      controls.update();
      composer.render();
    }

    animate();

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <section id="contact" className="p-8 mt-20 relative">
      <div className="max-w-4xl mt-20 mx-auto text-white px-4 sm:px-6 lg:px-8 z-10 relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Thank You for Visiting!</h2>
        <p className="text-base sm:text-lg">
          Looking forward to working with you. I believe we can build amazing projects together!
        </p>
      </div>
      <canvas id="threeCanvas" className="absolute top-0 left-0 w-full h-full"></canvas>
    </section>
  );
}
