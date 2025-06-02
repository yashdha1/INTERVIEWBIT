import { useNavigate } from "react-router-dom";
import BackgroundEffect from "../components/BackgroundEffect.jsx";
import { useSocket } from "../providers/Socket.jsx";

function Home() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  // bringing hte input field to the forefront 

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-4 transition-all duration-500">
      <BackgroundEffect />
      <div className="max-w-6xl w-full text-center">
        <h1 className="text-6xl font-extrabold text-white mb-6 transition-colors duration-300 hover:text-indigo-400">
          INTERVIEW <span className="text-indigo-500">BIT</span>
        </h1>
        <p className="text-base text-indigo-100 leading-snug mt-2 max-w-xl mx-auto transition-all duration-300">
          Welcome to your technical interview platform. This minimalist setup
          enables seamless real-time coding interviews between candidates and
          interviewers.
        </p>
        <p className="mt-4 text-gray-400">
          Ready to get started? Join a room below:
        </p>

        <div className="mt-8">
          <button
            className="bg-indigo-900 hover:bg-indigo-700 transition-colors text-white font-bold py-2 px-6 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/lobby")}
          >
            JOIN A ROOM
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;