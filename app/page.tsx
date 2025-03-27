
import Hero3D from 'app/components/hero3d'; // Our epic Hero3D component
import ThankYou from 'app/components/thank-you';
import Projects from 'app/components/projects';
import AboutMe from 'app/components/about';
import Skills from 'app/components/skills';

export default function Page() {
  return (
    <div className="relative scroll-smooth">
      {/* Epic 3D Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Hero3D />
      </div>

      {/* Content Wrapper with Extra Spacing */}
      <div className="relative z-10 flex flex-col gap-y-12">
        {/* Hero Section */}
        <section className="h-screen text-black flex flex-col justify-center items-center text-center text-white px-4">
          <h2 className="text-4xl  p-4 text-white md:text-6xl font-bold mb-4">
            Welcome to My Digital Space
          </h2>
          <p className="max-w-2xl font-bold   text-white mb-8 text-lg">
            A passionate developer, designer, and creative thinker showcasing my journey through code and art.
          </p>
          <a 
            href="#projects"
            className="px-6 py-3 animate-bounce bg-indigo-600bg-indigo-600/25 hover:bg-indigo-700/50 rounded-full transition"
          >
            Explore My Work
          </a>
        </section>

        <AboutMe />
      <div className="text-center  text-white text-4xl font-bold mt-4">
      Abilites
      </div>
        <Skills />
        <Projects />
        <ThankYou />
 
      </div>
    </div>
  );
}
