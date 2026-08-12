// QR Data Format Testing Utility
export const testQRFormats = (originalData: string) => {
  // Test different formats the backend might expect
  const testFormats = [
    // Format 1: Direct UUID
    originalData,
    
    // Format 2: JSON string with userId field
    JSON.stringify({ userId: originalData }),
    
    // Format 3: JSON string with id field  
    JSON.stringify({ id: originalData }),
    
    // Format 4: JSON string with userInfo
    JSON.stringify({ userInfo: { id: originalData } }),
    
    // Format 5: Base64 encoded
    btoa(originalData),
  ];
  
  return testFormats;
};