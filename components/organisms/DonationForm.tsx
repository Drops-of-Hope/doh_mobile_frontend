import React, { useState } from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import { styled } from "nativewind";
import DonationQuestions from "../molecules/Donation/DonationQuestions";
import LanguageTabs from "../molecules/LanguageTabs";
import Button from "../atoms/Button";
import {
  DonationFormData,
  donationService,
} from "../../app/services/donationService";
import { useLanguage } from "../../app/context/LanguageContext";

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

interface DonationFormProps {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({
  onSubmitSuccess,
  onCancel,
}) => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [formLanguage, setFormLanguage] = useState<'en' | 'si' | 'ta'>(currentLanguage);
  const [formData, setFormData] = useState<DonationFormData>({
    anyDifficulty: false,
    medicalAdvice: false,
    feelingWell: true, // Default to true as most people feel well
    takingMedicines: false,
    anySurgery: false,
    pregnant: false,
    haveHepatitis: false,
    tattoos: false,
    travelledAbroad: false,
    receivedBlood: false,
    chemotherapy: false,
    bookAspin: false,
    knowledgeAgent: false,
    feverLymphNode: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = async (language: 'en' | 'si' | 'ta') => {
    setFormLanguage(language);
    await setLanguage(language);
  };

  const handleUpdateField = (field: keyof DonationFormData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    // Check for conditions that might disqualify donation
    const disqualifyingConditions = [
      "anyDifficulty",
      "medicalAdvice",
      "takingMedicines",
      "anySurgery",
      "pregnant",
      "haveHepatitis",
      "tattoos",
      "travelledAbroad",
      "receivedBlood",
      "chemotherapy",
      "bookAspin",
      "knowledgeAgent",
      "feverLymphNode",
    ];

    const hasDisqualifyingCondition = disqualifyingConditions.some(
      (condition) => formData[condition as keyof DonationFormData]
    );

    if (hasDisqualifyingCondition || !formData.feelingWell) {
      Alert.alert(
        t('donation.validation_error'),
        "Based on your responses, you may not be eligible to donate blood at this time. Please consult with medical staff for further evaluation.",
        [{ text: t('common.ok') }]
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await donationService.submitDonationForm(formData);
      Alert.alert(
        t('donation.submit_success'),
        "Your donation form has been submitted. You are eligible to donate blood!",
        [
          {
            text: t('common.ok'),
            onPress: onSubmitSuccess,
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        t('donation.submit_error'),
        "Failed to submit your donation form. Please try again.",
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white">
      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <StyledView className="p-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {t('donation.form_title')}
          </Text>
          <Text className="text-gray-600 mb-4">
            {t('donation.form_subtitle')}
          </Text>
          
          {/* Language Tabs */}
          <LanguageTabs 
            currentLanguage={formLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </StyledView>

        <DonationQuestions
          formData={formData}
          onUpdateField={handleUpdateField}
        />

        <StyledView className="p-4 pb-8">
          <Button
            title={isSubmitting ? t('common.loading') : t('common.submit')}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />

          {onCancel && (
            <StyledView className="mt-3">
              <Button title={t('common.cancel')} onPress={onCancel} variant="outline" />
            </StyledView>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
};

export default DonationForm;
