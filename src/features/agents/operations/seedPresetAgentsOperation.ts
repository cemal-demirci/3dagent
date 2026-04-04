import { PRESET_AGENTS } from "@/lib/agents/presetAgents";
import type { AgentAvatarProfile } from "@/lib/avatars/profile";
import type { GatewayClient } from "@/lib/gateway/GatewayClient";
import { createGatewayAgent } from "@/lib/gateway/agentConfig";
import { writeGatewayAgentFiles } from "@/lib/gateway/agentFiles";

type GatewayClientLike = {
  call: (method: string, params: unknown) => Promise<unknown>;
};

export type SeedPresetAgentsResult = {
  avatars: Record<string, AgentAvatarProfile>;
};

/**
 * Creates 6 preset Turkish mythology agents when the gateway fleet is empty.
 * Returns avatar mappings for the created agents, or `null` if the fleet
 * was already populated (seeding skipped).
 */
export async function seedPresetAgentsIfEmpty(params: {
  client: GatewayClientLike;
  seeds: { agentId: string }[];
}): Promise<SeedPresetAgentsResult | null> {
  if (params.seeds.length > 0) {
    return null;
  }

  const client = params.client as GatewayClient;
  const avatars: Record<string, AgentAvatarProfile> = {};

  for (const preset of PRESET_AGENTS) {
    const entry = await createGatewayAgent({
      client,
      name: preset.name,
    });

    await writeGatewayAgentFiles({
      client,
      agentId: entry.id,
      files: preset.files,
    });

    avatars[entry.id] = preset.avatarProfile;
  }

  return { avatars };
}
