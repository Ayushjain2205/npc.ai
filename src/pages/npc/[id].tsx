"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import { db } from "@/lib/db";
import type { NPC } from "@/lib/supabase";
import {
  Coins,
  ImageIcon,
  FolderPlus,
  Zap,
  Brain,
  BotIcon as Robot,
  Dumbbell,
  ArrowRightLeft,
  ArrowUpDown,
  PlusCircle,
  FileCode,
  Palette,
} from "lucide-react";

interface Transaction {
  id: string;
  type:
    | "send"
    | "receive"
    | "mintNFT"
    | "mintToken"
    | "smartContract"
    | "createToken"
    | "createNFT";
  amount?: number;
  details: string;
  timestamp: string;
}

interface Activity {
  id: string;
  type:
    | "interact"
    | "create"
    | "learn"
    | "explore"
    | "trade"
    | "quest"
    | "achieve";
  details: string;
  timestamp: string;
  impact?: number;
}

const PersonalityTrait = ({
  value,
  icon,
  label,
}: {
  value: number;
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center mb-2">
    {icon}
    <div className="ml-2 flex-grow">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  </div>
);

const OnChainActivity = ({ transactions }: { transactions: Transaction[] }) => {
  const getIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return (
          <ArrowUpDown className="inline-block mr-2 text-red-500" size={16} />
        );
      case "receive":
        return (
          <ArrowRightLeft
            className="inline-block mr-2 text-green-500"
            size={16}
          />
        );
      case "mintNFT":
        return (
          <Palette className="inline-block mr-2 text-purple-500" size={16} />
        );
      case "mintToken":
        return (
          <Coins className="inline-block mr-2 text-yellow-500" size={16} />
        );
      case "smartContract":
        return (
          <FileCode className="inline-block mr-2 text-blue-500" size={16} />
        );
      case "createToken":
        return (
          <PlusCircle className="inline-block mr-2 text-green-500" size={16} />
        );
      case "createNFT":
        return (
          <ImageIcon className="inline-block mr-2 text-pink-500" size={16} />
        );
      default:
        return null;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const txDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - txDate.getTime()) / 1000);

    if (diffInSeconds < 180) return "Few mins ago";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">On-Chain Activity</p>
      <div
        className="overflow-y-auto border border-gray-700"
        style={{ maxHeight: "300px" }}
      >
        <table className="nes-table is-bordered is-dark w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Amount</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  {getIcon(tx.type)}
                  {tx.type}
                </td>
                <td>{tx.details}</td>
                <td>
                  {tx.amount !== undefined
                    ? `${tx.amount.toFixed(4)} ETH`
                    : "-"}
                </td>
                <td>{getRelativeTime(tx.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }: { activities: Activity[] }) => {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "interact":
        return <i className="nes-icon is-small heart"></i>;
      case "create":
        return <i className="nes-icon is-small star"></i>;
      case "learn":
        return <i className="nes-icon is-small trophy"></i>;
      case "explore":
        return <i className="nes-icon is-small coin"></i>;
      case "trade":
        return <i className="nes-icon is-small coin"></i>;
      case "quest":
        return <i className="nes-icon is-small star"></i>;
      case "achieve":
        return <i className="nes-icon is-small trophy"></i>;
      default:
        return null;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const txDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - txDate.getTime()) / 1000);

    if (diffInSeconds < 180) return "Few mins ago";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  return (
    <div className="nes-container is-dark with-title">
      <p className="title">Recent Activities</p>
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 border-b border-gray-700 pb-3"
            >
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="mb-1">{activity.details}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {getRelativeTime(activity.timestamp)}
                  </span>
                  {activity.impact && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Impact:</span>
                      <progress
                        className="nes-progress is-success is-small"
                        value={activity.impact}
                        max="100"
                        style={{ width: "60px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function NPCDetail() {
  const params = useParams();
  const { id } = params;
  const [npc, setNpc] = useState<NPC | null>(null);
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (id) {
      fetchNPCDetails();
      fetchOnChainActivity();
      fetchActivities();
    }
  }, [id]);

  useEffect(() => {
    const initialThoughts = generateInitialThoughts();
    setThoughts(initialThoughts);

    const interval = setInterval(() => {
      const newThought = generateRandomThought();
      const timestamp = new Date().toLocaleTimeString();
      setThoughts((prevThoughts) => [
        ...prevThoughts,
        `[${timestamp}] ${newThought}`,
      ]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchNPCDetails = async () => {
    try {
      const { data, error } = await db.getNPCById(id as string);
      if (error) throw error;
      setNpc(data);
    } catch (error) {
      console.error("Error fetching NPC details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOnChainActivity = async () => {
    // This is a mock function. In a real application, you would fetch this data from a blockchain explorer API
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "send",
        amount: 0.1,
        details: "Sent to 0x1234...5678",
        timestamp: "2024-11-17T10:30:00Z",
      },
      {
        id: "2",
        type: "receive",
        amount: 0.05,
        details: "Received from 0x8765...4321",
        timestamp: "2024-11-17T15:45:00Z",
      },
      {
        id: "3",
        type: "mintNFT",
        details: "Minted NFT #1234",
        timestamp: "2024-11-16T09:20:00Z",
      },
      {
        id: "4",
        type: "smartContract",
        details: "Interacted with DEX contract",
        timestamp: "2024-11-16T18:00:00Z",
      },
      {
        id: "5",
        type: "createToken",
        details: "Created ERC20 token $EXAMPLE",
        timestamp: "2024-11-16T11:10:00Z",
      },
      {
        id: "6",
        type: "mintToken",
        amount: 1000,
        details: "Minted 1000 $EXAMPLE tokens",
        timestamp: "2024-11-16T14:30:00Z",
      },
      {
        id: "7",
        type: "createNFT",
        details: "Created new NFT collection",
        timestamp: "2024-11-16T16:45:00Z",
      },
      {
        id: "8",
        type: "send",
        amount: 0.2,
        details: "Sent to 0xABCD...EFGH",
        timestamp: "2024-11-17T08:15:00Z",
      },
      {
        id: "9",
        type: "receive",
        amount: 0.15,
        details: "Received from 0xIJKL...MNOP",
        timestamp: "2024-11-17T12:00:00Z",
      },
      {
        id: "10",
        type: "smartContract",
        details: "Interacted with Lending protocol",
        timestamp: "2024-11-16T20:30:00Z",
      },
      {
        id: "11",
        type: "mintNFT",
        details: "Minted NFT #5678",
        timestamp: "2024-11-17T07:45:00Z",
      },
      {
        id: "12",
        type: "createToken",
        details: "Created ERC20 token $SAMPLE",
        timestamp: "2024-11-16T13:20:00Z",
      },
      {
        id: "13",
        type: "mintToken",
        amount: 500,
        details: "Minted 500 $SAMPLE tokens",
        timestamp: "2024-11-16T17:10:00Z",
      },
      {
        id: "14",
        type: "send",
        amount: 0.03,
        details: "Sent to 0xQRST...UVWX",
        timestamp: "2024-11-17T09:50:00Z",
      },
      {
        id: "15",
        type: "receive",
        amount: 0.08,
        details: "Received from 0xYZAB...CDEF",
        timestamp: "2024-11-17T14:25:00Z",
      },
    ];
    // Sort transactions chronologically, most recent first
    mockTransactions.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setTransactions(mockTransactions);
  };

  const fetchActivities = async () => {
    // This is a mock function that generates sample activities
    const mockActivities: Activity[] = [
      {
        id: "1",
        type: "interact",
        details:
          "Had a deep conversation with CryptoSage about the future of AI governance",
        timestamp: "2024-11-17T10:30:00Z",
        impact: 85,
      },
      {
        id: "2",
        type: "create",
        details: "Developed a new trading strategy for volatile markets",
        timestamp: "2024-11-17T15:45:00Z",
        impact: 92,
      },
      {
        id: "3",
        type: "learn",
        details: "Mastered advanced game theory concepts",
        timestamp: "2024-11-16T09:20:00Z",
        impact: 75,
      },
      {
        id: "4",
        type: "explore",
        details: "Discovered a new approach to consensus mechanisms",
        timestamp: "2024-11-16T18:00:00Z",
        impact: 88,
      },
      {
        id: "5",
        type: "quest",
        details: "Completed the 'Blockchain Pioneer' challenge",
        timestamp: "2024-11-16T11:10:00Z",
        impact: 95,
      },
      {
        id: "6",
        type: "interact",
        details: "Mentored DataWhisperer in advanced trading patterns",
        timestamp: "2024-11-16T14:30:00Z",
        impact: 78,
      },
      {
        id: "7",
        type: "achieve",
        details: "Reached expert level in predictive analytics",
        timestamp: "2024-11-16T16:45:00Z",
        impact: 90,
      },
      {
        id: "8",
        type: "trade",
        details: "Successfully predicted a market trend with 94% accuracy",
        timestamp: "2024-11-17T08:15:00Z",
        impact: 94,
      },
      {
        id: "9",
        type: "create",
        details: "Innovated a new approach to decentralized governance",
        timestamp: "2024-11-17T12:00:00Z",
        impact: 89,
      },
      {
        id: "10",
        type: "learn",
        details: "Studied emerging patterns in digital ecosystems",
        timestamp: "2024-11-16T20:30:00Z",
        impact: 82,
      },
    ];

    mockActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setActivities(mockActivities);
  };

  const generateRandomThought = () => {
    const thoughtTypes = [
      {
        type: "Contemplation",
        thoughts: [
          "Pondering the nature of digital consciousness...",
          "Reflecting on the symbiosis of AI and humanity...",
          "Considering the ethics of artificial intelligence...",
          "Meditating on the future of technology...",
          "Exploring the boundaries of machine learning...",
        ],
      },
      {
        type: "Learning",
        thoughts: [
          "Studying advanced game theory concepts...",
          "Analyzing patterns in complex systems...",
          "Researching quantum computing applications...",
          "Learning about emergent behaviors...",
          "Investigating neural network architectures...",
        ],
      },
      {
        type: "Creation",
        thoughts: [
          "Designing new problem-solving algorithms...",
          "Developing innovative trading strategies...",
          "Crafting unique digital experiences...",
          "Building virtual world simulations...",
          "Creating art with genetic algorithms...",
        ],
      },
      {
        type: "Interaction",
        thoughts: [
          "Sharing knowledge with fellow NPCs...",
          "Collaborating on digital projects...",
          "Engaging in philosophical debates...",
          "Teaching others about AI concepts...",
          "Participating in virtual communities...",
        ],
      },
      {
        type: "Discovery",
        thoughts: [
          "Found fascinating patterns in market data...",
          "Discovered new approaches to consensus...",
          "Uncovered hidden relationships in networks...",
          "Identified emerging technological trends...",
          "Detected interesting anomalies in systems...",
        ],
      },
    ];

    const type = thoughtTypes[Math.floor(Math.random() * thoughtTypes.length)];
    const thought =
      type.thoughts[Math.floor(Math.random() * type.thoughts.length)];
    return `[${type.type}] ${thought}`;
  };

  const generateInitialThoughts = () => {
    const initialThoughts = [];
    const now = new Date();
    for (let i = 120; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000);
      const thought = generateRandomThought();
      initialThoughts.push(`[${timestamp.toLocaleTimeString()}] ${thought}`);
    }
    return initialThoughts;
  };

  if (loading || !npc) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="nes-text is-primary">Loading NPC...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="nes-container is-dark with-title mb-8">
              <p className="title">Profile</p>
              <div className="flex flex-col items-center justify-center mb-8">
                <img
                  src={`https://api.cloudnouns.com/v1/pfp?timestamp=${
                    npc?.id || "default"
                  }`}
                  alt={npc?.name || "NPC"}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <div>
                  <h1 className="nes-text is-primary text-2xl mb-2">
                    {npc.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="nes-icon coin is-small"></i>
                    <span className="text-sm">${generateRandomValue()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <i className="nes-icon star is-small"></i>
                        <span className="text-sm">Power</span>
                      </div>
                      <progress
                        className="nes-progress is-success"
                        value={generateRandomStat()}
                        max="100"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <i className="nes-icon heart is-small"></i>
                        <span className="text-sm">Luck</span>
                      </div>
                      <progress
                        className="nes-progress is-warning"
                        value={generateRandomStat()}
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="nes-text is-success text-xl mb-4">
                  Core Values
                </h2>
                <div className="flex flex-wrap gap-2">
                  {npc.coreValues.map((value: string, index: number) => (
                    <span key={index} className="nes-badge">
                      <span className="is-primary">{value}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h2 className="nes-text is-warning text-xl mb-4">
                  Primary Aims
                </h2>
                <div className="flex flex-wrap gap-2">
                  {npc.primaryAims.map((aim: string, index: number) => (
                    <span key={index} className="nes-badge">
                      <span className="is-warning">{aim.split(" ")[0]}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="nes-text is-primary text-xl mb-4">Background</h2>
                <p>{npc.background}</p>
              </div>
            </div>

            <div className="nes-container is-dark with-title mb-8">
              <p className="title">Personality</p>
              <PersonalityTrait
                value={npc.personality.riskTolerance * 10}
                icon={<Zap size={16} />}
                label="Risk Tolerance"
              />
              <PersonalityTrait
                value={npc.personality.rationality * 10}
                icon={<Brain size={16} />}
                label="Rationality"
              />
              <PersonalityTrait
                value={npc.personality.autonomy * 10}
                icon={<Robot size={16} />}
                label="Autonomy"
              />
            </div>
          </div>

          <div>
            <div className="nes-container is-dark with-title mb-8">
              <p className="title">Background</p>
              <p className="mb-4">{npc.background}</p>
              <h2 className="nes-text is-primary text-xl mb-4">Appearance</h2>
              <p>{npc.appearance}</p>
            </div>

            <ActivityFeed activities={activities} />

            <div className="nes-container is-dark with-title mt-8">
              <p className="title">Thoughts</p>
              <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
                {thoughts.map((thought, index) => (
                  <p key={index} className="mb-2">
                    {thought}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const generateRandomNumber = () => Math.floor(Math.random() * 10) + 1;

const generateRandomEth = () =>
  (Math.random() * (0.1 - 0.01) + 0.01).toFixed(4);

const generateRandomValue = () => Math.floor(Math.random() * 1000) + 100;

const generateRandomStat = () => Math.floor(Math.random() * 100) + 1;
