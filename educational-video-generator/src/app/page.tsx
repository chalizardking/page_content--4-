import Link from "next/link";
import { ArrowRight, Video, MessageSquare, Globe, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-purple-500/10" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Logo className="text-[var(--primary)]" />
            <span className="font-bold text-xl">AIPrep</span>
          </div>
          <Link
            href="/app"
            className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg font-medium hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-[var(--primary)] bg-clip-text text-transparent">
            AI Video Generator
            <br />
            <span className="text-[var(--primary)]">from Text & Image</span>
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8">
            Generate animated educational videos in 30 seconds from any text
            prompt or image. Perfect for learning, teaching, and explaining
            complex topics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--primary)] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition"
            >
              Try Free Now
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[var(--border)] rounded-xl font-semibold text-lg hover:bg-[var(--muted)] transition"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-[var(--muted-foreground)] text-center max-w-2xl mx-auto mb-16">
            Everything you need to create engaging educational content
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Video}
              title="Text to Video"
              description="Convert any text prompt into an animated educational video in seconds"
            />
            <FeatureCard
              icon={MessageSquare}
              title="AI Chat"
              description="Get instant answers and explanations from our AI tutor"
            />
            <FeatureCard
              icon={Globe}
              title="Multi-language"
              description="Generate videos in English, Hindi, Spanish, French, and more"
            />
            <FeatureCard
              icon={Zap}
              title="Fast Generation"
              description="Get your video in under 30 seconds with our optimized pipeline"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[var(--primary)]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your First Video?
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            Join thousands of students and educators using AI to create better
            learning experiences.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--primary)] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Start Creating
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Logo className="text-[var(--primary)] size-6" />
            <span className="font-bold">AIPrep</span>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            © 2024 AIPrep Clone. Educational Video Generator.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition group">
      <div className="size-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--primary)]/20 transition">
        <Icon className="size-6 text-[var(--primary)]" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--muted-foreground)] text-sm">{description}</p>
    </div>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 39 41"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <path d="M17.0328 12.3023L16.6733 12.5077C13.8487 18.0541 10.0613 23.3694 7.26242 28.9029C7.08267 29.2624 6.77454 29.7631 6.6975 30.1355C6.01705 33.4479 9.84302 35.6176 12.3594 33.358L26.7903 8.63039C29.281 6.03695 33.5435 8.39929 32.4137 11.9428C27.7532 19.6975 23.6319 28.0812 18.8045 35.6947C11.9101 46.5949 -3.35531 38.9557 0.663249 27.1825C4.32232 20.9814 7.64758 14.2923 11.4864 8.21955C13.3865 5.21526 16.5321 3.72595 19.8958 5.63894C21.1797 6.37075 22.7717 8.5662 23.311 9.92711C23.388 10.1197 23.5036 10.2866 23.4394 10.5305L19.7418 16.8601L17.0456 12.3023H17.0328Z" />
      <path d="M29.7436 21.0325L38.4483 36.2723C39.9376 39.7901 35.3285 42.6917 32.8249 39.7131L25.7764 27.6189L29.2429 21.3792L29.7307 21.0325H29.7436Z" />
      <path d="M33.5695 0.00244302C37.0745 -0.125945 38.2814 4.84269 35.0717 6.2678C30.0388 8.5146 28.3056 0.207865 33.5695 0.00244302Z" />
    </svg>
  );
}
