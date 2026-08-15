import React, { useMemo, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Clock, Check } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";
import { Sheet } from "./Sheet";

interface TimeFieldProps {
  label?: string;
  value: string; // "HH:mm" 24h
  onChange: (time: string) => void;
  error?: string;
  required?: boolean;
}

function formatDisplayTime(time: string): string {
  if (!time) return "Select time";
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export const TimeField: React.FC<TimeFieldProps> = ({ label, value, onChange, error, required }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    // Blood-donation campaigns run in a daytime window (06:00-20:00); trimming
    // the overnight hours keeps the sheet short enough to reach without a
    // long scroll while still covering every realistic campaign time.
    const times: string[] = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) break;
        times.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      }
    }
    return times;
  }, []);

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="label" tone="inkMuted" style={styles.label}>
          {label}
          {required ? <Text variant="label" tone="crimson"> *</Text> : null}
        </Text>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.control,
          {
            borderColor: error ? theme.color.danger : theme.color.hairline,
            backgroundColor: theme.color.surfaceSunken,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <View style={styles.left}>
          <Icon icon={Clock} size={18} color={value ? theme.color.crimson : theme.color.inkFaint} />
          <Text variant="body" tone={value ? "ink" : "inkFaint"}>
            {formatDisplayTime(value)}
          </Text>
        </View>
      </Pressable>
      {error ? (
        <Text variant="caption" tone="danger" style={styles.helper}>
          {error}
        </Text>
      ) : null}

      <Sheet visible={open} onClose={() => setOpen(false)} title={label || "Select time"}>
        {options.map((time) => (
          <Pressable
            key={time}
            onPress={() => {
              onChange(time);
              setOpen(false);
            }}
            style={[styles.option, { borderBottomColor: theme.color.hairline }]}
          >
            <Text variant="body">{formatDisplayTime(time)}</Text>
            {time === value ? <Icon icon={Check} size={18} color={theme.color.crimson} /> : null}
          </Pressable>
        ))}
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { marginBottom: 6 },
  control: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  helper: { marginTop: 6, marginLeft: 2 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});

export default TimeField;
