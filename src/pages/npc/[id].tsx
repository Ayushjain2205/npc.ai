import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Layout from "@/components/Layout";
import { db } from "@/lib/db";
import type { NPC } from "@/lib/types";
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

type NPCDetailProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function NPCDetail({
  npc,
  transactions,
  activities,
}: NPCDetailProps) {
  if (!npc) {
    return (
      <Layout>
        <div className="text-center p-10">Loading NPC data...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="nes-container is-dark with-title is-centered p-4 md:p-8 max-w-6xl mx-auto">
        <p className="title">{npc.name} - Profile</p>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-1/3">
            <img
              src={npc.profile_image_url || "/default-avatar.png"}
              alt={npc.name}
              className="w-full h-auto object-cover rounded border-4 border-black pixelated"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl mb-2">{npc.name}</h2>
            <p className="nes-text is-primary mb-4">{npc.background}</p>
            <div className="nes-container is-dark is-rounded mb-4">
              <h3 className="text-lg mb-2">Personality</h3>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <OnChainActivity transactions={transactions} />
        </div>

        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  let npcs: { id: string }[] = [];
  try {
    const { data, error } = await db.getNPCs();
    if (error) throw error;
    if (data) {
      npcs = data.map((npc) => ({ id: npc.id }));
    }
  } catch (error) {
    console.error("Error fetching NPC IDs for getStaticPaths:", error);
  }

  if (!npcs || npcs.length === 0) {
    console.warn(
      "No NPC IDs found for getStaticPaths. Rendering will likely rely on fallback."
    );
    return { paths: [], fallback: "blocking" };
  }

  const paths = npcs.map((npc: { id: string }) => ({
    params: { id: npc.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  {
    npc: NPC | null;
    transactions: Transaction[];
    activities: Activity[];
  },
  { id: string }
> = async (context) => {
  const id = context.params?.id;

  if (!id) {
    return { notFound: true };
  }

  let npcData: NPC | null = null;
  try {
    const { data, error } = await db.getNPCById(id);
    if (error) throw error;
    npcData = data;
  } catch (error) {
    console.error(`Error fetching NPC data for ID ${id}:`, error);
    return { notFound: true };
  }

  if (!npcData) {
    return { notFound: true };
  }

  const transactions: Transaction[] = [
    {
      id: "tx1",
      type: "receive",
      details: `Received funds for quest reward`,
      amount: 0.05,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "tx2",
      type: "mintNFT",
      details: `Minted 'Pixel Sword'`,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "tx3",
      type: "send",
      details: `Sent payment for potion`,
      amount: 0.01,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const activities: Activity[] = [
    {
      id: "act1",
      type: "interact",
      details: `Chatted with Player 'Hero123'`,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      impact: 20,
    },
    {
      id: "act2",
      type: "quest",
      details: `Completed 'Retrieve Lost Artifact'`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      impact: 80,
    },
    {
      id: "act3",
      type: "learn",
      details: `Learned 'Advanced Alchemy'`,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 50,
    },
  ];

  return {
    props: {
      npc: npcData,
      transactions,
      activities,
    },
    revalidate: 60,
  };
};
