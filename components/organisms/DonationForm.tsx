import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import DonationQuestions from '../molecules/Donation/DonationQuestions';
import Button from '../atoms/Button';
import { DonationFormData, donationService } from '../../app/services/donationService';

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

  const handleUpdateField = (field: keyof DonationFormData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    // Check for conditions that might disqualify donation
    const disqualifyingConditions = [
      'anyDifficulty',
      'medicalAdvice',
      'takingMedicines',
      'anySurgery',
      'pregnant',
      'haveHepatitis',
      'tattoos',
      'travelledAbroad',
      'receivedBlood',
      'chemotherapy',
      'bookAspin',
      'knowledgeAgent',
      'feverLymphNode',
    ];

    const hasDisqualifyingCondition = disqualifyingConditions.some(
      condition => formData[condition as keyof DonationFormData]
    );

    if (hasDisqualifyingCondition || !formData.feelingWell) {
      Alert.alert(
        'Donation Not Recommended',
        'Based on your responses, you may not be eligible to donate blood at this time. Please consult with medical staff for further evaluation.',
        [{ text: 'OK' }]
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
        'Form Submitted Successfully',
        'Your donation form has been submitted. You are eligible to donate blood!',
        [
          {
            text: 'OK',
            onPress: onSubmitSuccess,
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Submission Failed',
        'Failed to submit your donation form. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white">
      <StyledScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <DonationQuestions
          formData={formData}
          onUpdateField={handleUpdateField}
        />
        
        <StyledView className="p-4 pb-8">
          <Button
            title={isSubmitting ? "Submitting..." : "Submit Form"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
          
          {onCancel && (
            <StyledView className="mt-3">
              <Button
                title="Cancel"
                onPress={onCancel}
                variant="outline"
              />
            </StyledView>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
};

export default DonationForm;
