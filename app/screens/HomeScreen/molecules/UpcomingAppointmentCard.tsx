// The single appointment card on Home. One component, two moods: crimson and
// alarming when the appointment is 3 days out or closer (with a relative
// headline — "Today" / "Tomorrow" / "Day after tomorrow"), calm neutral surface
// when it's further away. The QR reveal and Fill Form actions only appear on
// the day itself, since that's the only day they're usable.
import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Calendar, MapPin, FileText, ChevronDown, ChevronUp, Eye } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import { Surface, Text, Icon, Button, useTheme } from "../../../design";
import { useLanguage } from "../../../context/LanguageContext";
import { getUrgency, isUrgent, urgencyLabelKey, daysUntil } from "../../../utils/appointmentUrgency";

interface UpcomingAppointmentCardProps {
  appointment: {
    id: string;
    appointmentDateTime?: string;
    appointmentDate?: string;
    location?: string;
    medicalEstablishment?: {
      name: string;
      address: string;
    };
    slot?: {
      startTime: string;
      endTime: string;
    } | null;
  };
  userName: string;
  userEmail: string;
  userUID: string;
}

// Slot times arrive as bare "09:00" strings. Some callers pass a full ISO
// string, so handle both.
const formatTime = (timeString: string): string => {
  if (timeString.includes("T")) {
    const date = new Date(timeString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return timeString;
};

export default function UpcomingAppointmentCard({
  appointment,
  userName,
  userEmail,
  userUID,
}: UpcomingAppointmentCardProps) {
  const theme = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQRRevealed, setIsQRRevealed] = useState(false);

  const dateValue = appointment.appointmentDateTime || appointment.appointmentDate || "";
  const urgency = getUrgency(dateValue);
  const urgent = isUrgent(urgency);
  const isToday = urgency === "today";

  const headline = t(urgencyLabelKey(urgency), { days: daysUntil(dateValue) });

  const absoluteDate = (() => {
    const date = new Date(dateValue);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  })();

  // Only the slot carries a real time. appointmentDate is stored at UTC
  // midnight, so formatting its clock component yields a bogus "05:30" in
  // UTC+5:30 — show nothing rather than a time the donor might turn up for.
  const timeRange = appointment.slot?.startTime
    ? `${formatTime(appointment.slot.startTime)} - ${formatTime(appointment.slot.endTime)}`
    : "";

  const establishmentName =
    appointment.medicalEstablishment?.name || appointment.location || "";
  const establishmentAddress = appointment.medicalEstablishment?.address || "";

  const handleFillDonationForm = () => {
    (navigation as any).navigate("Donate", {
      appointmentId: appointment.id,
      openBloodDonationForm: true,
    });
  };

  const qrData = JSON.stringify({
    name: userName,
    email: userEmail,
    uid: userUID,
    appointmentId: appointment.id,
    timestamp: new Date().toISOString(),
  });

  return (
    <Surface
      tone={urgent ? "crimsonSoft" : "surface"}
      style={urgent ? [styles.card, { borderColor: theme.color.crimson }] : undefined}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: urgent ? theme.color.crimson : theme.color.surfaceSunken },
          ]}
        >
          <Icon
            icon={Calendar}
            size={22}
            color={urgent ? theme.color.inverse : theme.color.inkMuted}
          />
        </View>
        <View style={styles.headerText}>
          <Text variant="h3">{urgent ? headline : t("home.next_appointment")}</Text>
          <Text variant="label" tone={urgent ? "crimson" : "inkMuted"}>
            {urgent
              ? timeRange || absoluteDate
              : [absoluteDate, timeRange].filter(Boolean).join(" · ")}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Icon icon={MapPin} size={16} color={theme.color.inkMuted} />
        <View style={styles.infoText}>
          <Text variant="body" numberOfLines={2}>
            {establishmentName}
          </Text>
          {establishmentAddress ? (
            <Text variant="caption" tone="inkMuted" numberOfLines={2}>
              {establishmentAddress}
            </Text>
          ) : null}
        </View>
      </View>

      {isToday ? (
        <View style={styles.actionsRow}>
          <View style={styles.actionFlex}>
            <Button
              title={t("home.fill_form")}
              variant="solid"
              size="sm"
              icon={<Icon icon={FileText} size={16} color={theme.color.inverse} />}
              onPress={handleFillDonationForm}
            />
          </View>
          <View style={styles.actionFlex}>
            <Button
              title={isExpanded ? t("home.hide_qr") : t("home.show_qr")}
              variant="outline"
              size="sm"
              icon={
                <Icon
                  icon={isExpanded ? ChevronUp : ChevronDown}
                  size={16}
                  color={theme.color.crimson}
                />
              }
              onPress={() => {
                setIsExpanded(!isExpanded);
                if (!isExpanded) setIsQRRevealed(false);
              }}
            />
          </View>
        </View>
      ) : null}

      {isToday && isExpanded ? (
        <Surface tone="surface" style={styles.qrSection}>
          <Text variant="h3" align="center" style={styles.qrTitle}>
            {t("home.appointment_qr_title")}
          </Text>
          <Text variant="caption" tone="inkMuted" align="center" style={styles.qrSubtitle}>
            {t("home.appointment_qr_subtitle")}
          </Text>

          <View style={styles.qrContainer}>
            {!isQRRevealed ? (
              <Pressable
                style={[styles.blurOverlay, { backgroundColor: theme.color.surfaceSunken }]}
                onPress={() => setIsQRRevealed(true)}
              >
                <Icon icon={Eye} size={28} color={theme.color.crimson} />
                <Text variant="label" tone="crimson">
                  {t("home.tap_to_reveal")}
                </Text>
              </Pressable>
            ) : null}

            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={qrData}
                size={180}
                color={theme.color.ink}
                backgroundColor={theme.color.surface}
              />
            </View>
          </View>

          <View style={[styles.appointmentIdBadge, { backgroundColor: theme.color.surfaceSunken }]}>
            <Text variant="caption" tone="inkMuted">
              {t("home.appointment_id")}
            </Text>
            <Text variant="label">{appointment.id}</Text>
          </View>
        </Surface>
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1.5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  infoText: { flex: 1, gap: 2 },
  actionsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionFlex: { flex: 1 },
  qrSection: { marginTop: 16 },
  qrTitle: { marginBottom: 4 },
  qrSubtitle: { marginBottom: 16 },
  qrContainer: { alignItems: "center", justifyContent: "center", marginBottom: 16 },
  qrCodeWrapper: { padding: 12, borderRadius: 12 },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  appointmentIdBadge: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, alignItems: "center" },
});
