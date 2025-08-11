import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Chat } from "../../types/chat";

const API_BASE_URL = 'https://travelmate-backend-0suw.onrender.com/api';

interface CircleAvatarProps {
  text: string;
  size?: number;
}

interface Agent {
  id: number;
  displayName: string;
}

interface AgentListProps {
  activeChat: Chat | null;
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

const AgentList: React.FC<AgentListProps> = ({ activeChat }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchAvailableAgents = async () => {
      try {
        if (!accessToken) throw new Error("Access token not found");

        const response = await fetch(`${API_BASE_URL}/chat/admins`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType?.includes("application/json")) {
          throw new Error("Invalid response from server");
        }

        const data = await response.json();
        console.log("agents list:", data)
        const extractedAgents = data.results.map((agent: any) => ({
          id: agent.id,
          displayName: agent.first_name?.trim() || agent.email?.split("@")[0] || "A",
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
  }, [accessToken]);


  let displayedAgents: Agent[] = [];

const adminMessage = activeChat?.messages?.find(msg => msg.sender !== "user");

if (adminMessage && activeChat?.assigned_admin_info) {
  const sender = activeChat.assigned_admin_info;

    sender.first_name?.trim() ||
    sender.email?.split("@")[0] ||
    "Admin";

  const adminInitial =
    sender.first_name?.charAt(0).toUpperCase() ||
    sender.email?.charAt(0).toUpperCase() ||
    "A";

  displayedAgents = [
    {
      id: sender.id || 1,
      displayName: adminInitial,
    },
  ];
} else {
  // Admin hasn't responded — show fallback avatars
  displayedAgents = agents.slice(0, 3);
}

  

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
