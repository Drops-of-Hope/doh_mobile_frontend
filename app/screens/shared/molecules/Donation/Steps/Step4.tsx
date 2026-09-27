import React from "react";
import { View } from "react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Text } from "../../../../../design";
import YesNoToggle from "../YesNoToggle";

interface Step4Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step4: React.FC<Step4Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();

  return (
    <View>
      <Text variant="h2" style={{ marginBottom: 16 }}>
        {t("donation.steps.step4_title")}
      </Text>

      <YesNoToggle
        label={t("donation.questions.hadVaccination")}
        value={formData.hadVaccination}
        onChange={(val) => onUpdateField("hadVaccination", val)}
      />

      <YesNoToggle
        label={t("donation.questions.tattoos")}
        value={formData.tattoos}
        onChange={(val) => onUpdateField("tattoos", val)}
      />

      <YesNoToggle
        label={t("donation.questions.haveImprisonment")}
        value={formData.haveImprisonment}
        onChange={(val) => onUpdateField("haveImprisonment", val)}
      />

      <YesNoToggle
        label={t("donation.questions.travelledAbroad")}
        value={formData.travelledAbroad}
        onChange={(val) => onUpdateField("travelledAbroad", val)}
      />

      <YesNoToggle
        label={t("donation.questions.receivedBlood")}
        value={formData.receivedBlood}
        onChange={(val) => onUpdateField("receivedBlood", val)}
      />

      <YesNoToggle
        label={t("donation.questions.partnerReceivedBlood")}
        value={formData.partnerReceivedBlood}
        onChange={(val) => onUpdateField("partnerReceivedBlood", val)}
      />

      <YesNoToggle
        label={t("donation.questions.hadMalaria")}
        value={formData.hadMalaria}
        onChange={(val) => onUpdateField("hadMalaria", val)}
      />
    </View>
  );
};

export default Step4;
