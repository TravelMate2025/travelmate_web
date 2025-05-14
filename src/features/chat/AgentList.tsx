import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';

interface CircleAvatarProps {
  text: string;
  size?: number;
}

interface Agent {
  id: number;
  displayName: string;
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


const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAvailableAgents = async () => {
      try {
        const token = accessToken
        if (!token) {
          throw new Error("Access token not found");
        }

        const response = await fetch(`${API_BASE_URL}/chat/admins`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType?.includes("application/json")) {
          throw new Error("Invalid response from server");
        }

        const data = await response.json();
        const extractedAgents = data.results.map((agent: any) => ({
          id: agent.id,
          displayName:
            agent.first_name?.trim() || agent.email?.split("@")[0] || "A",
        }));

        setAgents(extractedAgents);
      } catch (err) {
        setError("Failed to fetch agents");
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableAgents();
  }, []);

  const displayedAgents = agents.slice(0, 3);

  return (
    <div className="flex justify-center my-4">
      <div className="flex items-center">
        {displayedAgents.map((agent, index) => (
          <div
            key={agent.id}
            className="relative"
            style={{
              marginLeft: index === 0 ? 0 : "-7%",
              zIndex: displayedAgents.length - index,
            }}
          >
            <CircleAvatar text={agent.displayName} />
          </div>
        ))}
      </div>
      {loading && <p className="ml-4">Loading...</p>}
    </div>
  );
};

export default AgentList;
