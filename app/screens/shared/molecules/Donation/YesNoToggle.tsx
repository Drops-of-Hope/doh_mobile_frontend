import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Chip } from "../../../../design";

interface YesNoToggleProps {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  description?: string;
  yesLabel?: string;
  noLabel?: string;
}

// Shared Yes/No question control for the donation eligibility steps.
// Built on the design system's Chip primitive instead of a bespoke
// TouchableOpacity pill, so every step reads consistently.
export const YesNoToggle: React.FC<YesNoToggleProps> = ({
  label,
  value,
  onChange,
  description,
  yesLabel = "Yes",
  noLabel = "No",
}) => {
  return (
    <View style={styles.wrap}>
      <Text variant="label" tone="inkMuted" style={styles.label}>
        {label}
      </Text>
      {description ? (
        <Text variant="caption" tone="inkFaint" style={styles.description}>
          {description}
        </Text>
      ) : null}
      <View style={styles.row}>
        <Chip label={yesLabel} selected={value === true} onPress={() => onChange(true)} />
        <Chip label={noLabel} selected={value === false} onPress={() => onChange(false)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { marginBottom: 4 },
  description: { marginBottom: 8 },
  row: { flexDirection: "row", gap: 8 },
});

export default YesNoToggle;
