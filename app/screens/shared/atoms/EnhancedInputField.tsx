import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../../../../constants/theme';

interface EnhancedInputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  helpText?: string;
  containerStyle?: any;
  inputStyle?: any;
}

const EnhancedInputField: React.FC<EnhancedInputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  helpText,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle
        ]}
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {helpText && !error && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  required: {
    color: COLORS.ERROR,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  inputError: {
    borderColor: COLORS.ERROR,
    borderWidth: 2,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  helpText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginTop: 4,
  },
});

export default EnhancedInputField;