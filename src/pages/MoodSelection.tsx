import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageTransition from "@/components/PageTransition";
import { MOODS, MoodOption, saveEntry, todayISO } from "@/lib/gratitudeStore";
import { v4 } from "@/lib/uid";

const moodBgs = [
  "bg-[hsl(155,52%,90%)]",      // Happy - sage tint
  "bg-[hsl(200,50%,90%)]",      // Calm - soft blue
  "bg-[hsl(45,60%,90%)]",       // Neutral - warm yellow
  "bg-[hsl(255,60%,92%)]",      // Low - lavender
  "bg-[hsl(340,50%,92%)]",      // Stressed - soft pink
];

const moodBgsSelected = [
  "bg-[hsl(155,52%,80%)] ring-2 ring-primary",
  "bg-[hsl(200,50%,80%)] ring-2 ring-primary",
  "bg-[hsl(45,60%,82%)] ring-2 ring-primary",
  "bg-[hsl(255,60%,84%)] ring-2 ring-primary",
  "bg-[hsl(340,50%,84%)] ring-2 ring-primary",
];

const MoodSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { gratitude1, gratitude2, date, editId } = (location.state as any) || {};
  const [selected, setSelected] = useState<MoodOption | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!gratitude1) {
    navigate("/");
    return null;
  }

  const handleSave = async () => {
    if (!selected || isSaving) return;
    setIsSaving(true);
    try {
      const entry = {
        id: editId || v4(),
        date: date || todayISO(),
        gratitude1,
        gratitude2: gratitude2 || undefined,
        mood: selected,
      };
      await saveEntry(entry);
      navigate("/review", { state: { entryId: entry.id, entryDate: entry.date } });
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background px-5 pt-12 pb-28 max-w-md mx-auto w-full text-justify">
        <header className="mb-8">
          <h1 className="text-2xl font-heading font-semibold text-foreground text-left">
            {t("mood.heading")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("mood.subheading")}
          </p>
        </header>

        <div className="flex-1 space-y-3">
          {MOODS.map((mood, i) => {
            const isSelected = selected?.label === mood.label;
            return (
              <motion.button
                key={mood.label}
                onClick={() => setSelected(mood)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg transition-all duration-300 ${isSelected ? moodBgsSelected[i] : moodBgs[i]
                  }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-base font-medium text-foreground">{t(`mood.${mood.label.toLowerCase()}`)}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/80 backdrop-blur-md px-5 py-4 safe-bottom border-t border-border/50 z-10">
          <button
            onClick={handleSave}
            disabled={!selected || isSaving}
            className="w-full h-[52px] rounded-pill bg-primary text-primary-foreground font-heading font-medium text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] hover:brightness-105 shadow-md flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {t("mood.saving", "Saving...")}
              </>
            ) : (
              t("mood.save")
            )}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default MoodSelection;
