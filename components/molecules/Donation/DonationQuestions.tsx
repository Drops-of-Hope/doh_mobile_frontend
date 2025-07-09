import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
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
    <View style={{ backgroundColor: '#F9FAFB', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
        Health Questions
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
        Please answer YES or NO to each question:
      </Text>

      {questions.map((q) => (
        <View
          key={q.key}
          style={{
            backgroundColor: 'white',
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB'
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#1F2937', marginBottom: 4 }}>
                {q.question}
              </Text>
              {q.description && (
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  {q.description}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: formData[q.key] ? '#DC2626' : '#F3F4F6',
                  borderWidth: 1,
                  borderColor: formData[q.key] ? '#DC2626' : '#D1D5DB',
                }}
                onPress={() => onUpdateField(q.key, true)}
              >
                <Text style={{
                  color: formData[q.key] ? 'white' : '#6B7280',
                  fontWeight: '600',
                  fontSize: 14
                }}>
                  YES
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: !formData[q.key] ? '#DC2626' : '#F3F4F6',
                  borderWidth: 1,
                  borderColor: !formData[q.key] ? '#DC2626' : '#D1D5DB',
                }}
                onPress={() => onUpdateField(q.key, false)}
              >
                <Text style={{
                  color: !formData[q.key] ? 'white' : '#6B7280',
                  fontWeight: '600',
                  fontSize: 14
                }}>
                  NO
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default DonationQuestions;
