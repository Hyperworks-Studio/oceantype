import Image from "next/image";
import Navbar from "./navbar";

export default function PrivacyAndTOS() {
    return (
        <div className="bg-linear-to-b from-meridian to-abyss py-16 px-4">
            <Navbar />

            <div className="max-w-2xl mx-auto space-y-8">
                <div className="border border-white/10 rounded-3xl px-8 py-8 bg-black/20 backdrop-blur-xl space-y-4 ">
                    <h1 className="text-2xl font-semibold text-parchment tracking-tight">
                        Privacy Policy
                    </h1>
                    <ul className="space-y-2 text-white/70 text-sm leading-relaxed list-none">
                        <li>
                            Your IP address is collected temporarily to prevent
                            spam.
                        </li>
                        <li>
                            Messages you send are stored permanently and may be
                            recycled back into the ocean current when no new
                            messages are being sent.
                        </li>
                        <li>
                            Your IP address is never shared with third parties.
                        </li>
                        <li>
                            Messages are sent and displayed anonymously, no
                            account or identity is attached.
                        </li>
                    </ul>
                </div>

                <div className="border border-white/10 rounded-3xl px-8 py-8 bg-black/20 backdrop-blur-xl space-y-4 ">
                    <h1 className="text-2xl font-semibold text-parchment tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-white/50 text-sm">
                        By using this service, you agree to the following:
                    </p>
                    <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                        <li>No spam or repeated messages</li>
                        <li>No illegal content</li>
                        <li>
                            No personal information about yourself or others
                        </li>
                        <li>No harassment of any kind</li>
                        <li>
                            No hate speech, racism, sexism, or anything hateful
                            is not allowed
                        </li>
                        <li>
                            Curse words are permitted, but excessive swearing is
                            not
                        </li>
                        <li>Keep it respectful</li>
                    </ul>
                </div>

                <div className="border border-white/10 rounded-3xl px-8 py-8 bg-black/20 backdrop-blur-xl  space-y-4 ">
                    <h1 className="text-2xl font-semibold text-parchment tracking-tight">
                        Note
                    </h1>

                    <ul className="space-y-2 text-white/70 text-sm leading-relaxed list-none">
                        <p>
                            This website is a fun project I made for learning
                            purposes. I hope you enjoy it!
                        </p>

                        <p>
                            Built with nextjs, tailwindcss, motion,
                            react-spring, jotai and supabase.
                        </p>
                    </ul>
                </div>

                <div className="fixed bottom-0 left-0 w-full border-t border-white/10 pt-4 pb-6 text-center text-white/40 text-sm bg-abyss">
                    <div className="flex items-center justify-center gap-2">
                        <p>© 2026 Hyperworks Studio</p>

                        <Image
                            src={"/hyperworks.svg"}
                            alt="Hyperworks"
                            width={18}
                            height={18}
                        />
                    </div>

                    <p>Built and designed by @teakzc</p>
                </div>
            </div>
        </div>
    );
}
