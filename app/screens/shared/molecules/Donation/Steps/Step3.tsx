import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";

interface Step3Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step3: React.FC<Step3Props> = ({ formData, onUpdateField }) => {
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
        {t("donation.steps.step3_title")}
      </Text>

      <YesNoButton
        label={t("donation.questions.haveHepatitis")}
        value={formData.haveHepatitis}
        onPress={(val) => onUpdateField("haveHepatitis", val)}
      />
      <YesNoButton
        label={t("donation.questions.haveTB")}
        value={formData.haveTB}
        onPress={(val) => onUpdateField("haveTB", val)}
      />
      <YesNoButton
        label={t("donation.questions.hadTyphoid")}
        value={formData.hadTyphoid}
        onPress={(val) => onUpdateField("hadTyphoid", val)}
      />
    </View>
  );
};

export default Step3;
