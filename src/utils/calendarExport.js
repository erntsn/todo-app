const parseDateParts = (dateString) => {
    const [year, month, day] = (dateString || "").split("-").map(Number);

    if (!year || !month || !day) {
        return null;
    }

    return { year, month, day };
};

const formatDateForAllDayCalendar = (dateString) => {
    const parts = parseDateParts(dateString);
    if (!parts) {
        return null;
    }

    const month = String(parts.month).padStart(2, "0");
    const day = String(parts.day).padStart(2, "0");
    return `${parts.year}${month}${day}`;
};

const addDays = (dateString, daysToAdd) => {
    const parts = parseDateParts(dateString);
    if (!parts) {
        return null;
    }

    const date = new Date(parts.year, parts.month - 1, parts.day);
    date.setDate(date.getDate() + daysToAdd);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const escapeIcsText = (text = "") => {
    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
};

const toUtcStamp = (date = new Date()) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

const buildEventDetails = (todo, language = "tr") => {
    const lines = [];

    if (todo.notes) {
        lines.push(todo.notes.trim());
    }

    if (todo.priority) {
        const priorityLabel = language === "tr" ? "Öncelik" : "Priority";
        lines.push(`${priorityLabel}: ${todo.priority}`);
    }

    if (todo.category) {
        const categoryLabel = language === "tr" ? "Kategori" : "Category";
        lines.push(`${categoryLabel}: ${todo.category}`);
    }

    return lines.filter(Boolean).join("\n");
};

export const getGoogleCalendarUrl = (todo, language = "tr") => {
    if (!todo?.date || !todo?.text) {
        return null;
    }

    const start = formatDateForAllDayCalendar(todo.date);
    const end = formatDateForAllDayCalendar(addDays(todo.date, 1));

    if (!start || !end) {
        return null;
    }

    const details = buildEventDetails(todo, language);
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: todo.text,
        dates: `${start}/${end}`,
        details
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadTodoAsIcs = (todo, language = "tr") => {
    if (!todo?.date || !todo?.text) {
        return false;
    }

    const start = formatDateForAllDayCalendar(todo.date);
    const end = formatDateForAllDayCalendar(addDays(todo.date, 1));

    if (!start || !end) {
        return false;
    }

    const details = buildEventDetails(todo, language);
    const uid = `${todo.id || Date.now()}@taskflow`;
    const safeTitle = todo.text.replace(/[\\/:*?"<>|]/g, "").slice(0, 60) || "task";

    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//TaskFlow//Todo Calendar Export//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${escapeIcsText(uid)}`,
        `DTSTAMP:${toUtcStamp()}`,
        `DTSTART;VALUE=DATE:${start}`,
        `DTEND;VALUE=DATE:${end}`,
        `SUMMARY:${escapeIcsText(todo.text)}`,
        `DESCRIPTION:${escapeIcsText(details)}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeTitle}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
    return true;
};
