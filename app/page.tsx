import Ocean from "./ocean";
import MessageInput from "./components/messageinput";
import supabase from "@/lib/supabase";
import LightRays from "./components/lightrays";
import Navbar from "./navbar";

export default async function Current() {
    const { data } = await supabase
        .from("stats")
        .select("numvalue")
        .eq("id", "message_count")
        .single();

    const messageCount = data?.numvalue ?? 0;

    return (
        <div className="h-screen overflow-hidden">
            <Navbar init={messageCount} />
            <Ocean />
            <LightRays />

            <MessageInput />
        </div>
    );
}
