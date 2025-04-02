'use client';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const AboutMe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // === Three.js Setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make the background transparent

    // === Particles ===
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 50;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // === OrbitControls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // === Window Resize Handling ===
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    // === Animation ===
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      controls.update(); // Update controls on each frame
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const images = [
    '/about/stl-ocean.png',
    '/about/mv.png',
    '/about/break-dance1.png',
    '/about/break-dance2.png',
    '/about/break-dance3.png',
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Close lightbox when Escape key is pressed
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <section id="about" className="p-8 relative mt-20">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative text-white">
  {/* Dark overlay */}
  <div className="absolute inset-0  opacity-60"></div>
  <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
  <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row md:gap-16 flex flex-col-reverse">
    
    {/* Text & CTA Section */}
    <div className="flex flex-col justify-center text-center sm:text-left mb-10 space-y-6 order-1 md:order-2">
      <h1 className="text-3xl sm:text-5xl font-extrabold">
        Hi, I'm Malik Villarreal
      </h1>
      <p className="text-lg sm:text-xl text-gray-200">
        Tenured e-commerce professional specializing in full-stack development and digital marketing. I drive success by connecting code to conversions, consistently exceeding objectives and delivering exceptional value.
      </p>
      <p className="text-lg sm:text-xl text-gray-200">
        Outside of my professional work, I enjoy being in nature, meditation, dancing, comedy, stargazing, being creative and of course, cooking some great meals.
      </p>
    </div>

    {/* Image Slider Section */}
    <div className="flex justify-center items-center hover:border-slate-700 hover:bg-indigo-500/50 shadow border-4 hover:border-6 text-white/25 hover:text-white/50 p-6 rounded-lg transition duration-900 cursor-pointer order-2 md:order-1">
      <div className="relative w-full sm:w-96 sm:h-96 h-72 overflow-hidden rounded-lg shadow-lg">
        <img
          src={images[currentIndex]}
          alt="Slider Image"
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
        />
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 p-2 rounded-full shadow-md hover:bg-indigo-700"
        >
          &#60;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 p-2 rounded-full shadow-md hover:bg-indigo-700"
        >
          &#62;
        </button>
      </div>
    </div>

  </div>
</div>

</div>



      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[1000] flex items-center justify-center px-4" onClick={closeLightbox}>
          <div className="relative w-full max-w-4xl h-auto flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[70%] flex justify-center items-center">
              <Image
                src={images[currentIndex]}
                alt="Lightbox Image"
                width={600}
                height={400}
                className="object-cover w-full h-auto rounded-lg cursor-pointer"
                onClick={nextSlide}
              />
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-md hover:bg-gray-800 transition"
            >
              &#60;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-3 rounded-full shadow-md hover:bg-gray-800 transition"
            >
              &#62;
            </button>
          </div>

          <button
            className="absolute top-4 mt-12 right-4 text-white text-3xl p-3 bg-gray-900 rounded-full hover:bg-gray-800 transition z-[1100]"
            onClick={closeLightbox}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
};

export default AboutMe;


