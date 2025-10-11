import React from "react";
import { View, Text, Switch } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface BooleanQuestionProps {
  question: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

const BooleanQuestion: React.FC<BooleanQuestionProps> = ({
  question,
  value,
  onValueChange,
  description,
}) => {
  return (
    <StyledView className="bg-white p-4 mb-3 rounded-lg border border-gray-200">
      <StyledView className="flex-row justify-between items-center">
        <StyledView className="flex-1 mr-4">
          <StyledText className="text-base font-medium text-gray-900 mb-1">
            {question}
          </StyledText>
          {description && (
            <StyledText className="text-sm text-gray-600">
              {description}
            </StyledText>
          )}
        </StyledView>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#f3f4f6", true: "#dc2626" }}
          thumbColor={value ? "#ffffff" : "#ffffff"}
        />
      </StyledView>
    </StyledView>
  );
};

export default BooleanQuestion;
