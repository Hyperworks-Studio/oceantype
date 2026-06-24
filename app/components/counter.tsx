"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";

export default function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const init = async () => {
            const data = await supabase
                .from("stats")
                .select("numvalue")
                .eq("id", "message_count")
                .single();

            return data.data?.numvalue ?? 0;
        };

        const listener = supabase.channel("stats-count").on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "stats",
                filter: "id=eq.message_count",
            },
            (payload) => {
                setCount((payload.new as { numvalue: number }).numvalue);
            },
        );

        listener.subscribe();

        init().then((v) => setCount(v));

        return () => {
            supabase.removeChannel(listener);
        };
    }, []);

    return (
        <div className="flex items-center justify-center text-lg m-2 text-white mb-1">
            Total messages floating in the ocean: {count}
        </div>
    );
}
