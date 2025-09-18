import Hero from '@/components/hero';
import Features from '@/components/features';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';

export default function Home() {
    return (
        <div className="bg-background text-foreground">
            <main>
                <Hero />
                <Features />
                <Pricing />
                <Footer />
            </main>
        </div>
    );
}
