"use server";

//import openai from "@/lib/openai";
import supabaseServer from "@/lib/supabaseServer";
import { headers } from "next/headers";

export async function sendMessage(message: string) {
    if (message.length > 300) {
        return { success: false, error: "Message is too long!" };
    }

    // get ip

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // ok
    const now = new Date();

    const { data: rateLimit } = await supabaseServer
        .from("ratelimit")
        .select("count, window_start")
        .eq("ip", ip)
        .single();

    const windowMs = 10 * 1000;

    if (rateLimit) {
        const windowStart = new Date(rateLimit.window_start);
        const inWindow = now.getTime() - windowStart.getTime() < windowMs;

        if (inWindow && rateLimit.count >= 2) {
            return {
                success: false,
                error: "Rate limit exceeded! Try again in ten seconds.",
            };
        }

        await supabaseServer
            .from("ratelimit")
            .update({
                count: inWindow ? rateLimit.count + 1 : 1,
                window_start: inWindow
                    ? rateLimit.window_start
                    : now.toISOString(),
            })
            .eq("ip", ip);
    } else {
        await supabaseServer.from("ratelimit").insert({
            ip,
            count: 1,
            window_start: now.toISOString(),
        });
    }

    const { error } = await supabaseServer
        .from("messages")
        .insert({ content: message });
    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
