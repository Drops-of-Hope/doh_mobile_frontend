import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { X } from "lucide-react-native";
import { Text, Button, Surface, Icon, useTheme } from "../../../../design";

interface QRDisplayProps {
  userName: string;
  userEmail: string;
  userUID: string;
  onClose?: () => void;
}

// Donor check-in QR card, shown full-screen from the Donate flow.
const QRDisplay: React.FC<QRDisplayProps> = ({ userName, userEmail, userUID, onClose }) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const qrSize = Math.min(screenWidth * 0.6, 280);

  // Create QR code data
  const qrData = JSON.stringify({
    name: userName,
    email: userEmail,
    uid: userUID,
    timestamp: new Date().toISOString(),
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.color.paper }]}>
      <Surface style={styles.card} padding="xxl" radius="xl">
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" align="center">
            {userName}
          </Text>
          <Text variant="body" tone="inkMuted" align="center">
            {userEmail}
          </Text>
          <View style={[styles.accent, { backgroundColor: theme.color.crimson }]} />
        </View>

        {/* QR code inside a crimson-outline frame */}
        <View
          style={[
            styles.qrFrame,
            { borderColor: theme.color.crimson, borderRadius: theme.radius.lg },
          ]}
        >
          <QRCode value={qrData} size={qrSize} color={theme.color.ink} backgroundColor="#FFFFFF" />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={[
              styles.idPill,
              { backgroundColor: theme.color.surfaceSunken, borderRadius: theme.radius.pill },
            ]}
          >
            <Text variant="label" tone="inkMuted">
              ID: {userUID}
            </Text>
          </View>
          <Text variant="caption" tone="inkFaint" align="center" style={styles.hint}>
            Show this QR code to staff at the donation center for quick check-in
          </Text>
        </View>
      </Surface>

      {onClose && (
        <View style={styles.closeWrap}>
          <Button
            title="Close"
            onPress={onClose}
            fullWidth={false}
            icon={<Icon icon={X} size={18} color={theme.color.inverse} />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: { alignItems: "center", alignSelf: "stretch" },
  header: { alignItems: "center", marginBottom: 20, gap: 2 },
  accent: { width: 56, height: 3, borderRadius: 2, marginTop: 12 },
  qrFrame: { padding: 16, borderWidth: 2, backgroundColor: "#FFFFFF", marginBottom: 20 },
  footer: { alignItems: "center" },
  idPill: { paddingHorizontal: 16, paddingVertical: 6, marginBottom: 10 },
  hint: { maxWidth: 260 },
  closeWrap: { marginTop: 24 },
});

export default QRDisplay;
