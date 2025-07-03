import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import BooleanQuestion from "../../atoms/Donation/BooleanQuestion";
import { DonationFormData } from "../../../app/services/donationService";

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
  const questions = [
    {
      key: "anyDifficulty" as keyof DonationFormData,
      question: "Do you have any difficulty in donating blood?",
      description: "Any physical or medical difficulties",
    },
    {
      key: "medicalAdvice" as keyof DonationFormData,
      question: "Are you under medical advice?",
      description: "Currently receiving medical treatment",
    },
    {
      key: "feelingWell" as keyof DonationFormData,
      question: "Are you feeling well today?",
      description: "General health and wellness",
    },
    {
      key: "takingMedicines" as keyof DonationFormData,
      question: "Are you taking any medicines?",
      description: "Any prescribed or over-the-counter medications",
    },
    {
      key: "anySurgery" as keyof DonationFormData,
      question: "Have you had any surgery recently?",
      description: "Surgery within the last 6 months",
    },
    {
      key: "pregnant" as keyof DonationFormData,
      question: "Are you pregnant or breastfeeding?",
      description: "For female donors only",
    },
    {
      key: "haveHepatitis" as keyof DonationFormData,
      question: "Do you have hepatitis?",
      description: "Any form of hepatitis infection",
    },
    {
      key: "tattoos" as keyof DonationFormData,
      question: "Have you got any tattoos or piercings recently?",
      description: "Within the last 12 months",
    },
    {
      key: "travelledAbroad" as keyof DonationFormData,
      question: "Have you travelled abroad recently?",
      description: "International travel within the last 3 months",
    },
    {
      key: "receivedBlood" as keyof DonationFormData,
      question: "Have you received blood transfusion?",
      description: "Blood transfusion within the last 12 months",
    },
    {
      key: "chemotherapy" as keyof DonationFormData,
      question: "Have you undergone chemotherapy?",
      description: "Cancer treatment history",
    },
    {
      key: "bookAspin" as keyof DonationFormData,
      question: "Have you taken aspirin recently?",
      description: "Within the last 3 days",
    },
    {
      key: "knowledgeAgent" as keyof DonationFormData,
      question: "Do you have knowledge of any infectious agent?",
      description: "Exposure to infectious diseases",
    },
    {
      key: "feverLymphNode" as keyof DonationFormData,
      question: "Do you have fever or swollen lymph nodes?",
      description: "Current symptoms of illness",
    },
  ];

  return (
    <StyledView className="bg-gray-50 p-4">
      <StyledText className="text-xl font-bold text-gray-900 mb-4">
        Donation Eligibility Questionnaire
      </StyledText>
      <StyledText className="text-sm text-gray-600 mb-6">
        Please answer all questions honestly. This information helps ensure the
        safety of both donors and recipients.
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
