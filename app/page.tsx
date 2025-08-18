import { MacbookScroll } from "@/components/ui/macbook";

export default function Home() {
    return (
        <div className="bg-background text-foreground h-screen">
            <MacbookScroll src="/ui.png" showGradient={true} title="Introducing Celestial" badge={false} />
        </div>
    );
}
