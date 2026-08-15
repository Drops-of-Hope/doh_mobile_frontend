import React from "react";
import { View } from "react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Text } from "../../../../../design";
import YesNoToggle from "../YesNoToggle";

interface Step3Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step3: React.FC<Step3Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();

  return (
    <View>
      <Text variant="h2" style={{ marginBottom: 16 }}>
        {t("donation.steps.step3_title")}
      </Text>

      <YesNoToggle
        label={t("donation.questions.haveHepatitis")}
        value={formData.haveHepatitis}
        onChange={(val) => onUpdateField("haveHepatitis", val)}
      />
      <YesNoToggle
        label={t("donation.questions.haveTB")}
        value={formData.haveTB}
        onChange={(val) => onUpdateField("haveTB", val)}
      />
      <YesNoToggle
        label={t("donation.questions.hadTyphoid")}
        value={formData.hadTyphoid}
        onChange={(val) => onUpdateField("hadTyphoid", val)}
      />
    </View>
  );
};

export default Step3;
