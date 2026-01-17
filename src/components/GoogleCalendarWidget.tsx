import React from 'react';

interface GoogleCalendarWidgetProps {
    calendarId: string; // e.g., "your_email%40gmail.com"
    /** Optional timezone, defaults to America/Sao_Paulo */
    timeZone?: string;
    /** Height of the iframe in pixels */
    height?: number;
}

export const GoogleCalendarWidget: React.FC<GoogleCalendarWidgetProps> = ({
    calendarId,
    timeZone = 'America/Sao_Paulo',
    height = 600,
}) => {
    const src = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
        calendarId
    )}&ctz=${encodeURIComponent(timeZone)}`;

    return (
        <div className="my-8 w-full overflow-hidden rounded-lg border">
            <iframe
                src={src}
                style={{ border: 0, width: '100%', height }}
                scrolling="no"
                title="Google Calendar"
                loading="lazy"
            />
        </div>
    );
};
