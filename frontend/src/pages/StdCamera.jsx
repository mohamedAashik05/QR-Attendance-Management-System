import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QRScanner = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {
        /* already stopped */
      }
    }
    setScanning(false);
  };

  const handleScan = async (text) => {
    await stopScanner();
    try {
      const url = new URL(text);
      if (url.origin === window.location.origin) {
        navigate(url.pathname + url.search); // e.g. /student-login
      } else {
        window.location.href = url.href; // external link
      }
    } catch {
      setError("This QR code doesn't contain a valid link.");
    }
  };

  const startScanner = async () => {
    setError("");
    setScanning(true);

    try {
      if (!window.isSecureContext) {
        throw new Error("Camera access requires HTTPS or localhost.");
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser does not support camera access.");
      }

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const scannerConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
      const startOptions = [{ facingMode: "environment" }, { facingMode: "user" }];
      let lastError;

      for (const cameraConfig of startOptions) {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        try {
          await scanner.start(cameraConfig, scannerConfig, handleScan, () => {});
          return;
        } catch (err) {
          lastError = err;
          scannerRef.current = null;
          try {
            scanner.clear();
          } catch {
            // The scanner may not have initialized enough to clear.
          }
        }
      }

      const cameras = await Html5Qrcode.getCameras();
      for (const camera of cameras) {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        try {
          await scanner.start(camera.id, scannerConfig, handleScan, () => {});
          return;
        } catch (err) {
          lastError = err;
          scannerRef.current = null;
          try {
            scanner.clear();
          } catch {
            // The scanner may not have initialized enough to clear.
          }
        }
      }

      throw lastError ?? new Error("No camera was found on this device.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown camera error";
      console.error("Camera startup failed:", err);
      await stopScanner();
      setScanning(false);
      setError(`Could not open the camera: ${message}`);
    }
  };

  // stop the camera if the user leaves the page
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F3F0E7] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white/60 p-6 shadow-lg shadow-[#8A0149]/10">
        <div
          id="qr-reader"
          className={`overflow-hidden rounded-xl ${scanning ? "block" : "hidden"}`}
        />

        {!scanning && (
          <p className="py-10 text-center text-sm text-gray-600">
            Tap the button to open the camera and scan the QR code.
          </p>
        )}

        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-700">{error}</p>
        )}
      </div>

      {!scanning ? (
        <button
          onClick={startScanner}
          className="rounded-full bg-[#8A0149] px-14 py-3 font-semibold tracking-wide text-white
                     shadow-lg shadow-[#8A0149]/40
                     hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#8A0149]/50
                     active:translate-y-0 transition-all duration-200"
        >
          Scan QR Code
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="rounded-full border-2 border-[#8A0149] px-14 py-3 font-semibold text-[#8A0149]
                     hover:bg-[#8A0149] hover:text-white transition-colors duration-200"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default QRScanner;