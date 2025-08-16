import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { DonationFormData } from "../../../../app/services/donationService";
import { useLanguage } from "../../../../app/context/LanguageContext";

interface Step6Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step6: React.FC<Step6Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();

  const YesNoButton = ({
    value,
    onPress,
    label,
  }: {
    value: boolean | undefined;
    onPress: (val: boolean) => void;
    label: string;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          marginBottom: 8,
          color: "#1F2937",
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: value === true ? "#DC2626" : "#F3F4F6",
            borderWidth: 1,
            borderColor: value === true ? "#DC2626" : "#D1D5DB",
          }}
          onPress={() => onPress(true)}
        >
          <Text
            style={{
              color: value === true ? "white" : "#6B7280",
              fontWeight: "600",
            }}
          >
            {t("common.yes")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: value === false ? "#DC2626" : "#F3F4F6",
            borderWidth: 1,
            borderColor: value === false ? "#DC2626" : "#D1D5DB",
          }}
          onPress={() => onPress(false)}
        >
          <Text
            style={{
              color: value === false ? "white" : "#6B7280",
              fontWeight: "600",
            }}
          >
            {t("common.no")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 16,
            color: "#1F2937",
          }}
        >
          {t("donation.steps.step6_title")}
        </Text>

        <YesNoButton
          label={t("donation.questions.knowledgeAgent")}
          value={formData.knowledgeAgent}
          onPress={(val) => onUpdateField("knowledgeAgent", val)}
        />

        <YesNoButton
          label={t("donation.questions.highRisk")}
          value={formData.highRisk}
          onPress={(val) => onUpdateField("highRisk", val)}
        />

        <YesNoButton
          label={t("donation.questions.feverLymphNode")}
          value={formData.feverLymphNode}
          onPress={(val) => onUpdateField("feverLymphNode", val)}
        />

        <YesNoButton
          label={t("donation.questions.hadWeightLoss")}
          value={formData.hadWeightLoss}
          onPress={(val) => onUpdateField("hadWeightLoss", val)}
        />

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16, color: "#111827", marginBottom: 8 }}>
            {t("donation.steps.declaration_label")}
          </Text>
          <TouchableOpacity
            onPress={() =>
              onUpdateField("Acknowledgement", !formData.Acknowledgement)
            }
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: formData.Acknowledgement ? "#DC2626" : "#D1D5DB",
                backgroundColor: formData.Acknowledgement ? "#DC2626" : "#FFF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {formData.Acknowledgement && (
                <Text
                  style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                >
                  ✓
                </Text>
              )}
            </View>
            <Text style={{ color: "#111827" }}>
              I agree to the donor declaration
            </Text>
          </TouchableOpacity>

          {!formData.Acknowledgement && (
            <Text
              style={{
                fontSize: 12,
                color: "#DC2626",
                marginTop: 8,
                fontStyle: "italic",
              }}
            >
              {t("donation.declaration_required_error")}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Step6;
