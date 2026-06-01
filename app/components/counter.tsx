"use client";

import { useAtomValue } from "jotai";
import { counterAtom } from "../atoms";
import { useHydrateAtoms } from "jotai/utils";

interface CounterProps {
    initialCount: number;
}

export default function Counter({ initialCount }: CounterProps) {
    useHydrateAtoms([[counterAtom, initialCount]]);
    const count = useAtomValue(counterAtom);

    return (
        <div className="flex items-center justify-center text-lg m-2 text-white mb-1">
            Total messages floating in the ocean: {count}
        </div>
    );
}
