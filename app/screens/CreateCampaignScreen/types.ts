export interface LocalCampaignForm {
  title: string;
  type: 'FIXED' | 'MOBILE' | '';
  description: string;
  motivation: string;
  location: string;
  day: string;
  month: string;
  year: string;
  startTime: string;
  endTime: string;
  expectedDonors: string;
  contactPersonName: string;
  contactPersonPhone: string;
  medicalEstablishmentId: string;
  requirements: string;
}

export interface FormErrors {
  title?: string;
  type?: string;
  description?: string;
  motivation?: string;
  location?: string;
  day?: string;
  month?: string;
  year?: string;
  startTime?: string;
  endTime?: string;
  expectedDonors?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
  medicalEstablishmentId?: string;
  requirements?: string;
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
  maxLength?: number;
}

export interface DropdownFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  error?: string;
  required?: boolean;
}

export interface DateSelectorProps {
  day: string;
  month: string;
  year: string;
  onDayChange: (day: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  error?: string;
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
