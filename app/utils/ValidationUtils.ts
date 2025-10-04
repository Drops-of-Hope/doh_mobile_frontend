// Validation utilities for forms based on Prisma schema requirements
export const ValidationUtils = {
  // Phone number validation: Sri Lankan mobile numbers starting with 0 and 10 digits total
  validatePhoneNumber: (phone: string): { isValid: boolean; error?: string } => {
    if (!phone.trim()) {
      return { isValid: false, error: "Phone number is required" };
    }
    
    // Remove any spaces or special characters for validation
    const cleanPhone = phone.replace(/\s+/g, '');
    
    // Sri Lankan phone number pattern: 0XXXXXXXXX (10 digits starting with 0)
    const phoneRegex = /^0[0-9]{9}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      return { 
        isValid: false, 
        error: "Phone number must be 10 digits starting with 0 (e.g., 0771234567)" 
      };
    }
    
    return { isValid: true };
  },

  // Email validation according to standard email format
  validateEmail: (email: string): { isValid: boolean; error?: string } => {
    if (!email.trim()) {
      return { isValid: false, error: "Email is required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }
    
    return { isValid: true };
  },

  // NIC validation for Sri Lankan NICs (old and new format)
  validateNIC: (nic: string): { isValid: boolean; error?: string } => {
    if (!nic.trim()) {
      return { isValid: false, error: "NIC is required" };
    }
    
    const cleanNIC = nic.trim().toUpperCase();
    
    // Old format: 9 digits + V/X (e.g., 123456789V)
    // New format: 12 digits (e.g., 123456789012)
    const oldNICRegex = /^[0-9]{9}[VX]$/;
    const newNICRegex = /^[0-9]{12}$/;
    
    if (!oldNICRegex.test(cleanNIC) && !newNICRegex.test(cleanNIC)) {
      return { 
        isValid: false, 
        error: "Please enter a valid NIC (9 digits + V/X or 12 digits)" 
      };
    }
    
    return { isValid: true };
  },

  // Name validation (required, min length, no special characters except spaces)
  validateName: (name: string, fieldName: string = "Name"): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }
    
    // Allow only letters, spaces, and common name characters
    const nameRegex = /^[A-Za-z\s'-\.]+$/;
    
    if (!nameRegex.test(name.trim())) {
      return { 
        isValid: false, 
        error: `${fieldName} can only contain letters, spaces, apostrophes, and hyphens` 
      };
    }
    
    return { isValid: true };
  },

  // Address validation (required, min length)
  validateAddress: (address: string): { isValid: boolean; error?: string } => {
    if (!address.trim()) {
      return { isValid: false, error: "Address is required" };
    }
    
    if (address.trim().length < 10) {
      return { isValid: false, error: "Please enter a complete address (minimum 10 characters)" };
    }
    
    return { isValid: true };
  },

  // Blood group validation (must match Prisma enum values)
  validateBloodGroup: (bloodGroup: string): { isValid: boolean; error?: string } => {
    if (!bloodGroup.trim()) {
      return { isValid: false, error: "Blood group is required" };
    }
    
    const validBloodGroups = [
      'A_POSITIVE', 'A_NEGATIVE', 
      'B_POSITIVE', 'B_NEGATIVE', 
      'AB_POSITIVE', 'AB_NEGATIVE', 
      'O_POSITIVE', 'O_NEGATIVE'
    ];
    
    if (!validBloodGroups.includes(bloodGroup)) {
      return { isValid: false, error: "Please select a valid blood group" };
    }
    
    return { isValid: true };
  },

  // District validation (must match Prisma enum values)
  validateDistrict: (district: string): { isValid: boolean; error?: string } => {
    if (!district.trim()) {
      return { isValid: false, error: "District is required" };
    }
    
    const validDistricts = [
      'COLOMBO', 'KALUTARA', 'GAMPAHA', 'GALLE', 'MATARA', 'HAMBANTOTA',
      'ANURADHAPURA', 'POLONNARUWA', 'JAFFNA', 'MANNAR', 'KILINOCHCHI',
      'KURUNEGALA', 'PUTTALAM', 'TRINCOMALEE', 'BATTICALOA', 'AMPARA',
      'BADULLA', 'KANDY', 'KEGALLE', 'MATALE', 'NUWARA_ELIYA', 'MONARAGALA',
      'MULLAITIVU', 'VAVUNIYA', 'RATNAPURA'
    ];
    
    if (!validDistricts.includes(district)) {
      return { isValid: false, error: "Please select a valid district" };
    }
    
    return { isValid: true };
  },

  // City validation (required, reasonable length)
  validateCity: (city: string): { isValid: boolean; error?: string } => {
    if (!city.trim()) {
      return { isValid: false, error: "City is required" };
    }
    
    if (city.trim().length < 2) {
      return { isValid: false, error: "City name must be at least 2 characters long" };
    }
    
    // Allow only letters, spaces, and common city name characters
    const cityRegex = /^[A-Za-z\s'-\.]+$/;
    
    if (!cityRegex.test(city.trim())) {
      return { 
        isValid: false, 
        error: "City name can only contain letters, spaces, apostrophes, and hyphens" 
      };
    }
    
    return { isValid: true };
  },

  // Utility function to format phone number for display
  formatPhoneNumber: (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Format as 0XX XXX XXXX for Sri Lankan numbers
    if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
      return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    
    return phone;
  },

  // Utility function to clean phone number for storage
  cleanPhoneNumber: (phone: string): string => {
    return phone.replace(/\D/g, '');
  },

  // Comprehensive form validation
  validateForm: (data: Record<string, any>, requiredFields: string[]): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Apply specific validations based on field names
    if (data.email) {
      const emailValidation = ValidationUtils.validateEmail(data.email);
      if (!emailValidation.isValid && emailValidation.error) {
        errors.email = emailValidation.error;
      }
    }
    
    if (data.phoneNumber) {
      const phoneValidation = ValidationUtils.validatePhoneNumber(data.phoneNumber);
      if (!phoneValidation.isValid && phoneValidation.error) {
        errors.phoneNumber = phoneValidation.error;
      }
    }
    
    if (data.nic) {
      const nicValidation = ValidationUtils.validateNIC(data.nic);
      if (!nicValidation.isValid && nicValidation.error) {
        errors.nic = nicValidation.error;
      }
    }
    
    if (data.name || data.firstName || data.lastName) {
      const nameField = data.name ? 'name' : data.firstName ? 'firstName' : 'lastName';
      const nameValue = data[nameField];
      const nameValidation = ValidationUtils.validateName(nameValue, nameField);
      if (!nameValidation.isValid && nameValidation.error) {
        errors[nameField] = nameValidation.error;
      }
    }
    
    if (data.address) {
      const addressValidation = ValidationUtils.validateAddress(data.address);
      if (!addressValidation.isValid && addressValidation.error) {
        errors.address = addressValidation.error;
      }
    }
    
    if (data.city) {
      const cityValidation = ValidationUtils.validateCity(data.city);
      if (!cityValidation.isValid && cityValidation.error) {
        errors.city = cityValidation.error;
      }
    }
    
    if (data.bloodGroup) {
      const bloodGroupValidation = ValidationUtils.validateBloodGroup(data.bloodGroup);
      if (!bloodGroupValidation.isValid && bloodGroupValidation.error) {
        errors.bloodGroup = bloodGroupValidation.error;
      }
    }
    
    if (data.district) {
      const districtValidation = ValidationUtils.validateDistrict(data.district);
      if (!districtValidation.isValid && districtValidation.error) {
        errors.district = districtValidation.error;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default ValidationUtils;