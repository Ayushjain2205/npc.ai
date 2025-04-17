"use client";

import { useState, useEffect, useMemo } from "react";
import Layout from "@/components/Layout";
import {
  Dna,
  Coins,
  ImageIcon,
  FolderPlus,
  Zap,
  Brain,
  BotIcon as Robot,
  Dumbbell,
} from "lucide-react";
import Confetti from "react-confetti";
import { db } from "@/lib/db";
import type { NPC } from "@/lib/supabase";

const generateRandomNumber = () => Math.floor(Math.random() * 10) + 1;
const generateRandomEth = () =>
  (Math.random() * (0.1 - 0.01) + 0.01).toFixed(4);
const generateRandomValue = () =>
  (Math.random() * (10000 - 100) + 100).toFixed(2);
const generateRandomStat = () => Math.floor(Math.random() * 100);

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

const NPCDisplay = ({ npc }: { npc: NPC }) => {
  const stats = useMemo(
    () => ({
      value: generateRandomValue(),
      power: generateRandomStat(),
      luck: generateRandomStat(),
    }),
    [npc.id]
  );

  return (
    <div className="nes-container with-title is-dark">
      <p className="title">{npc.name}</p>
      <div className="flex justify-center mb-4">
        <img
          src={`https://api.cloudnouns.com/v1/pfp?timestamp=${
            npc.id || "default"
          }`}
          alt={`${npc.name} avatar`}
          width="100"
          height="100"
          className="nes-avatar is-large is-rounded"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <i className="nes-icon coin is-small mr-2"></i>
          <span>${stats.value}</span>
        </div>
        <div className="flex items-center">
          <i className="nes-icon star is-small mr-2"></i>
          <span>Power: {stats.power}</span>
        </div>
        <div className="flex items-center">
          <i className="nes-icon heart is-small mr-2"></i>
          <span>Luck: {stats.luck}</span>
        </div>
        <div className="flex items-center">
          <Zap className="mr-2" size={16} />
          <span>{npc.coreValues.length} Values</span>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="nes-text is-primary mb-2">Personality</h3>
        <PersonalityTrait
          value={npc.personality.riskTolerance * 10}
          icon={<Dumbbell size={16} />}
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
      <div className="mb-4">
        <h3 className="nes-text is-success mb-2">Core Values</h3>
        <div className="flex flex-wrap gap-2">
          {npc.coreValues.map((value, index) => (
            <span key={index} className="nes-badge">
              <span className="is-primary">{value}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="nes-text is-warning mb-2">Primary Aims</h3>
        <div className="flex flex-wrap gap-2">
          {npc.primaryAims.map((aim, index) => (
            <span key={index} className="nes-badge">
              <span className="is-warning">{aim}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="nes-text is-primary mb-2">Background</h3>
        <p className="text-sm">{npc.background}</p>
      </div>
      <div className="mb-4">
        <h3 className="nes-text is-primary mb-2">Appearance</h3>
        <p className="text-sm">{npc.appearance}</p>
      </div>
    </div>
  );
};

const NPCCard = ({
  npc,
  onClick,
  isSelected,
}: {
  npc: NPC;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const stats = useMemo(
    () => ({
      value: generateRandomValue(),
      power: generateRandomStat(),
      luck: generateRandomStat(),
    }),
    [npc.id]
  );

  const truncateName = (name: string, maxLength: number) => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength - 3) + "..."
      : name;
  };

  return (
    <div
      className={`nes-container is-rounded ${
        isSelected ? "is-primary" : ""
      } cursor-pointer transition-all duration-300 transform ${
        isSelected ? "scale-105" : "hover:scale-105"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <img
          src={`https://api.cloudnouns.com/v1/pfp?timestamp=${
            npc.id || "default"
          }`}
          alt={npc.name}
          className="w-16 h-16 rounded-full flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3
            className={`nes-text ${
              isSelected ? "is-success" : "is-primary"
            } truncate`}
          >
            {truncateName(npc.name, 12)}
          </h3>
          <div className="flex items-center gap-2">
            <i className="nes-icon coin is-small"></i>
            <span className="text-sm">${stats.value}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <div className="flex items-center gap-1">
            <i className="nes-icon star is-small"></i>
            <span className="text-sm">Power</span>
          </div>
          <progress
            className="nes-progress is-success"
            value={stats.power}
            max="100"
          />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <i className="nes-icon heart is-small"></i>
            <span className="text-sm">Luck</span>
          </div>
          <progress
            className="nes-progress is-warning"
            value={stats.luck}
            max="100"
          />
        </div>
      </div>
    </div>
  );
};

export default function NPCBreeder() {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [selectedNPCs, setSelectedNPCs] = useState<NPC[]>([]);
  const [hybridNPC, setHybridNPC] = useState<NPC | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBreeding, setIsBreeding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNPCs();
  }, []);

  const fetchNPCs = async () => {
    try {
      const { data, error } = await db.getNPCs();
      if (error) throw error;
      setNpcs(data || []);
    } catch (error) {
      console.error("Error fetching NPCs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNPCSelect = (npc: NPC) => {
    setSelectedNPCs((prev) => {
      if (prev.find((p) => p.id === npc.id)) {
        return prev.filter((p) => p.id !== npc.id);
      }
      if (prev.length < 2) {
        return [...prev, npc];
      }
      return [prev[1], npc];
    });
  };

  const breedNPCs = async () => {
    if (selectedNPCs.length !== 2) return;

    setIsBreeding(true);
    setTimeout(async () => {
      const [npc1, npc2] = selectedNPCs;
      const newNPC: Omit<NPC, "id" | "created_at"> = {
        name: `hybrid-${Date.now().toString().slice(-4)}`,
        background: `A unique blend of ${npc1.name} and ${npc2.name}'s experiences...`,
        appearance: `A fascinating combination of ${npc1.name} and ${npc2.name}'s features...`,
        personality: {
          riskTolerance:
            (npc1.personality.riskTolerance + npc2.personality.riskTolerance) /
            2,
          rationality:
            (npc1.personality.rationality + npc2.personality.rationality) / 2,
          autonomy: (npc1.personality.autonomy + npc2.personality.autonomy) / 2,
        },
        coreValues: Array.from(
          new Set([...npc1.coreValues, ...npc2.coreValues])
        ).slice(0, 3),
        primaryAims: Array.from(
          new Set([...npc1.primaryAims, ...npc2.primaryAims])
        )
          .map((aim) => aim.split(" ")[0]) // Take only the first word
          .slice(0, 3),
      };

      const { data, error } = await db.createNPC(newNPC);
      if (error) throw error;

      setHybridNPC(data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setIsBreeding(false);
      fetchNPCs(); // Refresh the list
    }, 2000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="nes-text is-primary">Loading NPCs...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="nes-text is-primary text-center text-4xl mb-8">
          NPC Breeder
        </h1>

        {selectedNPCs.length === 2 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {selectedNPCs.map((npc) => (
                <NPCDisplay key={npc.id} npc={npc} />
              ))}
            </div>

            <div className="flex justify-center mb-8">
              <button
                className={`nes-btn is-primary ${
                  isBreeding ? "is-disabled" : ""
                }`}
                onClick={breedNPCs}
                disabled={isBreeding}
              >
                <Dna className="inline-block mr-2" />
                {isBreeding ? "Breeding..." : "Breed NPCs"}
              </button>
            </div>

            {isBreeding && (
              <div className="nes-container is-rounded is-dark mb-8">
                <div className="flex items-center justify-center">
                  <Dna className="animate-spin mr-2" />
                  <span>Creating hybrid NPC...</span>
                </div>
              </div>
            )}

            {hybridNPC && (
              <div className="nes-container is-rounded is-dark with-title">
                <p className="title">Hybrid NPC</p>
                <NPCDisplay npc={hybridNPC} />
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {npcs.map((npc) => (
              <NPCCard
                key={npc.id}
                npc={npc}
                onClick={() => handleNPCSelect(npc)}
                isSelected={selectedNPCs.some((p) => p.id === npc.id)}
              />
            ))}
          </div>
        )}

        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.1}
          />
        )}
      </div>
    </Layout>
  );
}
