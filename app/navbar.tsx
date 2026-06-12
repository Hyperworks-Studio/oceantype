"use client";

import { Github, InfoCircle } from "iconoir-react";
import { Button } from "./button";
import Counter from "./components/counter";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="relative navbar m-2 gap-2 flex items-center flex-wrap md:flex-nowrap">
            <Image
                className="absolute top-0 left-0"
                draggable={false}
                src={"/oceantype.png"}
                alt="oceantype"
                width={200}
                height={30}
            />
            <div className="flex-1 order-1" />

            <div className="w-full flex justify-center md:w-auto order-3 md:order-2 mt-10 md:mt-0">
                <Counter />
            </div>

            <div className="flex-1 flex justify-end gap-2 md:order-3 order-2">
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
