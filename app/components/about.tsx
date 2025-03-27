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
    const particlesCount = 100;
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
    '/about/art-project3.png',
    '/about/break-dance1.png',
    '/about/break-dance2.png',
    '/about/break-dance3.png',
    '/about/break-dance4.png',
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
    <section id="about" className="p-8 relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative text-white">
        <div className="absolute inset-0 bg-black/25"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 ">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex justify-center items-center">
              <div className="relative w-full sm:w-96 sm:h-96 h-72 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={images[currentIndex]}
                  alt="Slider Image"
                  className="object-cover w-full h-full transition-transform duration-300 ease-in-out cursor-pointer"
                  onClick={() => openLightbox(currentIndex)}
                />
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700"
                >
                  &#60;
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700"
                >
                  &#62;
                </button>
              </div>
            </div>

             <div className=" justify-center text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                Hi, I'm Malik Villarreal
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-gray-300">
                Driving e-commerce success from code to conversion: I am a full-stack developer and digital marketing leader with a decade of experience in consistently delivering exceptional results. My proven track record spans diverse industries, where I excel at managing projects end-to-end and not just meeting, but exceeding key objectives. From architecting robust e-commerce platforms to visualizing complex data in 3D, I thrive on creative problem-solving, always pushing to surpass industry standards and build solutions that truly perform. My journey, rooted in web fundamentals and brand development, has always been driven by a deep commitment to going above and beyond for every project and client.
              </p>

              <div className="flex justify-center sm:justify-start gap-6 mb-8">
                {/* Social Media Links */}
                <a
                  href="https://github.com/surfdeck" // Replace with your GitHub or other profiles
                  target="_blank"
                  className="text-indigo-400 hover:text-indigo-600 transition"
                >
                  GitHub
                </a>
                <a
                  href="mailto:imarkets365@gmail.com" // Replace with your email
                  className="text-indigo-400 hover:text-indigo-600 transition"
                >
                  Email
                </a>
              </div>

              <p className="text-lg sm:text-xl text-gray-300 mb-8">
                When I'm not immersed in code, I prioritize personal growth through reading, embrace the restorative power of nature, and find grounding in my faith and a healthy lifestyle – all contributing to my drive to build impactful solutions and meaningful collaborations. And of course, dancing! 
              </p>
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


