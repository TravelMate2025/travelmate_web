import React from "react";

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
  return (
    <div className="flex justify-center my-4">
      <div className="flex items-center">
        {dummyAgents.map((agent, index) => (
          <div
            key={agent.id}
            className="relative"
            style={{
              marginLeft: index === 0 ? 0 : "-7%",
              zIndex: dummyAgents.length - index,   // make sure leftmost is at the bottom
            }}
          >
            <CircleAvatar text={agent.firstName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;
