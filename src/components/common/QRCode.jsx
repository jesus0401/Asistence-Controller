import { QRCodeSVG } from "qrcode.react";

export default function QRCode({ url }) {
  const qrUrl = url || `${window.location.origin}/?qr=1`;
  
  return (
    <QRCodeSVG
      value={qrUrl}
      size={180}
      bgColor="#ffffff"
      fgColor="#000000"
      level="M"
    />
  );
}
