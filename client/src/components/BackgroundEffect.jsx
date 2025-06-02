import { useCallback } from "react";
import Particles from "react-tsparticles"; 
import { loadSlim } from "tsparticles-slim"; // lighter alternative to loadFull

const BackgroundEffect = () => {
  const particlesInit = useCallback(async (engine) => {
    // Loads only the slim version (works for most use cases)
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full -z-10"
      options={{
        background: { color: { value: "#0f0f0f" } },
        particles: {
          color: { value: "#00ff00" },
          links: {
            enable: true,
            color: "#00ff00",
            distance: 150,
            opacity: 0.3,
            width: 1,
          },
          move: { enable: true, speed: 1 },
          number: { value: 60, density: { enable: true, area: 800 } },
          opacity: { value: 0.3 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export default BackgroundEffect;