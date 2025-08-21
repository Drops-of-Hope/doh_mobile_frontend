import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DonationFormData } from "../../../../app/services/donationService";
import { useLanguage } from "../../../../app/context/LanguageContext";

interface Step2Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step2: React.FC<Step2Props> = ({ formData, onUpdateField }) => {
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

  const medicalConditions = [
    {
      key: "heartDisease",
      label: t("donation.medicalConditions.heartDisease"),
    },
    {
      key: "strokes",
      label: t("donation.medicalConditions.strokes"),
    },
    {
      key: "kidneyDiseases",
      label: t("donation.medicalConditions.kidneyDiseases"),
    },
    {
      key: "diabetes",
      label: t("donation.medicalConditions.diabetes"),
    },
    { 
      key: "fits", 
      label: t("donation.medicalConditions.fits") 
    },
    {
      key: "liverDiseases",
      label: t("donation.medicalConditions.liverDiseases"),
    },
    {
      key: "asthmaLungDisease",
      label: t("donation.medicalConditions.asthmaLungDisease"),
    },
    {
      key: "bloodDisorders",
      label: t("donation.medicalConditions.bloodDisorders"),
    },
    {
      key: "cancer",
      label: t("donation.medicalConditions.cancer"),
    },
  ];

  const toggleMedicalCondition = (conditionKey: string) => {
    const currentConditions = formData.medicalConditions || {};
    const updatedConditions = {
      ...currentConditions,
      [conditionKey]:
        !currentConditions[conditionKey as keyof typeof currentConditions],
    };
    onUpdateField("medicalConditions", updatedConditions);
  };

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
        {t("donation.steps.step2_title")}
      </Text>

      <YesNoButton
        label={t("donation.questions.feelingWell")}
        value={formData.feelingWell}
        onPress={(val) => onUpdateField("feelingWell", val)}
      />

      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 8,
            color: "#1F2937",
          }}
        >
          {t("donation.descriptions.medicalConditionsHeader")}
        </Text>

        <View
          style={{
            backgroundColor: "#F9FAFB",
            padding: 16,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          {medicalConditions.map((condition) => {
            const isChecked =
              formData.medicalConditions?.[
                condition.key as keyof typeof formData.medicalConditions
              ] || false;
            return (
              <TouchableOpacity
                key={condition.key}
                onPress={() => toggleMedicalCondition(condition.key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E5E7EB",
                }}
              >
                <Text style={{ fontSize: 15, color: "#111827" }}>
                  {condition.label}
                </Text>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: isChecked ? "#DC2626" : "#D1D5DB",
                    backgroundColor: isChecked ? "#DC2626" : "#FFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isChecked && (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <YesNoButton
        label={t("donation.questions.takingMedicines")}
        value={formData.takingMedicines}
        onPress={(val) => onUpdateField("takingMedicines", val)}
      />

      <YesNoButton
        label={t("donation.questions.anySurgery")}
        value={formData.anySurgery}
        onPress={(val) => onUpdateField("anySurgery", val)}
      />

      <YesNoButton
        label={t("donation.questions.workingLater")}
        value={formData.workingLater}
        onPress={(val) => onUpdateField("workingLater", val)}
      />

      <YesNoButton
        label={t("donation.questions.pregnant")}
        value={formData.pregnant}
        onPress={(val) => onUpdateField("pregnant", val)}
      />

      <YesNoButton
        label={t("donation.questions.breastFeeding")}
        value={formData.breastFeeding}
        onPress={(val) => onUpdateField("breastFeeding", val)}
      />

      <YesNoButton
        label={t("donation.questions.recentChildbirth")}
        value={formData.recentChildbirth}
        onPress={(val) => onUpdateField("recentChildbirth", val)}
      />
    </View>
  );
};

export default Step2;
