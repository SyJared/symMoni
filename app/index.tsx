import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BiometricLock from "../components/BiometricLock";

export default function Index() {
    const [unlocked, setUnlocked] = useState(false);

    if (!unlocked) {
        return <BiometricLock onSuccess={() => setUnlocked(true)} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Unlocked! Dashboard goes here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    text: { fontSize: 18, fontWeight: "600" },
});