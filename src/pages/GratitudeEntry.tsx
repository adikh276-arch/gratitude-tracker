import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { todayISO } from "@/lib/gratitudeStore";

const GratitudeEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editState = location.state as any;
  const [gratitude1, setGratitude1] = useState(editState?.gratitude1 || "");
  const [gratitude2, setGratitude2] = useState(editState?.gratitude2 || "");

  const canContinue = gratitude1.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    navigate("/mood", {
      state: {
        gratitude1: gratitude1.trim(),
        gratitude2: gratitude2.trim() || undefined,
        date: todayISO(),
      },
    });
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background px-5 pt-12 pb-28">
        <header className="mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-1">MantraCare</p>
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            What are you grateful for today?
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Take a moment to reflect on the good things, big or small.
          </p>
        </header>

        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Gratitude Item 1 <span className="text-primary">*</span>
            </label>
            <textarea
              value={gratitude1}
              onChange={(e) => setGratitude1(e.target.value)}
              placeholder="e.g. A warm cup of tea this morning..."
              rows={4}
              className="w-full bg-card text-foreground rounded-lg border border-border px-4 py-3 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 resize-none shadow-soft"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Gratitude Item 2 <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <textarea
              value={gratitude2}
              onChange={(e) => setGratitude2(e.target.value)}
              placeholder="e.g. A kind word from a friend..."
              rows={4}
              className="w-full bg-card text-foreground rounded-lg border border-border px-4 py-3 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 resize-none shadow-soft"
            />
          </div>
        </div>

        {/* Sticky bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md px-5 py-4 safe-bottom border-t border-border/50">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full h-[52px] rounded-pill bg-primary text-primary-foreground font-heading font-medium text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] hover:brightness-105"
          >
            Continue
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default GratitudeEntry;
