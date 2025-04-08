'use client';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";

// Define the Project type
type Project = {
  title: string;
  description: string;
  images: string[];
  link: string;
};

const projectsData: Project[] = [
  {
    title: "Sample_mflix MongoDB Movies",
    description:
      "A movie browsing application that fetches movie data from a MongoDB database using a Flask/Python API. Users can search for movies, view detailed movie information, including cast, ratings, and awards.",
    images: ["/project-movies/2.png", "/project-movies/3.png"],
    link: "https://github.com/surfdeck/nextjs-flask-sample-mflix-mongodb.git",
  },
  {
    title: "MongoDB Meal Panner",
    description:
      "I built this menu by fetching recipes from the MealDB API, storing them in MongoDB, and dynamically displaying them on the screen using Flask/Python API calls—all hosted on Vercel.",
    images: ["/project-meal/1.png", "/project-meal/2.png"],
    link: "https://github.com/surfdeck/meal-planner",
  },
  {
    title: "Brewery Management System",
    description:
      "Brewery Quest is an interactive web application built with Next.js on the frontend and Flask on the backend, designed for craft beer enthusiasts to discover local breweries.",
    images: ["/project-brew/1.png", "/project-brew/3.png"],
    link: "https://github.com/surfdeck/nextjs-flask-brewery-shop",
  },
  {
    title: "3D Fractal Model Generator",
    description:
      "A fractal model generator built with Next.js, Flask/Python, and Three.js, featuring pre-loaded designs created from ChatGPT",
    images: ["/project1/1.png", "/project1/4.png"],
    link: "https://github.com/surfdeck/nextjs-flask-fractal-creator",
  },
  {
    title: "3D Data Visualization with Polygon.io API",
    description:
      "A visualization tool using Polygon.io API to showcase relationships between common stocks, built with Three.js, Next.js, and Flask.",
    images: ["/project2/1.png", "/project2/2.png"],
    link: "https://github.com/surfdeck/nextjs-flask-apidata-threejs",
  },
  {
    title: "3D Satellite Visualization Tool",
    description:
      "An interactive app displaying satellite trajectories relative to Earth, powered by NASA's SSC Web Services API.",
    images: ["/project3/1.png", "/project3/2.png"],
    link: "https://github.com/surfdeck/nextjs-flask-nasa-sat-loc",
  },
  {
    title: "Financial News Sentiment Analyzer",
    description:
      "A Next.js and Flask app utilizing Polygon.io's Ticker News API to analyze financial news sentiment.",
    images: ["/project4/1.png", "/project4/6.png"],
    link: "https://github.com/surfdeck/nextjs-flask-stock-ticker-news",
  },
  {
    title: "Dynamic Portfolio Tracker",
    description:
      "A comprehensive investment tool tracking stock trends, sentiment insights, and financial data, including performance and dividends.",
    images: ["/project5/1.png", "/project5/2.png"],
    link: "https://github.com/surfdeck/nextjs-flask-finance-app",
  },
  {
    title: "National Parks Explorer",
    description:
      "A full-stack demo website built with Next.js and Flask, showcasing National Park Service API data, interactive maps, a booking system, an online shop, and a contact form.",
    images: ["/project6/1.png", "/project6/2.png"],
    link: "https://github.com/surfdeck/national-parks-website-demo",
  },
  {
    title: "Custom Web Solutions & Branding",
    description:
      "Developed and managed websites, branding, and marketing solutions for various companies providing me experience with a diverse client base. Full website development, e-commerce platforms, digital marketing strategies, graphic design and business development",
    images: [
      "/project7/9.png",
      "/project7/5.png",
      "/project7/8.png",
    ],
    link: "#",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          (prev - 1 + selectedProject.images.length) % selectedProject.images.length
      );
    }
  };

  // Close modal on ESC and arrow key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

 

  return (
    <section id="projects" className="relative bg-white p-8 text-black overflow-hidden mt-28">
      {/* Starfield Background */}
      {/* <canvas ref={canvasRef} className="absolute bg-white text-black inset-0 object-cover -z-10" /> */}

      <div className="max-w-4xl mx-auto text-center text-white p-4 mt-12">
        <h2 className="text-4xl font-bold mb-8">My Projects</h2>
        <p className="text-xl mb-12">
          Explore a curated selection of my most innovative projects—software apps I've built to showcase my range of coding skills and mastered tools.
        </p>
        </div>

        <div className="max-w-7xl mx-auto text-center p-4 mt-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div
              key={index}
              className="hover:bg-indigo-300/75 bg-white shadow border-4 hover:border-6 text-black/25 hover:text-black p-6 rounded-lg transition duration-900 cursor-pointer"
              onClick={() => openModal(project)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-full h-48 relative mb-4">
                <Image
                  src={
                    hoveredIndex === index && project.images.length > 1
                      ? project.images[1]
                      : project.images[0]
                  }
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg transition-opacity duration-500"
                />
              </div>
              <h3 className="text-2xl font-semibold text-black hover:animate-pulse hover:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-black hover:text-black">{project.description}</p>
              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-800 hover:text-white mt-4 inline-block"
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
    className="fixed inset-0 flex items-center justify-center bg-black/95 z-[1000] px-4"
    onClick={closeModal}
  >
    <div
      className="relative w-full max-w-5xl flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button - stays fixed */}
      <button
        className="absolute top-6 right-6 text-white text-3xl p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition z-[1100]"
        onClick={closeModal}
      >
        ✕
      </button>

      {/* Image Area */}
      <div className="relative w-full max-w-4xl flex justify-center items-center">
        <div className="relative w-full aspect-[3/2] max-w-[90%] md:max-w-[80%] lg:max-w-[70%] bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={selectedProject.images[currentIndex]}
            alt={selectedProject.title}
            fill
            style={{ objectFit: "contain" }}
            className="rounded-lg"
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

      {/* Info Card */}
      <div className="bg-white text-black w-full max-w-4xl p-6 text-center rounded-b-lg mt-4">
        <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
        <p className="text-lg">{selectedProject.description}</p>
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
