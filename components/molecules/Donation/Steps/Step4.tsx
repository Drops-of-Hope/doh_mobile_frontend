import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DonationFormData } from "../../../../app/services/donationService";
import { useLanguage } from "../../../../app/context/LanguageContext";

interface Step4Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step4: React.FC<Step4Props> = ({ formData, onUpdateField }) => {
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
    <View style={{ padding: 16 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 16,
          color: "#1F2937",
        }}
      >
        {t("donation.steps.step4_title")}
      </Text>

      <YesNoButton
        label={t("donation.questions.hadVaccination")}
        value={formData.hadVaccination}
        onPress={(val) => onUpdateField("hadVaccination", val)}
      />

      <YesNoButton
        label={t("donation.questions.tattoos")}
        value={formData.tattoos}
        onPress={(val) => onUpdateField("tattoos", val)}
      />

      <YesNoButton
        label={t("donation.questions.haveImprisonment")}
        value={formData.haveImprisonment}
        onPress={(val) => onUpdateField("haveImprisonment", val)}
      />

      <YesNoButton
        label={t("donation.questions.travelledAbroad")}
        value={formData.travelledAbroad}
        onPress={(val) => onUpdateField("travelledAbroad", val)}
      />

      <YesNoButton
        label={t("donation.questions.receivedBlood")}
        value={formData.receivedBlood}
        onPress={(val) => onUpdateField("receivedBlood", val)}
      />

      <YesNoButton
        label={t("donation.questions.partnerReceivedBlood")}
        value={formData.partnerReceivedBlood}
        onPress={(val) => onUpdateField("partnerReceivedBlood", val)}
      />

      <YesNoButton
        label={t("donation.questions.hadMalaria")}
        value={formData.hadMalaria}
        onPress={(val) => onUpdateField("hadMalaria", val)}
      />
    </View>
  );
};

export default Step4;
