"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../actions";
import { Upload } from "iconoir-react";
import { animated, useSpring } from "react-spring";
import Alert from "./alert";

export default function MessageInput() {
    const [message, setMessage] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const limit = message.length > 300;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.value = "";
        }
    }, []);

    function resize(el: HTMLTextAreaElement) {
        el.style.height = "0px";
        el.style.height = el.scrollHeight + "px";
    }

    const [buttonSpring, api] = useSpring(() => ({
        scale: 1,
        config: { tension: 180, friction: 16 },
    }));

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (limit || message === "") return;
                setMessage("");
                if (textareaRef.current) {
                    textareaRef.current.style.height = "";
                }

                sendMessage(message).then((result) => {
                    if (!result.success && result.error) {
                        setAlertMessage(result.error);
                    }
                });
            }}
            className="text-center fixed bottom-0 left-0 w-full "
        >
            {alertMessage && (
                <Alert
                    message={alertMessage}
                    onDismiss={() => setAlertMessage(null)}
                />
            )}
            <p className="text-md text-white mb-1">{message.length} / 300</p>
            <div className="flex flex-row items-end gap-3 mx-auto max-w-xl px-4 pb-6">
                <div className="flex-1 border border-white/20 rounded-3xl px-4 py-2 bg-black/20 backdrop-blur-xl shadow-[0_0_50px_oklch(0.39_0.21_268)] min-h-12 flex items-center">
                    <textarea
                        placeholder="Cast away a message into the ocean..."
                        ref={textareaRef}
                        rows={1}
                        className="bg-transparent outline-none resize-none w-full max-h-48 overflow-y-auto text-white text-base py-0 leading-relaxed placeholder:text-white/40"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            resize(e.target);
                        }}
                    />
                </div>
                <button
                    disabled={limit}
                    onMouseEnter={() => {
                        api.stop();
                        api.start({
                            scale: 1.2,
                            config: {
                                tension: 80,
                                friction: 10,
                                velocity: 0.003,
                            },
                        });
                    }}
                    onMouseDown={() => {
                        api.stop();
                        api.start({
                            scale: 0.9,
                            config: {
                                tension: 300,
                                friction: 13,
                                velocity: -0.006,
                            },
                        });
                    }}
                    onMouseLeave={() => {
                        api.start({
                            scale: 1,
                            config: {
                                tension: 160,
                                friction: 24,
                            },
                        });
                    }}
                    onClick={() => {
                        api.stop();
                        api.start({
                            scale: 1.2,
                            config: {
                                tension: 300,
                                friction: 13,
                                velocity: 0.006,
                            },
                        });
                    }}
                    className="w-12 h-12"
                >
                    <animated.div
                        className="border border-white/20 rounded-full bg-black/20 backdrop-blur-xl shadow-[0_0_50px_oklch(0.39_0.21_268)] w-12 h-12 shrink-0 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ ...buttonSpring }}
                    >
                        <Upload className="w-full h-full scale-70" />
                    </animated.div>
                </button>
            </div>
        </form>
    );
}
