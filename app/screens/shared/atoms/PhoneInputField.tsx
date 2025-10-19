import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../../../../constants/theme';
import ValidationUtils from '../../../utils/ValidationUtils';

interface PhoneInputFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  helpText?: string;
  containerStyle?: any;
  inputStyle?: any;
  realTimeValidation?: boolean;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  helpText,
  containerStyle,
  inputStyle,
  realTimeValidation = true,
  ...textInputProps
}) => {
  const [internalError, setInternalError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    // Clean and format phone number
    const cleaned = text.replace(/\D/g, '');
    
    // Enforce Sri Lankan format: must start with 0 and be max 10 digits
    let formattedText = '';
    if (cleaned.length === 0) {
      formattedText = '';
    } else if (cleaned.startsWith('0')) {
      formattedText = cleaned.slice(0, 10);
    } else {
      // If user tries to type without 0, don't allow
      return;
    }

    // Format for display with spaces
    if (formattedText.length > 3 && formattedText.length <= 6) {
      formattedText = `${formattedText.slice(0, 3)} ${formattedText.slice(3)}`;
    } else if (formattedText.length > 6) {
      formattedText = `${formattedText.slice(0, 3)} ${formattedText.slice(3, 6)} ${formattedText.slice(6)}`;
    }

    onChangeText(formattedText);

    // Real-time validation
    if (realTimeValidation && formattedText.replace(/\s/g, '').length > 0) {
      const validation = ValidationUtils.validatePhoneNumber(formattedText.replace(/\s/g, ''));
      setInternalError(validation.isValid ? '' : validation.error || '');
    } else {
      setInternalError('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (realTimeValidation && value.replace(/\s/g, '').length > 0) {
      const validation = ValidationUtils.validatePhoneNumber(value.replace(/\s/g, ''));
      setInternalError(validation.isValid ? '' : validation.error || '');
    }
  };

  const displayError = error || internalError;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TextInput
        style={[
          styles.input,
          displayError && styles.inputError,
          isFocused && styles.inputFocused,
          inputStyle
        ]}
        value={value}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        keyboardType="phone-pad"
        placeholder="0XX XXX XXXX"
        placeholderTextColor={COLORS.TEXT_MUTED}
        maxLength={12} // Account for spaces in formatting
        {...textInputProps}
      />
      
      {displayError && (
        <Text style={styles.errorText}>{displayError}</Text>
      )}
      
      {helpText && !displayError && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
      
      {!helpText && !displayError && (
        <Text style={styles.helpText}>Format: 0XX XXX XXXX (Sri Lankan mobile number)</Text>
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
  inputFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
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

export default PhoneInputField;