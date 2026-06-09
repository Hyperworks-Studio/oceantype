"use client";

import { ArrowEmailForward, Github } from "iconoir-react";
import { useRouter } from "next/navigation";
import { Button } from "../button";
import Image from "next/image";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed top-0 left-0 right-0 m-2 navbar gap-2 flex items-center h-14">
            <Image
                className="absolute translate-y-1/5"
                draggable={false}
                src={"/oceantype.png"}
                alt="oceantype"
                width={200}
                height={30}
            />

            <div className="flex-1" />

            <div className="flex-1 flex justify-end gap-2">
                <Button
                    onClick={() => {
                        router.back();
                    }}
                    title="Information"
                >
                    <ArrowEmailForward />
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
