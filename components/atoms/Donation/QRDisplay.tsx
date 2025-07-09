import React from "react";
import { View, Text, Dimensions } from "react-native";
import { styled } from "nativewind";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from 'expo-linear-gradient';

const StyledView = styled(View);
const StyledText = styled(Text);

interface QRDisplayProps {
  userName: string;
  userEmail: string;
  userUID: string;
}

const QRDisplay: React.FC<QRDisplayProps> = ({
  userName,
  userEmail,
  userUID,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const qrSize = Math.min(screenWidth * 0.6, 280);
  
  // Create QR code data
  const qrData = JSON.stringify({
    name: userName,
    email: userEmail,
    uid: userUID,
    timestamp: new Date().toISOString(),
  });

  return (
    <StyledView className="flex-1 justify-center items-center p-6">
      {/* Background gradient */}
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      
      {/* Main QR Card */}
      <StyledView className="bg-white p-8 rounded-3xl shadow-2xl items-center mx-4 border border-gray-100">
        {/* Header Section */}
        <StyledView className="items-center mb-6">
          <StyledText className="text-2xl font-bold text-gray-900 mb-1 text-center">
            {userName}
          </StyledText>
          <StyledText className="text-base text-gray-600 text-center">
            {userEmail}
          </StyledText>
          <StyledView className="w-16 h-1 bg-red-500 rounded-full mt-3" />
        </StyledView>

        {/* QR Code Container with Enhanced Styling */}
        <StyledView className="relative items-center justify-center mb-6">
          {/* QR Background with border gradient */}
          <LinearGradient
            colors={['#dc2626', '#ef4444']}
            style={{
              padding: 3,
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <StyledView 
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 17,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <QRCode
                value={qrData}
                size={qrSize}
                color="#1f2937"
                backgroundColor="white"
                logoSize={qrSize * 0.15}
                logoBackgroundColor="white"
                logoMargin={4}
                logoBorderRadius={8}
              />
            </StyledView>
          </LinearGradient>
          
          {/* Corner decorations */}
          <StyledView className="absolute -top-2 -left-2 w-6 h-6">
            <StyledView className="w-4 h-1 bg-red-500 rounded-full" />
            <StyledView className="w-1 h-4 bg-red-500 rounded-full" />
          </StyledView>
          <StyledView className="absolute -top-2 -right-2 w-6 h-6">
            <StyledView className="w-4 h-1 bg-red-500 rounded-full ml-2" />
            <StyledView className="w-1 h-4 bg-red-500 rounded-full ml-5 -mt-4" />
          </StyledView>
          <StyledView className="absolute -bottom-2 -left-2 w-6 h-6">
            <StyledView className="w-1 h-4 bg-red-500 rounded-full" />
            <StyledView className="w-4 h-1 bg-red-500 rounded-full" />
          </StyledView>
          <StyledView className="absolute -bottom-2 -right-2 w-6 h-6">
            <StyledView className="w-1 h-4 bg-red-500 rounded-full ml-5" />
            <StyledView className="w-4 h-1 bg-red-500 rounded-full ml-2" />
          </StyledView>
        </StyledView>

        {/* Footer Section */}
        <StyledView className="items-center">
          <StyledView className="bg-gray-50 px-4 py-2 rounded-full mb-3">
            <StyledText className="text-sm font-medium text-gray-700">
              ID: {userUID}
            </StyledText>
          </StyledView>
          <StyledText className="text-xs text-gray-500 text-center max-w-xs leading-4">
            📱 Show this QR code to staff at the donation center for quick check-in
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default QRDisplay;
