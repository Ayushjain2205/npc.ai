export interface NPC {
  id: string;
  created_at: string;
  name: string;
  background: string;
  appearance: string;
  profile_image_url: string | null;
  personality: {
    riskTolerance: number;
    rationality: number;
    autonomy: number;
  };
  coreValues: string[];
  primaryAims: string[];
}
