"use client";

import {
    motion,
    useMotionValue,
    useSpring,
    useAnimationFrame,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

interface FloatingMessageProps {
    content: string;
    onRemove: () => void;
}

export default function FloatingMessage({
    content,
    onRemove,
}: FloatingMessageProps) {
    const [position, setPosition] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const dragOffsetX = useRef(0);
    const dragOffsetY = useRef(0);
    const swayBaseX = useRef(0); // x position at release, sway continues from here

    const lengthRatio = content.length / 300;
    const [naturalSpeed] = useState(() => 3 - lengthRatio * 1.5);

    // velocity spring for sinking — springs to 0 on grab, back to naturalSpeed on release
    const velocity = useMotionValue(naturalSpeed);
    const springVelocity = useSpring(velocity, {
        stiffness: 40 - lengthRatio * 20,
        damping: 8 + lengthRatio * 10,
    });

    // raw cursor target positions during drag
    const targetX = useMotionValue(0);
    const targetY = useMotionValue(isMobile ? -300 : -150);

    // visual positions spring toward the target
    const springX = useSpring(targetX, {
        stiffness: 40 - lengthRatio * 25,
        damping: 5 + lengthRatio * 15,
    });
    const springY = useSpring(targetY, {
        stiffness: 60 - lengthRatio * 30,
        damping: 12 + lengthRatio * 8,
    });

    // sway
    const [swayAmount] = useState(
        () => (20 + Math.random() * 40) * (1 - lengthRatio * 0.7),
    );
    const [swayFrequency] = useState(() => 0.5 + Math.random() * 1.5);

    // rotation
    const [initialRotation] = useState(() => (Math.random() - 0.5) * 10);
    const rotation = useMotionValue(initialRotation);
    const springRotation = useSpring(rotation, { stiffness: 20, damping: 8 });

    useAnimationFrame((t, delta) => {
        if (!isDraggingRef.current) {
            // sink by spring velocity
            const currentVelocity = springVelocity.get();
            targetY.set(targetY.get() + currentVelocity * (delta / 16.67));

            // sway x — continues from release position
            targetX.set(
                swayBaseX.current +
                    Math.sin((t / 1000) * swayFrequency) * swayAmount,
            );

            // rotation drift
            rotation.set(
                initialRotation + Math.sin((t / 2000) * swayFrequency) * 5,
            );
        }

        if (springY.get() > window.innerHeight * 1.1) {
            onRemove();
        }
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPosition(Math.random() * 80);
    }, []);

    useEffect(() => {
        const onPointerMove = (e: PointerEvent) => {
            if (!isDraggingRef.current) return;
            targetX.set(e.clientX - dragOffsetX.current);
            targetY.set(e.clientY - dragOffsetY.current);
        };

        const onPointerUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            setIsDragging(false);
            swayBaseX.current = targetX.get(); // sway continues from release x position
            velocity.set(naturalSpeed); // resume sinking
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [naturalSpeed, targetX, targetY, velocity]);

    if (position === null) return null;

    return (
        <motion.div
            dragMomentum={true}
            onPointerDown={(e) => {
                isDraggingRef.current = true;
                setIsDragging(true);
                velocity.set(0); // freeze sinking
                // record where on the element the user grabbed
                dragOffsetX.current = e.clientX - springX.get();
                dragOffsetY.current = e.clientY - springY.get();
                e.currentTarget.setPointerCapture(e.pointerId);
            }}
            style={{
                position: "fixed",
                left: `${position}%`,
                x: springX,
                y: springY,
                rotate: springRotation,
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                userSelect: "none",
            }}
            className="inline-block bg-white rounded-lg px-3 py-3 max-w-xl wrap-break-word border-2 border-valiant/10 shadow-xl shadow-valiant/50"
        >
            <p className="text-black">{content}</p>
        </motion.div>
    );
}
