import * as LocalAuthentication from "expo-local-authentication";
import { Fingerprint, Lock, RotateCcw, ScanFace, ShieldAlert } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Status = "checking" | "idle" | "authenticating" | "error" | "unsupported";
type BioType = "fingerprint" | "face";

interface Props {
    onSuccess: () => void;
}

export default function BiometricLock({ onSuccess }: Props) {
    const [status, setStatus] = useState<Status>("checking");
    const [errorMessage, setErrorMessage] = useState("");
    const [biometricType, setBiometricType] = useState<BioType>("fingerprint");
    const pulseAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            setStatus("unsupported");
            setErrorMessage(
                !hasHardware
                    ? "This device doesn't support biometric authentication."
                    : "No biometrics enrolled. Set up Face ID / fingerprint in your device settings."
            );
            return;
        }

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricType(
            types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
                ? "face"
                : "fingerprint"
        );

        setStatus("idle");
        authenticate();
    };

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    };

    const authenticate = useCallback(async () => {
        setStatus("authenticating");
        setErrorMessage("");
        startPulse();

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Unlock to access your dashboard",
                cancelLabel: "Cancel",
                fallbackLabel: "Use passcode",
                disableDeviceFallback: false,
            });

            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);

            if (result.success) {
                setStatus("idle");
                onSuccess?.();
            } else {
                setStatus("error");
                setErrorMessage("Authentication failed. Please try again.");
            }
        } catch {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
            setStatus("error");
            setErrorMessage("Something went wrong. Please try again.");
        }
    }, [onSuccess]);

    const Icon = biometricType === "face" ? ScanFace : Fingerprint;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Animated.View
                        style={[
                            styles.iconCircle,
                            status === "error" && styles.iconCircleError,
                            { transform: [{ scale: pulseAnim }] },
                        ]}
                    >
                        {status === "unsupported" || status === "error" ? (
                            <ShieldAlert size={48} color="#ef4444" strokeWidth={1.5} />
                        ) : (
                            <Icon size={48} color="#6366f1" strokeWidth={1.5} />
                        )}
                    </Animated.View>
                </View>

                <Text style={styles.title}>
                    {status === "unsupported"
                        ? "Biometrics Unavailable"
                        : status === "authenticating"
                        ? "Verifying..."
                        : status === "error"
                        ? "Authentication Failed"
                        : "Locked"}
                </Text>

                <Text style={styles.subtitle}>
                    {status === "unsupported" || status === "error"
                        ? errorMessage
                        : `Use ${biometricType === "face" ? "Face ID" : "your fingerprint"} to continue`}
                </Text>

                {(status === "error" || status === "idle") && (
                    <TouchableOpacity style={styles.retryButton} onPress={authenticate} activeOpacity={0.8}>
                        <RotateCcw size={16} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>
                )}

                {status === "unsupported" && (
                    <View style={styles.fallbackBadge}>
                        <Lock size={14} color="#9ca3af" />
                        <Text style={styles.fallbackText}>Passcode fallback recommended</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a" },
    content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
    iconWrapper: { marginBottom: 28 },
    iconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "rgba(99, 102, 241, 0.12)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(99, 102, 241, 0.25)",
    },
    iconCircleError: {
        backgroundColor: "rgba(239, 68, 68, 0.12)",
        borderColor: "rgba(239, 68, 68, 0.25)",
    },
    title: { color: "#f8fafc", fontSize: 20, fontWeight: "700", marginBottom: 8, textAlign: "center" },
    subtitle: { color: "#94a3b8", fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 28, paddingHorizontal: 12 },
    retryButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6366f1", paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14 },
    retryText: { color: "#fff", fontSize: 15, fontWeight: "600" },
    fallbackBadge: { flexDirection: "row", alignItems: "center", marginTop: 20, backgroundColor: "rgba(148, 163, 184, 0.1)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, gap: 6 },
    fallbackText: { color: "#9ca3af", fontSize: 12 },
});