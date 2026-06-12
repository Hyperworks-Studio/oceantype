"use client";

import supabase from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";
import FloatingMessage from "./components/floatingmessage";
import { useAtom } from "jotai";
import { canSpawn } from "./atoms";
import { isMobile } from "react-device-detect";

interface Message {
    id: string;
    created_at: string;
    content: string;
}

// ─── tuning knobs ────────────────────────────────────────────────
const FEED_INTERVAL_MS = isMobile ? 1000 : 250; // how often the dice is rolled (ms)
const RECENT_WINDOW_MS = 5000; // window to count "fresh" messages (ms)
const BASE_CHANCE = 0.5; // base probability of recycling per tick
const CHANCE_REDUCTION = 0.075; // probability drop per fresh message in window
const MIN_CHANCE = 0.01; // floor — never fully stops recycling
// ─────────────────────────────────────────────────────────────────

export default function Ocean() {
    const [messagesState, setMessagesState] = useState<Message[]>([]);
    const recentTimestamps = useRef<number[]>([]);
    const hiddenQueue = useRef<Message[]>([]);
    const [spawn, setSpawn] = useAtom(canSpawn);

    // realtime — fresh messages appear immediately
    useEffect(() => {
        const listener = supabase
            .channel("messages")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    recentTimestamps.current = [
                        ...recentTimestamps.current.filter(
                            (t) => Date.now() - t < RECENT_WINDOW_MS,
                        ),
                        Date.now(),
                    ];

                    if (spawn) {
                        setMessagesState((prev) => [
                            ...prev,
                            payload.new as Message,
                        ]);
                    } else {
                        hiddenQueue.current.push(payload.new as Message);
                    }
                },
            )
            .subscribe();

        const handler = () => {
            if (document.hidden) {
                setSpawn(false);
                hiddenQueue.current = [];
            } else {
                setSpawn(true);

                const queue = [...hiddenQueue.current];
                hiddenQueue.current = [];

                queue.forEach((message, i) => {
                    const delay = 750;
                    setTimeout(() => {
                        setMessagesState((prev) => [...prev, message]);
                    }, delay);
                });
            }
        };
        document.addEventListener("visibilitychange", handler);

        return () => {
            supabase.removeChannel(listener);
            document.removeEventListener("visibilitychange", handler);
        };
    }, [setSpawn, spawn]);

    // recycle an old message
    useEffect(() => {
        const interval = setInterval(async () => {
            const recentCount = recentTimestamps.current.filter(
                (t) => Date.now() - t < RECENT_WINDOW_MS,
            ).length;

            const chance = Math.max(
                MIN_CHANCE,
                BASE_CHANCE - recentCount * CHANCE_REDUCTION,
            );

            if (!spawn) return;

            if (Math.random() < chance) {
                const { data } = await supabase.rpc("get_random_messages", {
                    count: 1,
                });
                if (data && data.length > 0) {
                    setMessagesState((prev) => {
                        // avoid duplicates already on screen
                        const alreadyShown = prev.some(
                            (m) => m.id === data[0].id,
                        );
                        if (alreadyShown) return prev;
                        return [...prev, data[0]];
                    });
                }
            }
        }, FEED_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [spawn]);

    return (
        <>
            <div className="fixed inset-0 -z-10 bg-linear-to-b from-meridian to-abyss" />
            <div>
                {messagesState.map((message) => (
                    <FloatingMessage
                        key={message.id}
                        content={message.content}
                        onRemove={() => {
                            setMessagesState((prev) =>
                                prev.filter((m) => m.id !== message.id),
                            );
                        }}
                    />
                ))}
            </div>
        </>
    );
}
