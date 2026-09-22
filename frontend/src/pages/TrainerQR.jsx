import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { AUTH_TOKEN_KEY } from "../api/api";

const TrnrQR = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const [qrUrl, setQrUrl] = useState("");
    const [expiresAt, setExpiresAt] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const createQr = async () => {
            try {
                const { data } = await api.get("/trainer/qr");
                if (!mounted) return;

                setExpiresAt(data.expiresAt);
                setSecondsLeft(Math.ceil((data.expiresAt - Date.now()) / 1000));
                setQrUrl(
                    `${window.location.origin}/StudentLogin?qrToken=${encodeURIComponent(data.token)}`,
                );
            } catch (requestError) {
                if (!mounted) return;
                if (requestError.response?.status === 401) {
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    navigate("/TrainerLogin");
                    return;
                }
                setError("Unable to create the attendance QR code.");
            }
        };

        createQr();
        return () => {
            mounted = false;
        };
    }, [navigate, search]);

    useEffect(() => {
        if (!expiresAt) return undefined;

        const timer = window.setInterval(() => {
            setSecondsLeft(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [expiresAt]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = String(secondsLeft % 60).padStart(2, "0");

    return (
        <div>
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F3F0E7] px-4">
                <div className="rounded-2xl bg-white p-6 shadow-lg shadow-[#8A0149]/10">
                    {qrUrl && secondsLeft > 0 ? (
                        <QRCodeSVG value={qrUrl} size={220} fgColor="#8A0149" bgColor="#FFFFFF" level="M" />
                    ) : (
                        <p className="flex h-[220px] w-[220px] items-center justify-center text-center text-sm text-gray-600">
                            {error || "Creating QR code..."}
                        </p>
                    )}
                </div>
                <p className="text-sm font-semibold text-[#8A0149]">
                    {secondsLeft > 0 ? `Valid for ${minutes}:${seconds}` : "QR code expired"}
                </p>
            </div>
        </div>

    )
}
export default TrnrQR