import React, { useEffect, useRef, useState } from "react";
import Quagga from "@ericblade/quagga2";
import { BrowserMultiFormatReader } from "@zxing/browser";

type ScanResult = {
  text: string;
  format: string;
};

interface Props {
  onResult: (result: ScanResult) => void;
}

function LiveCameraScanner({ onResult }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const quaggaRef = useRef<HTMLDivElement>(null);
  const [activeLib, setActiveLib] = useState<"zxing" | "quagga" | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || !activeLib) return;

    // --- Quagga2 (1D barcodes) ---
    if (activeLib === "quagga") {
      if (!quaggaRef.current) return;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: quaggaRef.current, // ✅ container div
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "upc_e_reader",
              "code_128_reader",
            ],
          },
        },
        (err) => {
          if (err) {
            console.error("Quagga init error:", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((res) => {
        console.log("Quagga detected:", res);
        
        if (res?.codeResult?.code) {
          onResult({
            text: res.codeResult.code,
            format: res.codeResult.format,
          });
          Quagga.stop();
          setRunning(false);
        }
      });

      return () => {
        Quagga.offDetected(() => {}); // cleanup listener
        Quagga.stop();
      };
    }

    // --- ZXing (2D codes like QR/DataMatrix) ---
    if (activeLib === "zxing") {
      const reader = new BrowserMultiFormatReader();

      reader.decodeFromVideoDevice(undefined, videoRef.current!, (res, err) => {
        if (res) {
          onResult({
            text: res.getText(),
            format: res.getBarcodeFormat(),
          });
          reader.stopContinuousDecode(); // ✅ instead of reset()
          setRunning(false);
        }
      });

      return () => {
        reader.stopContinuousDecode();
      };
    }
  }, [running, activeLib, onResult]);

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 p-4">
      {/* Buttons to choose which scanner */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => {
            setActiveLib("quagga");
            setRunning(true);
          }}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Scan 1D (EAN/UPC/Code128)
        </button>
        <button
          onClick={() => {
            setActiveLib("zxing");
            setRunning(true);
          }}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Scan 2D (QR/DataMatrix)
        </button>
      </div>

      {/* Quagga mounts video here */}
      {activeLib === "quagga" && (
        <div
          ref={quaggaRef}
          style={{ width: "100%", height: "300px", borderRadius: "12px" }}
        />
      )}

      {/* ZXing uses this video element */}
      {activeLib === "zxing" && (
        <video
          ref={videoRef}
          style={{ width: "100%", borderRadius: "12px" }}
          muted
          autoPlay
        />
      )}
    </div>
  );
}

export default LiveCameraScanner;
