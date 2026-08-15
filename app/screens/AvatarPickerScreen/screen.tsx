import React, { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Shuffle } from "lucide-react-native";
import {
  Screen,
  AppBar,
  Text,
  Button,
  Icon,
  UserAvatar,
  ActionBar,
  encodeAvatar,
  decodeAvatar,
  AvatarOptions,
  useTheme,
} from "../../design";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { logger } from "../../utils/logger";

interface CategoryDef {
  key: keyof AvatarOptions;
  label: string;
  values: string[];
}

const CATEGORIES: CategoryDef[] = [
  { key: "hair", label: "Hair", values: buildVariants(63, ["hat"]) },
  { key: "brows", label: "Brows", values: buildVariants(13) },
  { key: "eyes", label: "Eyes", values: buildVariants(5) },
  { key: "nose", label: "Nose", values: buildVariants(20) },
  { key: "lips", label: "Lips", values: buildVariants(30) },
  { key: "beard", label: "Beard", values: buildVariants(12) },
  { key: "glasses", label: "Glasses", values: buildVariants(11) },
  { key: "body", label: "Outfit", values: buildVariants(25) },
  {
    key: "gesture",
    label: "Pose",
    values: [
      "wavePointLongArms",
      "waveOkLongArms",
      "waveLongArms",
      "waveLongArm",
      "pointLongArm",
      "okLongArm",
      "point",
      "ok",
      "hand",
      "handPhone",
    ],
  },
];

function buildVariants(count: number, extra: string[] = []): string[] {
  const values = Array.from({ length: count }, (_, i) => `variant${String(i + 1).padStart(2, "0")}`);
  return [...values, ...extra];
}

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface AvatarPickerScreenProps {
  navigation?: any;
}

export default function AvatarPickerScreen({ navigation }: AvatarPickerScreenProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [options, setOptions] = useState<AvatarOptions>({ seed: user?.sub || user?.email || randomSeed() });
  const [activeCategory, setActiveCategory] = useState<keyof AvatarOptions>("hair");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await userService.getUserProfile();
        const existing = decodeAvatar(profile.profileImageUrl);
        if (existing) setOptions(existing);
      } catch (error) {
        logger.error("Failed to load existing avatar:", error);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const previewUrl = encodeAvatar(options);
  const activeDef = CATEGORIES.find((c) => c.key === activeCategory)!;

  const handleShuffle = () => {
    setOptions({ seed: randomSeed() });
  };

  const handlePick = (value: string) => {
    setOptions((prev) => ({ ...prev, [activeCategory]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({ profileImageUrl: previewUrl });
      navigation?.goBack();
    } catch (error) {
      logger.error("Failed to save avatar:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <AppBar title="Choose your avatar" onBack={() => navigation?.goBack()} />
      <View style={styles.previewRow}>
        <UserAvatar url={previewUrl} name={user?.name} size={128} />
        <Pressable
          onPress={handleShuffle}
          style={[styles.shuffleBtn, { borderColor: theme.color.hairline, borderRadius: theme.radius.pill }]}
        >
          <Icon icon={Shuffle} size={16} />
          <Text variant="label">Shuffle</Text>
        </Pressable>
      </View>

      {!loaded ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={theme.color.crimson} />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsRow}
            contentContainerStyle={styles.tabsContent}
          >
            {CATEGORIES.map((cat) => {
              const active = cat.key === activeCategory;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => setActiveCategory(cat.key)}
                  style={[
                    styles.tab,
                    {
                      borderColor: active ? theme.color.crimson : theme.color.hairline,
                      backgroundColor: active ? theme.color.crimsonSoft : theme.color.surface,
                      borderRadius: theme.radius.pill,
                    },
                  ]}
                >
                  <Text variant="label" tone={active ? "crimson" : "inkMuted"}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView contentContainerStyle={styles.optionsGrid}>
            {activeDef.values.map((value) => {
              const selected = options[activeCategory] === value;
              const optionOptions: AvatarOptions = { seed: options.seed, [activeCategory]: value } as AvatarOptions;
              return (
                <Pressable
                  key={value}
                  onPress={() => handlePick(value)}
                  style={[
                    styles.optionCell,
                    {
                      borderColor: selected ? theme.color.crimson : theme.color.hairline,
                      borderRadius: theme.radius.md,
                      backgroundColor: theme.color.surface,
                    },
                  ]}
                >
                  <UserAvatar url={encodeAvatar(optionOptions)} size={56} />
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}

      <ActionBar>
        <Button title="Save avatar" onPress={handleSave} loading={saving} />
      </ActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  previewRow: { alignItems: "center", paddingVertical: 20, gap: 12 },
  shuffleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabsRow: { flexGrow: 0, marginBottom: 12 },
  tabsContent: { paddingHorizontal: 20, gap: 8 },
  tab: { borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8, marginRight: 4 },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  optionCell: { width: 64, height: 64, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
});
