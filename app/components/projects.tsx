'use client';
import { useState, useEffect } from "react";
import Image from "next/image";

// Define the Project type
type Project = {
  title: string;
  description: string;
  images: string[];
  link: string;
};

const projectsData: Project[] = [
  {
    title: "Brewery Management System",
    description:
      "Brewery Quest is an interactive web application built with Next.js on the frontend and Flask on the backend, designed for craft beer enthusiasts to discover local breweries.",
    images: [
      "/project-brew/1.png",
      "/project-brew/2.png",
      "/project-brew/3.png",
      "/project-brew/4.png",
      "/project-brew/5.png",
      "/project-brew/6.png",
      "/project-brew/7.png",
      "/project-brew/8.png",
      "/project-brew/9.png",
      "/project-brew/10.png",
      "/project-brew/11.png"
    ],
    link: "https://github.com/surfdeck/nextjs-flask-brewery-shop",
  },
  {
    title: "3D Fractal Model Generator",
    description:
      "A fractal model generator built with Next.js, Flask/Python, and Three.js, featuring pre-loaded designs. Also implemented in C++ using Python/JavaScript.",
    images: [
      "/project1/1.png",
      "/project1/2.png",
      "/project1/3.png",
      "/project1/4.png",
      "/project1/5.png",
      "/project1/6.png",
      "/project1/7.png",
      "/project1/8.png",
      "/project1/9.png",
      "/project1/10.png"
    ],
    link: "https://github.com/surfdeck/nextjs-flask-fractal-creator",
  },
  {
    title: "3D Data Visualization with Polygon.io API",
    description:
      "A visualization tool using Polygon.io API to showcase relationships between common stocks, built with Three.js, Next.js, and Flask.",
    images: [
      "/project2/1.png",
      "/project2/2.png",
      "/project2/3.png",
      "/project2/4.png",
      "/project2/7.png",
      "/project2/8.png",
      "/project2/9.png",
      "/project2/10.png"
    ],
    link: "https://github.com/surfdeck/nextjs-flask-apidata-threejs",
  },
  {
    title: "3D Satellite Visualization Tool",
    description:
      "An interactive app displaying satellite trajectories relative to Earth, powered by NASA's SSC Web Services API.",
    images: [
      "/project3/1.png",
      "/project3/2.png",
      "/project3/3.png",
      "/project3/4.png",
      "/project3/5.png",
      "/project3/6.png",
    ],
    link: "https://github.com/surfdeck/nextjs-flask-nasa-sat-loc",
  },
  {
    title: "Financial News Sentiment Analyzer",
    description:
      "A Next.js and Flask app utilizing Polygon.io's Ticker News API to analyze financial news sentiment.",
    images: [
      "/project4/1.png",
      "/project4/2.png",
      "/project4/3.png",
      "/project4/4.png",
      "/project4/5.png",
      "/project4/6.png",
      "/project4/7.png",
      "/project4/8.png",
      "/project4/9.png",
    ],
    link: "https://github.com/surfdeck/nextjs-flask-stock-ticker-news",
  },
  {
    title: "Dynamic Portfolio Tracker",
    description:
      "A comprehensive investment tool tracking stock trends, sentiment insights, and financial data, including performance and dividends.",
    images: [
      "/project5/1.png",
      "/project5/2.png",
      "/project5/3.png",
      "/project5/4.png",
      "/project5/5.png",
      "/project5/6.png",
      "/project5/7.png",
      "/project5/8.png",
      "/project5/9.png",
      "/project5/10.png"
    ],
    link: "https://github.com/surfdeck/nextjs-flask-finance-app",
  },
  {
    title: "National Parks Explorer",
    description:
      "A full-stack demo website built with Next.js and Flask, showcasing National Park Service API data, interactive maps, a booking system, an online shop, and a contact form.",
    images: [
      "/project6/1.png",
      "/project6/2.png",
      "/project6/3.png",
      "/project6/4.png",
      "/project6/5.png",
      "/project6/6.png",
      "/project6/7.png",
      "/project6/8.png",
    ],
    link: "https://github.com/surfdeck/national-parks-website-demo",
  },
  {
    title: "Custom Web Solutions & Branding",
    description:
      "Developed and managed websites, branding, and marketing solutions for John David LLC and its diverse client base. Projects included full website development, e-commerce platforms, digital marketing strategies, and graphic design for businesses across various industries.",
    images: [
      "/project7/1.png",
      "/project7/2.png",
      "/project7/3.png",
      "/project7/4.png",
      "/project7/5.png",
      "/project7/6.png",
      "/project7/7.png",
      "/project7/8.png",
      "/project7/9.png",
      "/project7/10.png"
    ],
    link: "#",
  }
];


export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const nextSlide = () => {
    if (selectedProject) {
      setCurrentIndex((prev) => (prev + 1) % selectedProject.images.length);
    }
  };

  const prevSlide = () => {
    if (selectedProject) {
      setCurrentIndex(
        (prev) =>
          (prev - 1 + selectedProject.images.length) %
          selectedProject.images.length
      );
    }
  };

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <section
      id="projects"
      className="p-8 text-white"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">My Projects</h2>
        <p className="text-xl mb-8">
          Explore a curated selection of my most innovative projects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer" onClick={() => openModal(project)}>
            <div className="w-full h-48 relative mb-4">
              <Image
                src={project.images[0]}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {project.title}
            </h3>
            <p className="text-gray-600">{project.description}</p>
          
            {/* Conditionally render the link */}
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
              >
                Link to Github
              </a>
            )}
          </div>
        
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-[1000] px-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl h-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="relative w-full max-w-4xl flex justify-center items-center">
              {/* Image Resized for Responsiveness */}
              <div className="relative w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
                <Image
                  src={selectedProject.images[currentIndex]}
                  alt={selectedProject.title}
                  width={900}
                  height={600}
                  style={{ objectFit: 'cover' }}  
                  className="rounded-lg object-cover w-full h-full"
                />

              </div>

              {/* Navigation Arrows (Visible on All Screens) */}
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

            {/* Close Button (Positioned Outside the Slider) */}
            <button
              className="absolute top-4 right-4 text-white text-3xl p-3 bg-gray-900 rounded-full hover:bg-gray-800 transition z-[1100]"
              onClick={closeModal}
            >
              ✕
            </button>

          {/* Project Info */}
          <div className="bg-white text-black w-full max-w-4xl p-6 text-center rounded-b-lg mt-4">
            <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
            <p className="text-lg">{selectedProject.description}</p>

            {/* Conditionally render the GitHub link */}
            {selectedProject.link && selectedProject.link !== "#" && (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
              >
                Link to Github
              </a>
            )}
          </div>
          </div>
        </div>
      )}
    </section>
  );
}
