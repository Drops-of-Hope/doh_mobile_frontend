import React, { useState } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageTabs from "../molecules/LanguageTabs";
import {
  DonationFormData,
  donationService,
} from "../../../services/donationService";
import { useLanguage } from "../../../context/LanguageContext";
import { Text, Button, ProgressTrack, AppBar, useTheme } from "../../../design";

// Import step components
import Step1 from "../molecules/Donation/Steps/Step1";
import Step2 from "../molecules/Donation/Steps/Step2";
import Step3 from "../molecules/Donation/Steps/Step3";
import Step4 from "../molecules/Donation/Steps/Step4";
import Step5 from "../molecules/Donation/Steps/Step5";
import Step6 from "../molecules/Donation/Steps/Step6";

import { logger } from "../../../utils/logger";

interface DonationFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  appointmentId?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({
  onSubmitSuccess,
  onCancel,
  appointmentId,
}) => {
  const theme = useTheme();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [formLanguage, setFormLanguage] = useState<"en" | "si" | "ta">(
    currentLanguage
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DonationFormData>({
    // Step 1: Previous donation history
    hasDonatedBefore: false,
    donationCount: 0,
    lastDonationDate: "",
    anyDifficulty: false,
    difficultyDetails: "",
    medicalAdvice: false,
    readInformationLeaflet: false,

    // Step 2: Current health status
    feelingWell: true,
    medicalConditions: {},
    takingMedicines: false,
    anySurgery: false,
    workingLater: false,
    pregnant: false,
    breastFeeding: false,
    recentChildbirth: false,

    // Step 3: Past illnesses
    haveHepatitis: false,
    haveTB: false,
    hadTyphoid: false,

    // Step 4: Past 12 months activities
    hadVaccination: false,
    tattoos: false,
    haveImprisonment: false,
    travelledAbroad: false,
    partnerTravelledAbroad: false,
    receivedBlood: false,
    partnerReceivedBlood: false,
    hadMalaria: false,

    // Step 5: Recent illnesses
    hasDengue: false,
    hadLongFever: false,
    hadChickenPox: false,
    hadMeasles: false,
    hadMumps: false,
    hadRubella: false,
    hadDiarrhoea: false,
    hadtoothExtraction: false,
    bookAspirin: false,
    tookAntibiotics: false,
    tookOtherMedicine: false,

    // Step 6: High-risk categories and declaration
    knowledgeAgent: false,
    highRisk: false,
    feverLymphNode: false,
    hadWeightLoss: false,
    Acknowledgement: false, // Mandatory donor declaration
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 6;

  const handleLanguageChange = async (language: "en" | "si" | "ta") => {
    setFormLanguage(language);
    await setLanguage(language);
  };

  const handleUpdateField = (field: keyof DonationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.readInformationLeaflet) {
          Alert.alert(t("common.error"), t("donation.validation_error"));
          return false;
        }
        if (
          formData.hasDonatedBefore &&
          (!formData.donationCount || !formData.lastDonationDate)
        ) {
          Alert.alert(t("common.error"), t("donation.validation_error"));
          return false;
        }
        break;
      case 2:
        if (!formData.feelingWell) {
          Alert.alert(t("common.error"), t("donation.submit_error"));
          return false;
        }
        break;
      case 6:
        if (!formData.Acknowledgement) {
          Alert.alert(
            t("common.error"),
            t("donation.declaration_required_error")
          );
          return false;
        }
        break;
    }
    return true;
  };

  const validateForm = (): boolean => {
    // Check for conditions that might disqualify donation
    const disqualifyingConditions = [
      formData.medicalAdvice,
      formData.takingMedicines && formData.anySurgery, // Both surgery and medicines
      formData.pregnant || formData.breastFeeding || formData.recentChildbirth,
      formData.haveHepatitis,
      formData.haveTB,
      formData.highRisk,
      formData.feverLymphNode,
      formData.hadWeightLoss,
    ];

    const hasDisqualifyingCondition = disqualifyingConditions.some(
      (condition) => condition
    );

    if (hasDisqualifyingCondition || !formData.feelingWell) {
      Alert.alert(
        "Eligibility Concern",
        "Based on your responses, you may not be eligible to donate blood at this time. Please consult with medical staff for further evaluation.",
        [{ text: "OK" }]
      );
      return false;
    }

    if (!formData.Acknowledgement) {
      Alert.alert(
        "Declaration Required",
        "You must acknowledge and agree to the donor declaration to submit the form.",
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit to API - throw error if it fails
      await donationService.submitDonationForm(formData, appointmentId);

      // Single confirmation message on success
      Alert.alert(
        t("common.success"),
        "Your donation form has been submitted successfully. Thank you for your contribution!",
        [
          {
            text: t("common.ok"),
            onPress: onSubmitSuccess,
          },
        ],
      );
    } catch (error) {
      logger.error("Donation form submission error:", error);
      Alert.alert(
        t("common.error"),
        "Failed to submit donation form. Please try again.",
        [{ text: t("common.ok") }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      formData,
      onUpdateField: handleUpdateField,
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      case 4:
        return <Step4 {...commonProps} />;
      case 5:
        return <Step5 {...commonProps} />;
      case 6:
        return <Step6 {...commonProps} />;
      default:
        return <Step1 {...commonProps} />;
    }
  };

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.color.paper }]} edges={["top", "bottom"]}>
      <AppBar title={t("donation.form_title")} onBack={onCancel} />

      <View style={styles.progressWrap}>
        <View style={styles.progressHeader}>
          <Text variant="label" tone="inkMuted">
            Step {currentStep} of {totalSteps}
          </Text>
          <LanguageTabs currentLanguage={formLanguage} onLanguageChange={handleLanguageChange} />
        </View>
        <ProgressTrack progress={currentStep / totalSteps} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.color.hairline, backgroundColor: theme.color.paper }]}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {currentStep > 1 && (
            <View style={{ flex: 1 }}>
              <Button
                title={t("donation.buttons.previous")}
                onPress={handlePrevious}
                variant="outline"
              />
            </View>
          )}

          {currentStep < totalSteps ? (
            <View style={{ flex: 1 }}>
              <Button title={t("donation.buttons.next")} onPress={handleNext} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <Button
                title={isSubmitting ? t("campaign.submitting") : t("common.submit")}
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting || !formData.Acknowledgement}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  content: { padding: 20, paddingBottom: 32 },
  footer: {
    borderTopWidth: 1.5,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
});

export default DonationForm;
