import { NPC } from "./supabase";

// Sample mock data
const mockNPCs: NPC[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    name: "Aria",
    background: "A skilled trader from the digital realms",
    appearance: "Holographic being with flowing data streams",
    personality: {
      riskTolerance: 7,
      rationality: 8,
      autonomy: 9,
    },
    coreValues: ["Innovation", "Freedom", "Knowledge"],
    primaryAims: ["Expand", "Play"],
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    name: "Nexus",
    background: "Cybersecurity expert and blockchain guardian",
    appearance: "Matrix-like code patterns forming a humanoid shape",
    personality: {
      riskTolerance: 4,
      rationality: 9,
      autonomy: 7,
    },
    coreValues: ["Security", "Trust", "Decentralization"],
    primaryAims: ["Protect", "Play"],
  },
];

class MockDatabase {
  private npcs: NPC[] = [...mockNPCs];

  async getNPCs() {
    return { data: this.npcs, error: null };
  }

  async getNPCById(id: string) {
    const npc = this.npcs.find((n) => n.id === id);
    return {
      data: npc || null,
      error: npc ? null : new Error("NPC not found"),
    };
  }

  async createNPC(npc: Omit<NPC, "id" | "created_at">) {
    const newNPC: NPC = {
      ...npc,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    this.npcs.push(newNPC);
    return { data: newNPC, error: null };
  }

  async updateNPC(id: string, updates: Partial<NPC>) {
    const index = this.npcs.findIndex((n) => n.id === id);
    if (index === -1) {
      return { data: null, error: new Error("NPC not found") };
    }
    this.npcs[index] = { ...this.npcs[index], ...updates };
    return { data: this.npcs[index], error: null };
  }

  async deleteNPC(id: string) {
    const index = this.npcs.findIndex((n) => n.id === id);
    if (index === -1) {
      return { error: new Error("NPC not found") };
    }
    this.npcs.splice(index, 1);
    return { error: null };
  }
}

export const mockDb = new MockDatabase();
