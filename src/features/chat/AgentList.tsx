import React, { useEffect, useState } from "react";

// CircleAvatar Component
interface CircleAvatarProps {
  text: string;
  size?: number;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ text, size = 40 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#023E8A",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: size / 2,
        zIndex: 1,
        border: "2px solid white",
        boxSizing: "border-box",
      }}
    >
      {text.charAt(0).toUpperCase()}
    </div>
  );
};

// Dummy agents
const dummyAgents = [
  { id: 1, firstName: "Elvis" },
  { id: 2, firstName: "Sarah" },
  { id: 3, firstName: "Michael" },
];

// AgentList Component
const AgentList: React.FC = () => {
  const [agents,] = useState<any[]>([]); // State for storing agents
  const [loading, setLoading] = useState<boolean>(true);
  const [ ,setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available agents from the backend
    const fetchAvailableAgents = async () => {
      try {
        // const response = await fetch("/api/agents"); // Replace with actual API endpoint
        // const data = await response.json();
        // setAgents(data); // Assume the response contains an array of available agents
      } catch (err) {
        setError("Failed to fetch agents");
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableAgents();
  }, []);

  // If no agents are available from the backend, fall back to dummy agents
  const displayedAgents = agents.length > 0 ? agents : dummyAgents;

  return (
    <div className="flex justify-center my-4">
      <div className="flex items-center">
        {displayedAgents.map((agent, index) => (
          <div
            key={agent.id}
            className="relative"
            style={{
              marginLeft: index === 0 ? 0 : "-7%",
              zIndex: displayedAgents.length - index, // make sure leftmost is at the bottom
            }}
          >
            <CircleAvatar text={agent.firstName} />
          </div>
        ))}
      </div>
      {loading && <p>Loading agents...</p>}
      {/* {error && <p className="text-red-500">{error}</p>} */}
    </div>
  );
};

export default AgentList;
