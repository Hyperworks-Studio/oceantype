"use client";

import { ArrowEmailForward, Github } from "iconoir-react";
import { useRouter } from "next/navigation";
import { Button } from "../button";
import Image from "next/image";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed top-2 left-2 right-2 navbar gap-2 flex items-center">
            <Image
                className="absolute translate-y-1/5"
                draggable={false}
                src={"/oceantype.png"}
                alt="oceantype"
                width={200}
                height={30}
            />

            <div className="flex-1" />

            <div className="text-lg m-2 mb-1 invisible">PLACEHOLDER</div>

            <div className="flex-1 flex justify-end gap-2">
                <Button
                    onClick={() => {
                        router.push("/");
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
