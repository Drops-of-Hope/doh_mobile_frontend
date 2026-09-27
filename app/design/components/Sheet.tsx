import React from "react";
import { Modal, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  scroll?: boolean;
}

// The one bottom-sheet shell for the whole app — replaces the 19 hand-rolled
// <Modal> implementations that existed before.
export const Sheet: React.FC<SheetProps> = ({ visible, onClose, title, children, scroll = true }) => {
  const theme = useTheme();
  const Body = scroll ? ScrollView : View;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.color.paper,
              borderTopLeftRadius: theme.radius.xl,
              borderTopRightRadius: theme.radius.xl,
              borderColor: theme.color.hairline,
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: theme.color.hairlineStrong }]} />
          {title ? (
            <View style={styles.header}>
              <Text variant="h2">{title}</Text>
              <Pressable onPress={onClose} hitSlop={12}>
                <Icon icon={X} size={22} />
              </Pressable>
            </View>
          ) : null}
          <Body style={styles.body} contentContainerStyle={scroll ? styles.bodyContent : undefined}>
            {children}
          </Body>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(26,25,23,0.4)", justifyContent: "flex-end" },
  sheet: { maxHeight: "88%", borderWidth: 1.5, borderBottomWidth: 0, paddingTop: 10 },
  grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  body: { paddingHorizontal: 20, flexShrink: 1 },
  bodyContent: { paddingBottom: 32 },
});

export default Sheet;
