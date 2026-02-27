import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { getAllEntries, GratitudeEntry as GEntry } from "@/lib/gratitudeStore";
import { format } from "date-fns";

const ReviewEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { entryId, entryDate } = (location.state as any) || {};

  const entry: GEntry | undefined = getAllEntries().find(
    (e) => e.id === entryId || e.date === entryDate
  );

  if (!entry) {
    navigate("/");
    return null;
  }

  const formattedDate = format(new Date(entry.date + "T00:00:00"), "MMMM d, yyyy");

  const handleEdit = () => {
    navigate("/", {
      state: {
        editId: entry.id,
        gratitude1: entry.gratitude1,
        gratitude2: entry.gratitude2,
      },
    });
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background px-5 pt-12 pb-28 max-w-md mx-auto w-full text-justify">
        <header className="mb-6">
          <h1 className="text-2xl font-heading font-semibold text-foreground text-left">
            Your Entry
          </h1>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-card rounded-lg p-5 shadow-card space-y-5"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Date
            </p>
            <p className="text-base text-foreground">{formattedDate}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Gratitude 1
            </p>
            <p className="text-base text-foreground leading-relaxed">{entry.gratitude1}</p>
          </div>

          {entry.gratitude2 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Gratitude 2
              </p>
              <p className="text-base text-foreground leading-relaxed">{entry.gratitude2}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Mood
            </p>
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-pill">
              <span className="text-2xl">{entry.mood.emoji}</span>
              <span className="text-sm font-medium text-foreground">{entry.mood.label}</span>
            </div>
          </div>
        </motion.div>

        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md px-5 py-4 safe-bottom border-t border-border/50">
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 h-[52px] rounded-pill border-2 border-secondary text-foreground font-heading font-medium text-base transition-all duration-200 active:scale-[0.98] hover:bg-secondary/30"
            >
              Edit Entry
            </button>
            <button
              onClick={() => navigate("/history")}
              className="flex-1 h-[52px] rounded-pill bg-primary text-primary-foreground font-heading font-medium text-base transition-all duration-200 active:scale-[0.98] hover:brightness-105"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ReviewEntry;
