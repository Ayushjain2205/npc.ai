"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { db } from "@/lib/db";
import type { NPC } from "@/lib/supabase";
import Link from "next/link";

const NPCCard = ({ npc }: { npc: NPC }) => {
  const truncateName = (name: string, maxLength: number) => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength - 3) + "..."
      : name;
  };

  const generateRandomValue = () => {
    return (Math.random() * (10000 - 100) + 100).toFixed(2);
  };

  const generateRandomStat = () => {
    return Math.floor(Math.random() * 100);
  };

  const value = generateRandomValue();
  const power = generateRandomStat();
  const luck = generateRandomStat();

  return (
    <div className="nes-container is-rounded hover:shadow-lg transition-shadow duration-300 relative">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={`https://api.cloudnouns.com/v1/pfp?timestamp=${npc.id}`}
          alt={npc.name}
          className="w-16 h-16 rounded-full flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="nes-text is-primary truncate">
            {truncateName(npc.name, 12)}
          </h3>
          <div className="flex items-center gap-2">
            <i className="nes-icon coin is-small"></i>
            <span className="text-sm">${value}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1">
            <i className="nes-icon star is-small"></i>
            <span className="text-sm">Power</span>
          </div>
          <progress
            className="nes-progress is-success"
            value={power}
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
            value={luck}
            max="100"
          />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="nes-text is-success mb-2">Core Values</h4>
        <div className="flex flex-wrap gap-2">
          {npc.coreValues.slice(0, 3).map((value: string, index: number) => (
            <span key={index} className="nes-badge">
              <span className="is-primary">{value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="nes-text is-warning mb-2">Primary Aims</h4>
        <div className="flex flex-wrap gap-2">
          {npc.primaryAims.slice(0, 3).map((aim: string, index: number) => (
            <span key={index} className="nes-badge">
              <span className="is-warning">{aim}</span>
            </span>
          ))}
        </div>
      </div>

      <Link
        href={`/npc/${npc.id}`}
        className="nes-btn is-primary w-full opacity-0 hover:opacity-100 transition-opacity duration-300 absolute inset-0 flex items-center justify-center"
      >
        View Details
      </Link>
    </div>
  );
};

const AllNPCs = () => {
  const [npcs, setNpcs] = useState<NPC[]>([]);
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
          All NPCs
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {npcs.map((npc) => (
            <NPCCard key={npc.id} npc={npc} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AllNPCs;
