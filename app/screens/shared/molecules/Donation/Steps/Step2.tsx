import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { DonationFormData } from "../../../../../services/donationService";
import { useLanguage } from "../../../../../context/LanguageContext";
import { Text, Surface, Icon, useTheme } from "../../../../../design";
import YesNoToggle from "../YesNoToggle";

interface Step2Props {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const Step2: React.FC<Step2Props> = ({ formData, onUpdateField }) => {
  const { t } = useLanguage();
  const theme = useTheme();

  const medicalConditions = [
    { key: "heartDisease", label: t("donation.medicalConditions.heartDisease") },
    { key: "strokes", label: t("donation.medicalConditions.strokes") },
    { key: "kidneyDiseases", label: t("donation.medicalConditions.kidneyDiseases") },
    { key: "diabetes", label: t("donation.medicalConditions.diabetes") },
    { key: "fits", label: t("donation.medicalConditions.fits") },
    { key: "liverDiseases", label: t("donation.medicalConditions.liverDiseases") },
    { key: "asthmaLungDisease", label: t("donation.medicalConditions.asthmaLungDisease") },
    { key: "bloodDisorders", label: t("donation.medicalConditions.bloodDisorders") },
    { key: "cancer", label: t("donation.medicalConditions.cancer") },
  ];

  const toggleMedicalCondition = (conditionKey: string) => {
    const currentConditions = formData.medicalConditions || {};
    const updatedConditions = {
      ...currentConditions,
      [conditionKey]: !currentConditions[conditionKey as keyof typeof currentConditions],
    };
    onUpdateField("medicalConditions", updatedConditions);
  };

  return (
    <View>
      <Text variant="h2" style={{ marginBottom: 16 }}>
        {t("donation.steps.step2_title")}
      </Text>

      <YesNoToggle
        label={t("donation.questions.feelingWell")}
        value={formData.feelingWell}
        onChange={(val) => onUpdateField("feelingWell", val)}
      />

      <Text variant="label" tone="inkMuted" style={{ marginBottom: 8 }}>
        {t("donation.descriptions.medicalConditionsHeader")}
      </Text>

      <Surface tone="sunken" padding="sm" style={{ marginBottom: 18 }}>
        {medicalConditions.map((condition, index) => {
          const isChecked =
            formData.medicalConditions?.[condition.key as keyof typeof formData.medicalConditions] || false;
          return (
            <Pressable
              key={condition.key}
              onPress={() => toggleMedicalCondition(condition.key)}
              style={[
                styles.row,
                index < medicalConditions.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.color.hairline,
                },
              ]}
            >
              <Text variant="body">{condition.label}</Text>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isChecked ? theme.color.crimson : theme.color.hairlineStrong,
                    backgroundColor: isChecked ? theme.color.crimson : "transparent",
                    borderRadius: theme.radius.sm,
                  },
                ]}
              >
                {isChecked ? <Icon icon={Check} size={14} color={theme.color.inverse} /> : null}
              </View>
            </Pressable>
          );
        })}
      </Surface>

      <YesNoToggle
        label={t("donation.questions.takingMedicines")}
        value={formData.takingMedicines}
        onChange={(val) => onUpdateField("takingMedicines", val)}
      />

      <YesNoToggle
        label={t("donation.questions.anySurgery")}
        value={formData.anySurgery}
        onChange={(val) => onUpdateField("anySurgery", val)}
      />

      <YesNoToggle
        label={t("donation.questions.workingLater")}
        value={formData.workingLater}
        onChange={(val) => onUpdateField("workingLater", val)}
      />

      <YesNoToggle
        label={t("donation.questions.pregnant")}
        value={formData.pregnant}
        onChange={(val) => onUpdateField("pregnant", val)}
      />

      <YesNoToggle
        label={t("donation.questions.breastFeeding")}
        value={formData.breastFeeding}
        onChange={(val) => onUpdateField("breastFeeding", val)}
      />

      <YesNoToggle
        label={t("donation.questions.recentChildbirth")}
        value={formData.recentChildbirth}
        onChange={(val) => onUpdateField("recentChildbirth", val)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Step2;
