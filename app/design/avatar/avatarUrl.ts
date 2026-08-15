// Encodes/decodes a DiceBear "notionists" avatar configuration as a URL.
//
// The backend validates profileImageUrl with `z.string().url()`
// (cloudflare_doh_backend/src/routes/users.ts) and nothing else — so a
// syntactically valid URL that nobody has to resolve satisfies it. This lets
// generated avatars ship with zero backend changes: the config just rides
// along as query params on a URL that is never fetched.

export const AVATAR_HOST = "https://avatars.dropsofhope.app/v1/notionists.svg";

export interface AvatarOptions {
  seed: string;
  base?: string;
  hair?: string;
  brows?: string;
  eyes?: string;
  nose?: string;
  lips?: string;
  beard?: string;
  beardProbability?: number; // 0 or 100 — hide/show
  glasses?: string;
  glassesProbability?: number; // 0 or 100 — hide/show
  gesture?: string;
  body?: string;
  bodyIcon?: string;
  bodyIconProbability?: number; // 0 or 100 — hide/show
}

const KEYS: (keyof AvatarOptions)[] = [
  "seed",
  "base",
  "hair",
  "brows",
  "eyes",
  "nose",
  "lips",
  "beard",
  "beardProbability",
  "glasses",
  "glassesProbability",
  "gesture",
  "body",
  "bodyIcon",
  "bodyIconProbability",
];

export function encodeAvatar(options: AvatarOptions): string {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = options[key];
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  return `${AVATAR_HOST}?${params.toString()}`;
}

export function decodeAvatar(url: string | null | undefined): AvatarOptions | null {
  if (!url || !url.startsWith(AVATAR_HOST)) return null;
  try {
    const parsed = new URL(url);
    const seed = parsed.searchParams.get("seed");
    if (!seed) return null;

    const options: AvatarOptions = { seed };
    for (const key of KEYS) {
      if (key === "seed") continue;
      const raw = parsed.searchParams.get(key);
      if (raw === null) continue;
      if (key.endsWith("Probability")) {
        (options as any)[key] = Number(raw);
      } else {
        (options as any)[key] = raw;
      }
    }
    return options;
  } catch {
    return null;
  }
}

export function isDohAvatarUrl(url: string | null | undefined): boolean {
  return !!url && url.startsWith(AVATAR_HOST);
}

// A fresh, unconfigured avatar for a given user — DiceBear fills in every
// unset attribute deterministically from the seed.
export function defaultAvatarUrl(seed: string): string {
  return encodeAvatar({ seed });
}
