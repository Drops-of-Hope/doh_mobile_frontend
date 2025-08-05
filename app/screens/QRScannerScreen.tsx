import React from "react";
import QRScannerScreenComponent from "./QRScannerScreen/screen";

interface QRScannerScreenProps {
  navigation?: any;
  route?: any;
}

export default function QRScannerScreen(props: QRScannerScreenProps) {
  return <QRScannerScreenComponent {...props} />;
}
