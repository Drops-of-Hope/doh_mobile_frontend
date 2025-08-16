import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { DonationFormData } from "../../../../app/services/donationService";
import { useLanguage } from "../../../../app/context/LanguageContext";

interface Step1Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step1: React.FC<Step1Props> = ({ formData, onUpdateField }) => {
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
        {t("donation.steps.step1_title")}
      </Text>

      <YesNoButton
        label={t("donation.questions.hasDonatedBefore")}
        value={formData.hasDonatedBefore}
        onPress={(val) => onUpdateField("hasDonatedBefore", val)}
      />

      {formData.hasDonatedBefore && (
        <>
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 8,
                color: "#1F2937",
              }}
            >
              {t("donation.questions.donationCount")}
            </Text>
            <TextInput
              value={formData.donationCount?.toString() || ""}
              onChangeText={(text) =>
                onUpdateField("donationCount", parseInt(text) || 0)
              }
              placeholder="Enter number of times"
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#fff",
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 8,
                color: "#1F2937",
              }}
            >
              {t("donation.questions.lastDonationDate")}
            </Text>
            <TextInput
              value={formData.lastDonationDate || ""}
              onChangeText={(text) => onUpdateField("lastDonationDate", text)}
              placeholder="DD/MM/YYYY"
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 12,
                backgroundColor: "#fff",
              }}
            />
          </View>

          <YesNoButton
            label={t("donation.questions.anyDifficulty")}
            value={formData.anyDifficulty}
            onPress={(val) => onUpdateField("anyDifficulty", val)}
          />

          {formData.anyDifficulty && (
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: "#1F2937",
                }}
              >
                {t("donation.descriptions.anyDifficulty")}
              </Text>
              <TextInput
                value={formData.difficultyDetails || ""}
                onChangeText={(text) =>
                  onUpdateField("difficultyDetails", text)
                }
                placeholder="Please describe the difficulty"
                multiline
                numberOfLines={3}
                style={{
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#fff",
                  textAlignVertical: "top",
                }}
              />
            </View>
          )}
        </>
      )}

      <YesNoButton
        label={t("donation.questions.medicalAdvice")}
        value={formData.medicalAdvice}
        onPress={(val) => onUpdateField("medicalAdvice", val)}
      />

      <YesNoButton
        label={t("donation.questions.readInformationLeaflet")}
        value={formData.readInformationLeaflet}
        onPress={(val) => onUpdateField("readInformationLeaflet", val)}
      />
    </View>
  );
};

export default Step1;
