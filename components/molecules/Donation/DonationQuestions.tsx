import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import BooleanQuestion from "../../atoms/Donation/BooleanQuestion";
import { DonationFormData } from "../../../app/services/donationService";
import { useLanguage } from "../../../app/context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);

interface DonationQuestionsProps {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: boolean) => void;
}

const DonationQuestions: React.FC<DonationQuestionsProps> = ({
  formData,
  onUpdateField,
}) => {
  const { t } = useLanguage();
  
  const questions = [
    {
      key: "anyDifficulty" as keyof DonationFormData,
      question: t('donation.questions.anyDifficulty'),
      description: t('donation.descriptions.anyDifficulty'),
    },
    {
      key: "medicalAdvice" as keyof DonationFormData,
      question: t('donation.questions.medicalAdvice'),
      description: t('donation.descriptions.medicalAdvice'),
    },
    {
      key: "feelingWell" as keyof DonationFormData,
      question: t('donation.questions.feelingWell'),
      description: t('donation.descriptions.feelingWell'),
    },
    {
      key: "takingMedicines" as keyof DonationFormData,
      question: t('donation.questions.takingMedicines'),
      description: t('donation.descriptions.takingMedicines'),
    },
    {
      key: "anySurgery" as keyof DonationFormData,
      question: t('donation.questions.anySurgery'),
      description: t('donation.descriptions.anySurgery'),
    },
    {
      key: "pregnant" as keyof DonationFormData,
      question: t('donation.questions.pregnant'),
      description: t('donation.descriptions.pregnant'),
    },
    {
      key: "haveHepatitis" as keyof DonationFormData,
      question: t('donation.questions.haveHepatitis'),
      description: t('donation.descriptions.haveHepatitis'),
    },
    {
      key: "tattoos" as keyof DonationFormData,
      question: t('donation.questions.tattoos'),
      description: t('donation.descriptions.tattoos'),
    },
    {
      key: "travelledAbroad" as keyof DonationFormData,
      question: t('donation.questions.travelledAbroad'),
      description: t('donation.descriptions.travelledAbroad'),
    },
    {
      key: "receivedBlood" as keyof DonationFormData,
      question: t('donation.questions.receivedBlood'),
      description: t('donation.descriptions.receivedBlood'),
    },
    {
      key: "chemotherapy" as keyof DonationFormData,
      question: t('donation.questions.chemotherapy'),
      description: t('donation.descriptions.chemotherapy'),
    },
    {
      key: "bookAspin" as keyof DonationFormData,
      question: t('donation.questions.bookAspin'),
      description: t('donation.descriptions.bookAspin'),
    },
    {
      key: "knowledgeAgent" as keyof DonationFormData,
      question: t('donation.questions.knowledgeAgent'),
      description: t('donation.descriptions.knowledgeAgent'),
    },
    {
      key: "feverLymphNode" as keyof DonationFormData,
      question: t('donation.questions.feverLymphNode'),
      description: t('donation.descriptions.feverLymphNode'),
    },
  ];

  return (
    <StyledView className="bg-gray-50 p-4">
      <StyledText className="text-xl font-bold text-gray-900 mb-4">
        {t('donation.questionnaire_title')}
      </StyledText>
      <StyledText className="text-sm text-gray-600 mb-6">
        {t('donation.questionnaire_subtitle')}
      </StyledText>

      {questions.map((q) => (
        <BooleanQuestion
          key={q.key}
          question={q.question}
          description={q.description}
          value={formData[q.key]}
          onValueChange={(value) => onUpdateField(q.key, value)}
        />
      ))}
    </StyledView>
  );
};

export default DonationQuestions;
