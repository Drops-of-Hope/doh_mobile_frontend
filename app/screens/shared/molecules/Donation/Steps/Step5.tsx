import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";

interface Step5Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step5: React.FC<Step5Props> = ({ formData, onUpdateField }) => {
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
          {t("donation.steps.step5_title")}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 16,
            color: "#1F2937",
          }}
        >
          {t("donation.descriptions.recentIllnesses")}
        </Text>

        <YesNoButton
          label={t("donation.questions.hasDengue")}
          value={formData.hasDengue}
          onPress={(val) => onUpdateField("hasDengue", val)}
        />

        <YesNoButton
          label={t("donation.questions.hadLongFever")}
          value={formData.hadLongFever}
          onPress={(val) => onUpdateField("hadLongFever", val)}
        />

        <YesNoButton
          label={t("donation.questions.hadChickenPox")}
          value={formData.hadChickenPox}
          onPress={(val) => onUpdateField("hadChickenPox", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.hadMeasles")}
          value={formData.hadMeasles}
          onPress={(val) => onUpdateField("hadMeasles", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.hadMumps")}
          value={formData.hadMumps}
          onPress={(val) => onUpdateField("hadMumps", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.hadRubella")}
          value={formData.hadRubella}
          onPress={(val) => onUpdateField("hadRubella", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.hadDiarrhoea")}
          value={formData.hadDiarrhoea}
          onPress={(val) => onUpdateField("hadDiarrhoea", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.hadtoothExtraction")}
          value={formData.hadtoothExtraction}
          onPress={(val) => onUpdateField("hadtoothExtraction", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.bookAspirin")}
          value={formData.bookAspirin}
          onPress={(val) => onUpdateField("bookAspirin", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.tookAntibiotics")}
          value={formData.tookAntibiotics}
          onPress={(val) => onUpdateField("tookAntibiotics", val)}
        />
        
        <YesNoButton
          label={t("donation.questions.tookOtherMedicine")}
          value={formData.tookOtherMedicine}
          onPress={(val) => onUpdateField("tookOtherMedicine", val)}
        />
      </View>
    </ScrollView>
  );
};

export default Step5;
