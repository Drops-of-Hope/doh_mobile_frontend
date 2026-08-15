import { createAvatar } from "@dicebear/core";
import * as notionists from "@dicebear/notionists";
import { AvatarOptions } from "./avatarUrl";
import { lightTokens } from "../tokens";

// Regenerating the SVG string on every render is measurable in scroll lists
// (participant rows, search results), so cache by encoded config.
const cache = new Map<string, string>();

function toDicebearOptions(options: AvatarOptions) {
  const dicebearOptions: Record<string, unknown> = {
    seed: options.seed,
    backgroundColor: [lightTokens.color.surfaceSunken.replace("#", "")],
    backgroundType: ["solid"],
  };

  const arrayFields: (keyof AvatarOptions)[] = [
    "base",
    "hair",
    "brows",
    "eyes",
    "nose",
    "lips",
    "beard",
    "glasses",
    "gesture",
    "body",
    "bodyIcon",
  ];
  for (const field of arrayFields) {
    const value = options[field];
    if (typeof value === "string" && value) {
      dicebearOptions[field] = [value];
    }
  }

  if (options.beardProbability !== undefined) dicebearOptions.beardProbability = options.beardProbability;
  if (options.glassesProbability !== undefined) dicebearOptions.glassesProbability = options.glassesProbability;
  if (options.bodyIconProbability !== undefined) dicebearOptions.bodyIconProbability = options.bodyIconProbability;

  return dicebearOptions;
}

export function generateAvatarSvg(options: AvatarOptions, cacheKey: string): string {
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const svg = createAvatar(notionists, toDicebearOptions(options)).toString();
  cache.set(cacheKey, svg);
  return svg;
}
