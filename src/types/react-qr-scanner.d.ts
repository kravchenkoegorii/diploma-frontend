declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrReaderProps {
    delay?: number;
    onScan: (data: { text: string } | null) => void;
    onError?: (error: Error) => void;
    style?: React.CSSProperties;
    facingMode?: 'user' | 'environment';
    constraints?: MediaTrackConstraints;
  }

  export default class QrReader extends Component<QrReaderProps> {}
}
