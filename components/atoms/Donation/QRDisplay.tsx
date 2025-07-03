import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import QRCode from "react-native-qrcode-svg";

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
  // Create QR code data
  const qrData = JSON.stringify({
    name: userName,
    email: userEmail,
    uid: userUID,
    timestamp: new Date().toISOString(),
  });

  return (
    <StyledView className="flex-1 bg-white justify-center items-center p-8">
      <StyledView className="bg-white p-8 rounded-2xl shadow-lg items-center">
        <StyledText className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {userName}
        </StyledText>
        <StyledText className="text-base text-gray-600 mb-6 text-center">
          {userEmail}
        </StyledText>

        <StyledView className="bg-gray-100 p-8 rounded-xl border border-gray-200 items-center justify-center">
          {/* Real QR Code */}
          <QRCode
            value={qrData}
            size={240}
            color="black"
            backgroundColor="white"
          />
        </StyledView>

        <StyledText className="text-sm text-gray-500 mt-4 text-center">
          UID: {userUID}
        </StyledText>
        <StyledText className="text-xs text-gray-400 mt-2 text-center max-w-xs">
          Scan this QR code to view donor information
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default QRDisplay;
