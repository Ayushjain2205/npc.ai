import { NPC } from "./types";
import { mockDb } from "./mockDb";

// This class provides a consistent interface for database operations
// regardless of whether we're using the mock DB or Supabase
class DatabaseService {
  async getNPCs() {
    return mockDb.getNPCs();
  }

  async getNPCById(id: string) {
    return mockDb.getNPCById(id);
  }

  async createNPC(npc: Omit<NPC, "id" | "created_at">) {
    return mockDb.createNPC(npc);
  }

  async updateNPC(id: string, updates: Partial<NPC>) {
    return mockDb.updateNPC(id, updates);
  }

  async deleteNPC(id: string) {
    return mockDb.deleteNPC(id);
  }
}

export const db = new DatabaseService();
