import fs from 'fs';
import path from 'path';

const API_KEY = 'AIzaSyDgyWwwmHOROsPZclCm-LGzZs_uoYNhVDk';
const URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'pl', name: 'Polish' },
    { code: 'th', name: 'Thai' },
    { code: 'tl', name: 'Filipino' },
];

const en = {
    "app.title": "Gratitude Tracker",
    "app.description": "Track your daily gratitude and mood for better mental wellness",
    "gratitude.heading": "What are you grateful for today?",
    "gratitude.subheading": "Take a moment to reflect on the good things, big or small.",
    "gratitude.item1.label": "Gratitude Item 1",
    "gratitude.item1.placeholder": "e.g. A warm cup of tea this morning...",
    "gratitude.item2.label": "Gratitude Item 2",
    "gratitude.item2.placeholder": "e.g. A kind word from a friend...",
    "gratitude.optional": "(optional)",
    "common.continue": "Continue",
    "mood.heading": "How are you feeling?",
    "mood.subheading": "Select the mood that best describes you right now.",
    "mood.save": "Save Gratitude Entry",
    "mood.happy": "Happy",
    "mood.calm": "Calm",
    "mood.neutral": "Neutral",
    "mood.low": "Low",
    "mood.stressed": "Stressed",
    "review.heading": "Your Entry",
    "review.date": "Date",
    "review.gratitude1": "Gratitude 1",
    "review.gratitude2": "Gratitude 2",
    "review.mood": "Mood",
    "review.edit": "Edit Entry",
    "review.history": "View History",
    "history.heading": "History",
    "history.back": "Back",
    "history.home": "Go to Home",
    "history.sun": "Sun",
    "history.mon": "Mon",
    "history.tue": "Tue",
    "history.wed": "Wed",
    "history.thu": "Thu",
    "history.fri": "Fri",
    "history.sat": "Sat"
};

const outputDir = path.join(process.cwd(), 'src', 'i18n', 'locales');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'en.json'), JSON.stringify(en, null, 2));

async function batchTranslate(texts: string[], target: string) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
                q: texts,
                target: target,
                format: 'text',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data: any = await response.json();
        if (data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations.map((t: any) => t.translatedText);
        } else {
            console.warn(`Batch translation failed for ${target}:`, data);
            return texts;
        }
    } catch (error) {
        console.error(`Error in batch translation for ${target}:`, error);
        return texts;
    }
}

async function generate() {
    const keys = Object.keys(en);
    const values = Object.values(en);

    for (const lang of languages) {
        console.log(`Generating translations for ${lang.name}...`);
        const results = await batchTranslate(values, lang.code);
        const translated: any = {};
        keys.forEach((key, index) => {
            translated[key] = results[index];
        });
        fs.writeFileSync(path.join(outputDir, `${lang.code}.json`), JSON.stringify(translated, null, 2));
        console.log(`Saved ${lang.code}.json`);
    }
}

generate();
