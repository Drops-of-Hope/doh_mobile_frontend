import React from "react";
import { View } from "react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Text, Field } from "../../../../../design";
import YesNoToggle from "../YesNoToggle";

interface Step1Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step1: React.FC<Step1Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();

  return (
    <View>
      <Text variant="h2" style={{ marginBottom: 16 }}>
        {t("donation.steps.step1_title")}
      </Text>

      <YesNoToggle
        label={t("donation.questions.hasDonatedBefore")}
        value={formData.hasDonatedBefore}
        onChange={(val) => onUpdateField("hasDonatedBefore", val)}
      />

      {formData.hasDonatedBefore && (
        <>
          <Field
            label={t("donation.questions.donationCount")}
            value={formData.donationCount?.toString() || ""}
            onChangeText={(text) => onUpdateField("donationCount", parseInt(text, 10) || 0)}
            placeholder="Enter number of times"
            keyboardType="numeric"
          />

          <Field
            label={t("donation.questions.lastDonationDate")}
            value={formData.lastDonationDate || ""}
            onChangeText={(text) => onUpdateField("lastDonationDate", text)}
            placeholder="DD/MM/YYYY"
          />

          <YesNoToggle
            label={t("donation.questions.anyDifficulty")}
            value={formData.anyDifficulty}
            onChange={(val) => onUpdateField("anyDifficulty", val)}
          />

          {formData.anyDifficulty && (
            <Field
              label={t("donation.descriptions.anyDifficulty")}
              value={formData.difficultyDetails || ""}
              onChangeText={(text) => onUpdateField("difficultyDetails", text)}
              placeholder="Please describe the difficulty"
              multiline
              numberOfLines={3}
            />
          )}
        </>
      )}

      <YesNoToggle
        label={t("donation.questions.medicalAdvice")}
        value={formData.medicalAdvice}
        onChange={(val) => onUpdateField("medicalAdvice", val)}
      />

      <YesNoToggle
        label={t("donation.questions.readInformationLeaflet")}
        value={formData.readInformationLeaflet}
        onChange={(val) => onUpdateField("readInformationLeaflet", val)}
      />
    </View>
  );
};

export default Step1;
