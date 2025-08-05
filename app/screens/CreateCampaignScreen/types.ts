export interface LocalCampaignForm {
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  donationGoal: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements: string;
  additionalNotes: string;
}

export interface CreateCampaignScreenProps {
  navigation?: any;
}

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  error?: string;
  required?: boolean;
}

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  title: string;
}
