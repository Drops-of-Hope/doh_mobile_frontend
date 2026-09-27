import React from "react";
import { View } from "react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Text } from "../../../../../design";
import YesNoToggle from "../YesNoToggle";

interface Step5Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step5: React.FC<Step5Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();

  return (
    <View>
      <Text variant="h2" style={{ marginBottom: 8 }}>
        {t("donation.steps.step5_title")}
      </Text>
      <Text variant="body" tone="inkMuted" style={{ marginBottom: 16 }}>
        {t("donation.descriptions.recentIllnesses")}
      </Text>

      <YesNoToggle
        label={t("donation.questions.hasDengue")}
        value={formData.hasDengue}
        onChange={(val) => onUpdateField("hasDengue", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadLongFever")}
        value={formData.hadLongFever}
        onChange={(val) => onUpdateField("hadLongFever", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadChickenPox")}
        value={formData.hadChickenPox}
        onChange={(val) => onUpdateField("hadChickenPox", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadMeasles")}
        value={formData.hadMeasles}
        onChange={(val) => onUpdateField("hadMeasles", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadMumps")}
        value={formData.hadMumps}
        onChange={(val) => onUpdateField("hadMumps", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadRubella")}
        value={formData.hadRubella}
        onChange={(val) => onUpdateField("hadRubella", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadDiarrhoea")}
        value={formData.hadDiarrhoea}
        onChange={(val) => onUpdateField("hadDiarrhoea", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadtoothExtraction")}
        value={formData.hadtoothExtraction}
        onChange={(val) => onUpdateField("hadtoothExtraction", val)}
      />

      <YesNoToggle
        label={t("donation.questions.bookAspirin")}
        value={formData.bookAspirin}
        onChange={(val) => onUpdateField("bookAspirin", val)}
      />

      <YesNoToggle
        label={t("donation.questions.tookAntibiotics")}
        value={formData.tookAntibiotics}
        onChange={(val) => onUpdateField("tookAntibiotics", val)}
      />

      <YesNoToggle
        label={t("donation.questions.tookOtherMedicine")}
        value={formData.tookOtherMedicine}
        onChange={(val) => onUpdateField("tookOtherMedicine", val)}
      />
    </View>
  );
};

export default Step5;
