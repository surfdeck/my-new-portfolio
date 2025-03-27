'use client';
import Hero3D from 'app/components/hero3d'; // Your epic Hero3D component
import ThankYou from 'app/components/thank-you';
import Projects from 'app/components/projects';
import AboutMe from 'app/components/about';
import Skills from 'app/components/skills';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Vertex Shader to distort geometry
const vertexShader = `
uniform float uTime;
uniform vec2 uMousePos;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 newPosition = position;
  
  // Create morphing effect based on time
  newPosition.z += sin(uTime + vUv.x * 10.0) * 0.05;
  
  // Displace the text based on mouse position
  float dist = distance(gl_Position.xy, uMousePos);
  newPosition.x += sin(uTime + dist * 25.0) * 0.03;
  newPosition.y += cos(uTime + dist * 5.0) * 0.03;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePos;
varying vec2 vUv;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  vec2 center = uMousePos / uResolution;
  float dist = distance(st, center);
  
  // Glowing Neon Effect
  float brightness = pow(1.0 - dist, 5.0) * exp(-dist * 5.0);
  vec3 color = vec3(brightness * 1.0, brightness * 0.5, brightness * 1.0); // Neon Pink/Blue

  gl_FragColor = vec4(color, 1.0);
}`;

export default function Page() {
  const [rotation, setRotation] = useState(0);
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const backgroundRef = useRef(null); // Reference to the background container
  const [isHovered, setIsHovered] = useState(false);

  const handleRotate = () => {
    setRotation(rotation + 45); // Rotate by 45 degrees each time
  };

  // Update mouse position
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition([clientX, clientY]);
  };

  useEffect(() => {
    // Attach the mousemove event listener
    const backgroundElement = backgroundRef.current;
    backgroundElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      backgroundElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Set up 3D scene using Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMousePos: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);

    camera.position.z = 1;

    const animate = () => {
      shaderMaterial.uniforms.uTime.value += 0.05;
      shaderMaterial.uniforms.uMousePos.value.set(mousePosition[0], mousePosition[1]);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, [mousePosition]);

  // Mouse enter and leave handlers for the button
  const createSupernovaEffect = () => {
    setIsHovered(true);
  };

  const removeSupernovaEffect = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative scroll-smooth">
      {/* Epic 3D Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        ref={backgroundRef} // Reference for background
      >
        <Hero3D />
      </div>

      {/* Content Wrapper with Extra Spacing */}
      <div className="relative z-10 flex flex-col gap-y-12">
        {/* Hero Section */}
        <section className="h-screen text-black flex flex-col justify-center items-center text-center text-white px-4">
          <a
            id="explore-btn"
            href="#projects"
            className={`px-6 py-3 rounded-full transition ${
              isHovered ? 'text-neon-glow' : ''
            }`}
            onClick={handleRotate}
            onMouseEnter={createSupernovaEffect}
            onMouseLeave={removeSupernovaEffect}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 2000.3s ease',
            }}
          >
            Explore my personal portfolio
          </a>
          <p>Where innovation transcends space and time. I specialize in limitless creativity and working hard!</p>
        </section>

        <AboutMe />
        <div className="text-center text-white text-4xl font-bold mt-4">Abilities</div>
        <Skills />
        <Projects />
        <ThankYou />
      </div>
    </div>
  );
}
