import React, { useState } from "react";
import BiometricLock from "../components/BiometricLock";
import Dashboard from "./dashboard";

export default function Index() {
    const [unlocked, setUnlocked] = useState(false);

    if (!unlocked) {
        return <BiometricLock onSuccess={() => setUnlocked(true)} />;
    }

    return <Dashboard />;
}