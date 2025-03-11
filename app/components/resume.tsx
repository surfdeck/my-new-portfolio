import React from 'react';
import WorkExperience from './work-experience';

const Resume = () => {
  return (
    <section id="resume" className="p-8 ">

    <div className="relative bg-black text-white">
      {/* Background Gradient */}
 
      {/* Resume Content Wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            My Resume
          </h2>
       
        </div>

        {/* Experience Section */}
        <WorkExperience />

            {/* Skills Section */}
        <div className="mb-16 mt-10">
        <h3 className="text-3xl font-semibold text-white mb-6">Core Skills</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            JavaScript
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Python
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            React
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Flask
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            C++
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Next.js
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            TypeScript
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            TailwindCSS
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            MongoDB
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            APIs
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Blender
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Three.js
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Vercel
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Google AdWords
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            SEO/SEM
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Shopify
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Adobe Creative Suite
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Graphic Design
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            People Skills
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Soft Skills
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            WordPress
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Mailchimp
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Backend Development
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Frontend Development
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            cPanel
          </span>
          <span className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold">
            Server Setup
          </span>

        </div>
      </div>

      
      </div>
    </div>
    </section>
  );
};

export default Resume;
