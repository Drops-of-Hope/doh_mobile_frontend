import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, SectionHeader } from "../../../design";
import { FormSectionProps } from "../types";

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={styles.wrap}>
      <SectionHeader title={title} />
      <Surface padding="lg" radius="lg" bordered tone="surface">
        {children}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24,
  },
});
