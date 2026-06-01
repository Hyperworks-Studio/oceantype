"use client";

import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

interface AlertProps {
    message: string;
    onDismiss: () => void;
}

export default function Alert({ message, onDismiss }: AlertProps) {
    const [visible, setVisible] = useState(false);

    const spring = useSpring({
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
        y: visible ? 0 : -8,
        config: { tension: 220, friction: 22 },
        onRest: () => {
            if (!visible) onDismiss();
        },
    });

    function dismiss() {
        setVisible(false);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
        const timer = setTimeout(dismiss, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <animated.div style={spring} className="mx-auto max-w-xl px-4 mb-2">
            <div className="border border-sanguine/80 rounded-2xl px-4 py-2 bg-black/30 backdrop-blur-xl flex items-center justify-between gap-3 shadow-[0_0_10px_oklch(0.67_0.28_23/0.5)]">
                <p className="text-sm text-white/90">{message}</p>
                <button
                    onClick={dismiss}
                    className="text-white/40 hover:text-white/80 transition-colors text-xs shrink-0"
                >
                    dismiss
                </button>
            </div>
        </animated.div>
    );
}
