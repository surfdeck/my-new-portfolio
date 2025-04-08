'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Skills = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);  // Type the ref explicitly

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;  // Ensure container exists before proceeding

    const { clientWidth, clientHeight } = container;

    // === Scene Setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(clientWidth, clientHeight);
    container.appendChild(renderer.domElement);  // This should work now

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const boundary = { x: 250, y: 250, z: 50 };
    scene.background = new THREE.Color('#000000'); // Beige color

    // === Starry Background (Larger Stars) ===
    const createStars = (count: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 7, // Increased size for larger stars
        sizeAttenuation: true,
        transparent: true,
      });

      const stars = new THREE.Points(geometry, material);
      scene.add(stars);
    };
    createStars(700); // Adjusted count for better balance

    // === Skills Data ===
    const skills = [
      "JavaScript", "Python", "React", "Flask", "C++", "Next.js", "TypeScript", 
      "TailwindCSS", "MongoDB", "APIs", "Blender", "Three.js", "Vercel", 
      "AdWords", "SEO/SEM", "Shopify", "Adobe", "Soft Skills", "WordPress", "Mailchimp", 
      "cPanel", "AI", "Marketing", "E-commerce", "Marketing"
    ];

    const createSkillSprite = (skill: string) => {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');

      context!.fillStyle = 'rgba(75, 0, 130, 0.7)';
      context!.beginPath();
      context!.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
      context!.fill();

      context!.font = 'bold 46px sans-serif';
      context!.fillStyle = 'white';
      context!.textAlign = 'center';
      context!.textBaseline = 'middle';
      context!.fillText(skill, size / 2, size / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 20, 1);
      return sprite;
    };

    const bubbles = skills.map((skill) => {
      const sprite = createSkillSprite(skill);
      sprite.position.set(
        (Math.random() - 0.5) * boundary.x,
        (Math.random() - 0.5) * boundary.y,
        (Math.random() - 0.5) * boundary.z
      );
      scene.add(sprite);
      return { sprite, velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ), radius: 4 };
    });

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      bubbles.forEach((bubble) => {
        bubble.sprite.position.add(bubble.velocity.clone().multiplyScalar(delta * 30));
        const pos = bubble.sprite.position;
        if (pos.x < -boundary.x / 2 || pos.x > boundary.x / 2) bubble.velocity.x = -bubble.velocity.x;
        if (pos.y < -boundary.y / 2 || pos.y > boundary.y / 2) bubble.velocity.y = -bubble.velocity.y;
        if (pos.z < -boundary.z / 2 || pos.z > boundary.z / 2) bubble.velocity.z = -bubble.velocity.z;
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onWindowResize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div ref={containerRef} className="relative w-full h-[500px]" />;
};

export default Skills;
