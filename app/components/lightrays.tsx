"use client";

import { motion, useMotionValue, useSpring, animate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface RayData {
    id: number;
    left: string;
    rotation: number;
    duration: number;
    delay: number;
}

const INITIAL_RAYS: RayData[] = [
    { id: 1, left: "8%", rotation: 8, duration: 6, delay: 0 },
    { id: 2, left: "22%", rotation: 14, duration: 9, delay: 2 },
    { id: 3, left: "38%", rotation: 6, duration: 7, delay: 4 },
    { id: 4, left: "55%", rotation: 18, duration: 11, delay: 1 },
    { id: 5, left: "70%", rotation: 10, duration: 8, delay: 3 },
    { id: 6, left: "85%", rotation: 4, duration: 10, delay: 5 },
];

function Ray({
    left,
    rotation,
    duration,
    delay,
    onDone,
}: {
    left: string;
    rotation: number;
    duration: number;
    delay: number;
    onDone: () => void;
}) {
    const opacity = useMotionValue(0);
    const springOpacity = useSpring(opacity, { stiffness: 20, damping: 10 });

    useEffect(() => {
        let cancelled = false;

        const loop = async () => {
            await new Promise((r) => setTimeout(r, delay * 1000));
            await animate(opacity, 1, { duration: duration * 0.4 });
            if (cancelled) return;
            await animate(opacity, 0, { duration: duration * 0.6 });
            if (!cancelled) onDone();
        };

        loop();
        return () => {
            cancelled = true;
        };
    }, [delay, duration, opacity, onDone]);

    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left,
                rotate: rotation,
                opacity: springOpacity,
                transformOrigin: "top center",
                pointerEvents: "none",
            }}
            className="w-12 h-[90vh] bg-linear-to-b from-white/60 via-white/50 to-transparent blur-2xl"
        />
    );
}

export default function LightRays() {
    const [mounted, setMounted] = useState(false);
    const [rays, setRays] = useState<RayData[]>(INITIAL_RAYS);
    const nextId = useRef(INITIAL_RAYS.length + 1);

    const removeRay = useCallback((id: number) => {
        setRays((prev) => prev.filter((r) => r.id !== id));
        const newRay: RayData = {
            id: nextId.current++,
            left: `${5 + Math.random() * 90}%`,
            rotation: Math.round(Math.random() * 25),
            duration: 5 + Math.random() * 10,
            delay: 0,
        };
        setRays((prev) => [...prev, newRay]);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {rays.map((ray) => (
                <Ray key={ray.id} {...ray} onDone={() => removeRay(ray.id)} />
            ))}
        </>
    );
}
