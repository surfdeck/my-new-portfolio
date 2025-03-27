'use client';
import Hero3D from 'app/components/hero3d'; 
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
  newPosition.z += sin(uTime + vUv.x * 10.0) * 0.0005;

  // Displace the text based on mouse position
  float dist = distance(gl_Position.xy, uMousePos);
  newPosition.x += sin(uTime + dist * 10.0) * 0.03;
  newPosition.y += cos(uTime + dist * 5.0) * 0.03;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMousePos;
uniform float uHoverEffect; 
varying vec2 vUv;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  vec2 center = uMousePos / uResolution;
  float dist = distance(st, center);

  // Create supernova effect when hovered
  float brightness = exp(-dist * 5.0) * (1.0 + uHoverEffect * sin(uTime * 2.0));

  // Glowing Neon Effect
  vec3 color = vec3(brightness * 11.0, brightness * 0.5, brightness * 1.0); 

  gl_FragColor = vec4(color, 1.0);
}`;

export default function Page() {
  const [rotation, setRotation] = useState(0);
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const backgroundRef = useRef<HTMLDivElement>(null); // Explicitly typing the ref as HTMLDivElement
  const [isHovered, setIsHovered] = useState(false);

  const handleRotate = () => {
    setRotation(rotation + 45); // Rotate by 45 degrees each time
  };

  // Update mouse position
  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePosition([clientX, clientY]);
  };

  useEffect(() => {
    const backgroundElement = backgroundRef.current;
    if (backgroundElement) {
      backgroundElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (backgroundElement) {
        backgroundElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const rendererContainer = document.createElement('div');
    rendererContainer.style.position = 'fixed';
    rendererContainer.style.top = '0';
    rendererContainer.style.left = '0';
    rendererContainer.style.width = '100%';
    rendererContainer.style.height = '100%';
    rendererContainer.style.zIndex = '-1'; 
    rendererContainer.appendChild(renderer.domElement);
    document.body.appendChild(rendererContainer);

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
      shaderMaterial.uniforms.uTime.value += 0.015;
      shaderMaterial.uniforms.uMousePos.value.set(mousePosition[0], mousePosition[1]);
      shaderMaterial.uniforms.uHoverEffect.value = isHovered ? 1.0 : 0.0;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.body.removeChild(rendererContainer);
    };
  }, [mousePosition, isHovered]);

  const createSupernovaEffect = () => {
    setIsHovered(true);
  };

  const removeSupernovaEffect = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative scroll-smooth">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        ref={backgroundRef}
      >
        <Hero3D />
      </div>

      <div className="relative z-10 flex flex-col gap-y-12">
        <section className="h-screen text-black flex flex-col justify-center items-center text-center text-white px-4">
          <a
            id="explore-btn"
            href="#projects"
            className={`px-6 py-3 hover:bg-indigo-800/25 rounded-full transition duration-300 ${
              isHovered ? 'text-neon-glow' : ''
            }`}
            onClick={handleRotate}
            onMouseEnter={createSupernovaEffect}
            onMouseLeave={removeSupernovaEffect}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease', 
            }}
          >
            Explore my personal portfolio
          </a>

          <p>Where innovation transcends space and time. I specialize in limitless creativity and working hard!</p>
        </section>

        <AboutMe />
        <Skills />
        <Projects />
        <ThankYou />
      </div>
    </div>
  );
}
