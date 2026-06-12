import Ocean from "./ocean";
import MessageInput from "./components/messageinput";
import LightRays from "./components/lightrays";
import Navbar from "./navbar";

export default async function Current() {
    return (
        <div className="h-screen overflow-hidden overscroll-none">
            <Navbar />
            <Ocean />
            <LightRays />
            <MessageInput />
        </div>
    );
}
