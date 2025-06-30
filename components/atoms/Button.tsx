import { Pressable, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export default function Button({ title, onPress, disabled = false, variant = 'primary' }: ButtonProps) {
  const buttonStyle = [
    styles.button,
    variant === 'outline' ? styles.outlineButton : styles.primaryButton,
    disabled ? styles.disabledButton : null,
  ];

  const textStyle = [
    styles.text,
    variant === 'outline' ? styles.outlineText : styles.primaryText,
    disabled ? styles.disabledText : null,
  ];

  return (
    <Pressable 
      style={buttonStyle} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#ff0000',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    borderColor: '#cccccc',
  },
  text: {
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
  },
  outlineText: {
    color: '#ff0000',
  },
  disabledText: {
    color: '#999999',
  },
});
