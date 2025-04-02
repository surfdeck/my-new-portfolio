'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

const Hero3D = ({  }) => {
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const particlesRef = useRef(null);
  const particlePositions = useRef([]);
  const particleVelocities = useRef([]);
  
  // Define attractor positions in world space
  const attractorPositions = [
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, -0.5),
    new THREE.Vector3(0, 0.5, 1),
  ];
  
  // Parameters for the particle simulation
  const particleCount = 30; // adjust for performance
  const attractorMass = 1e7;
  const particleGlobalMass = 1e4;
  const gravityConstant = 6.67e-11;
  const damping = 0.99;
  const timeStep = 1 / 60;

  useEffect(() => {
    // --- Renderer, Composer & Scene Setup ---
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass();
    composer.addPass(renderPass);
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = 0.0015;
    composer.addPass(rgbShiftPass);

    const scene = new THREE.Scene();
    // --- Background Image ---
    const bgTexture = new THREE.TextureLoader().load('/star5.jpg'); // update path
    scene.background = bgTexture;

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.set(1.25, 1.25, 1.25);
    renderPass.scene = scene;
    renderPass.camera = camera;

    // --- Lights ---
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    directionalLight.position.set(-4, 2, 0);
    scene.add(directionalLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
 
 
    // --- Attractor Particles ---
    const particlesGeometry = new THREE.SphereGeometry(0.01, 4, 4);
    const particlesMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true });
    const particlesMesh = new THREE.InstancedMesh(particlesGeometry, particlesMaterial, particleCount);
    scene.add(particlesMesh);
    particlesRef.current = particlesMesh;

    // Initialize particle positions and velocities randomly
    particlePositions.current = [];
    particleVelocities.current = [];
    for (let i = 0; i < particleCount; i++) {
      // Start particles in a cube of size 4 centered at origin
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      particlePositions.current.push(pos);
      // Start with zero velocity
      particleVelocities.current.push(new THREE.Vector3());
      // Set initial matrix
      const dummy = new THREE.Object3D();
      dummy.position.copy(pos);
      dummy.updateMatrix();
      particlesMesh.setMatrixAt(i, dummy.matrix);
    }
    particlesMesh.instanceMatrix.needsUpdate = true;

    // --- Controls with Clickable Auto-Rotate Toggle ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 100;
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    const dummy = new THREE.Object3D();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
 

      // --- Attractor Particle Simulation ---
      // For each particle, compute force from each attractor
      for (let i = 0; i < particleCount; i++) {
        const pos = particlePositions.current[i];
        const vel = particleVelocities.current[i];
        const force = new THREE.Vector3();
        for (let j = 0; j < attractorPositions.length; j++) {
          const attractorPos = attractorPositions[j];
          const dir = new THREE.Vector3().subVectors(attractorPos, pos);
          const distanceSq = Math.max(dir.lengthSq(), 20.0001);
          dir.normalize();
          // Simplified gravitational force
          const strength = (attractorMass * particleGlobalMass) / distanceSq;
          force.add(dir.multiplyScalar(strength));
        }
   
        // Update instanced mesh matrix
        dummy.position.copy(pos);
        dummy.updateMatrix();
        particlesMesh.setMatrixAt(i, dummy.matrix);
      }
      particlesMesh.instanceMatrix.needsUpdate = true;

      controls.update();
      composer.render();
    };
    animate();

    // --- Resize Handler ---
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  // Toggle auto-rotate on canvas click
  const handleCanvasClick = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
    />
  );
};

export default Hero3D;
