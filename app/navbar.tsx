"use client";

import { Github, InfoCircle } from "iconoir-react";
import { Button } from "./button";
import Counter from "./components/counter";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar({ init }: { init: number }) {
    const router = useRouter();

    return (
        <nav className="navbar m-2 gap-2 flex items-center">
            <Image
                className="absolute translate-y-1/5"
                draggable={false}
                src={"/oceantype.svg"}
                alt="oceantype"
                width={200}
                height={30}
            />

            <div className="flex-1" />

            <Counter initialCount={init} />

            <div className="flex-1 flex justify-end gap-2">
                <Button
                    onClick={() => {
                        router.push("/info");
                    }}
                    title="Information"
                >
                    <InfoCircle />
                </Button>

                <Button
                    onClick={() => {
                        window.open(
                            "https://github.com/Hyperworks-Studio/oceantype",
                            "_blank",
                        );
                    }}
                    title="GitHub"
                >
                    <Github />
                </Button>
            </div>
        </nav>
    );
}
