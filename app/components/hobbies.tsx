// app/components/hobbies.js
export default function Hobbies() {
    const hobbies = [
      { name: "Sky Watching", icon: "🌌" },
      { name: "Meditation", icon: "🧘‍♂️" },
      { name: "Working Out", icon: "🏋️‍♂️" },
      { name: "Hiking", icon: "🥾" },
      { name: "Running", icon: "🏃‍♂️" },
      { name: "Creating", icon: "🎨" },
      { name: "Dancing", icon: "💃" },
      { name: "Reading", icon: "📚" },
      { name: "Cooking", icon: "🍳" },
    ];
  
    return (
      <section id="hobbies" className="p-8 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Hobbies & Interests</h2>
          <p className="text-xl mb-8">What fuels my creativity and keeps me balanced.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hobbies.map((hobby, index) => (
              <div key={index} className="bg-black hover:bg-blue-500 bg-opacity-20 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                <div className="text-6xl mb-4">{hobby.icon}</div>
                <h3 className="text-2xl font-semibold">{hobby.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  