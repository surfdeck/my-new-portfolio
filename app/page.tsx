'use client';
import Hero3D from 'app/components/hero3d';
import ThankYou from 'app/components/thank-you';
import Projects from 'app/components/projects';
import About from 'app/components/about';
import Skills from 'app/components/skills';
import Marketing from 'app/components/marketing';
import Blurb from 'app/components/blurb';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- Vertex & Fragment Shader ---
const vertexShader = `...`; // same as before
const fragmentShader = `...`; // same as before

export default function Page() {
  const [rotation, setRotation] = useState(0);
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition([e.clientX, e.clientY]);
  };

  useEffect(() => {
    const container = shaderRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';

    const geometry = new THREE.PlaneGeometry(2, 2);
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMousePos: { value: new THREE.Vector2(0, 0) },
        uHoverEffect: { value: 0.0 },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);
    camera.position.z = 1;

    const animate = () => {
      shaderMaterial.uniforms.uTime.value += 0.01;
      shaderMaterial.uniforms.uMousePos.value.set(mousePosition[0], mousePosition[1]);
      shaderMaterial.uniforms.uHoverEffect.value = isHovered ? 1.0 : 0.0;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeChild(renderer.domElement);
    };
  }, [mousePosition, isHovered]);

  return (
    <div className="relative scroll-smooth bg-black">
      {/* SHADER BACKGROUND */}
      <div ref={shaderRef} className="absolute inset-0 z-0 pointer-events-none" />

      HERO 3D CANVAS
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Hero3D />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col gap-y-12">
        <section className="h-screen flex flex-col justify-center items-center text-center text-black px-4">
          <a
            id="explore-btn"
            href="#projects"
            className={`px-6 py-3 text-xl hover:bg-indigo-800/25 rounded-full transition duration-300 ${
              isHovered ? 'text-neon-glow' : ''
            }`}
            onClick={() => setRotation(rotation + 45)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
          >
            Explore my personal portfolio
          </a>

          <p className="text-lg sm:text-xl text-black">
            Where innovation transcends space and time. I specialize in limitless creativity and working hard!
          </p>
        </section>

        <About />
        <Marketing />
        <Skills />
        <Projects />
        <Blurb />
        <ThankYou />
      </div>
    </div>
  );
}
 