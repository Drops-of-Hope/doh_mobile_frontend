import React from "react";
import { View, Pressable } from "react-native";
import { Check } from "lucide-react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Text, Icon, useTheme } from "../../../../../design";
import YesNoToggle from "../YesNoToggle";

interface Step6Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step6: React.FC<Step6Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <View>
      <Text variant="h2" style={{ marginBottom: 16 }}>
        {t("donation.steps.step6_title")}
      </Text>

      <YesNoToggle
        label={t("donation.questions.knowledgeAgent")}
        value={formData.knowledgeAgent}
        onChange={(val) => onUpdateField("knowledgeAgent", val)}
      />

      <YesNoToggle
        label={t("donation.questions.highRisk")}
        value={formData.highRisk}
        onChange={(val) => onUpdateField("highRisk", val)}
      />

      <YesNoToggle
        label={t("donation.questions.feverLymphNode")}
        value={formData.feverLymphNode}
        onChange={(val) => onUpdateField("feverLymphNode", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadWeightLoss")}
        value={formData.hadWeightLoss}
        onChange={(val) => onUpdateField("hadWeightLoss", val)}
      />

      <View style={{ marginTop: 8 }}>
        <Text variant="label" tone="inkMuted" style={{ marginBottom: 10 }}>
          {t("donation.steps.declaration_label")}
        </Text>
        <Pressable
          onPress={() => onUpdateField("Acknowledgement", !formData.Acknowledgement)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: theme.radius.sm,
              borderWidth: 1.5,
              borderColor: formData.Acknowledgement ? theme.color.crimson : theme.color.hairlineStrong,
              backgroundColor: formData.Acknowledgement ? theme.color.crimson : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {formData.Acknowledgement ? <Icon icon={Check} size={15} color={theme.color.inverse} /> : null}
          </View>
          <Text variant="body" style={{ flex: 1 }}>
            I agree to the donor declaration
          </Text>
        </Pressable>

        {!formData.Acknowledgement && (
          <Text variant="caption" tone="danger" style={{ marginTop: 8 }}>
            {t("donation.declaration_required_error")}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Step6;
