import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageTransition from "@/components/PageTransition";
import {
  getEntriesForMonth,
  GratitudeEntry,
} from "@/lib/gratitudeStore";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<GratitudeEntry | null>(null);
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const data = await getEntriesForMonth(year, month);
        setEntries(data);
      } catch (error) {
        console.error("Fetch history error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [year, month]);

  const entryDates = useMemo(() => {
    const map = new Map<string, GratitudeEntry>();
    // Since entries are ordered by created_at DESC, the first one we encounter for a date is the newest
    entries.forEach((e) => {
      if (!map.has(e.date)) {
        map.set(e.date, e);
      }
    });
    return map;
  }, [entries]);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const startDayOfWeek = getDay(days[0]);

  const handleDateTap = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");
    const entry = entryDates.get(iso);
    if (entry) {
      setSelectedEntry(entry);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-background px-5 pt-12 pb-28 max-w-md mx-auto w-full text-justify">
        <header className="mb-6">
          <h1 className="text-2xl font-heading font-semibold text-foreground text-left">
            {t("history.heading")}
          </h1>
        </header>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-heading font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="bg-card rounded-lg shadow-card p-4 mb-5 min-h-[300px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                    {t(`history.${d.toLowerCase()}`)}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map((day) => {
                  const iso = format(day, "yyyy-MM-dd");
                  const hasEntry = entryDates.has(iso);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedEntry?.date === iso;

                  return (
                    <motion.button
                      key={iso}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDateTap(day)}
                      className={`relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "bg-muted text-foreground"
                          : "text-foreground hover:bg-muted/60"
                        }`}
                    >
                      {day.getDate()}
                      {hasEntry && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Selected entry detail */}
        <AnimatePresence mode="wait">
          {selectedEntry && (
            <motion.div
              key={selectedEntry.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="bg-card rounded-lg shadow-card p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {format(new Date(selectedEntry.date + "T00:00:00"), "MMMM d, yyyy")}
                </p>
                <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-pill">
                  <span className="text-lg">{selectedEntry.mood.emoji}</span>
                  <span className="text-xs font-medium text-foreground">{t(`mood.${selectedEntry.mood.label.toLowerCase()}`)}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{t("review.gratitude1")}</p>
                <p className="text-sm text-foreground leading-relaxed">{selectedEntry.gratitude1}</p>
              </div>
              {selectedEntry.gratitude2 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{t("review.gratitude2")}</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedEntry.gratitude2}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom buttons */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/80 backdrop-blur-md px-5 py-4 safe-bottom border-t border-border/50 z-10">
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 h-[52px] rounded-pill border-2 border-secondary text-foreground font-heading font-medium text-base transition-all duration-200 active:scale-[0.98] hover:bg-secondary/30 shadow-sm"
            >
              {t("history.back")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 h-[52px] rounded-pill bg-primary text-primary-foreground font-heading font-medium text-base transition-all duration-200 active:scale-[0.98] hover:brightness-105 shadow-md"
            >
              {t("history.home")}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default History;
