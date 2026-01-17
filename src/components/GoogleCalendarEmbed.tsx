import React from 'react';

interface GoogleCalendarEmbedProps {
    embedUrl: string;
    height?: number;
}

export const GoogleCalendarEmbed: React.FC<GoogleCalendarEmbedProps> = ({
    embedUrl,
    height = 600,
}) => {
    return (
        <div className="my-8 w-full overflow-hidden rounded-lg border">
            <iframe
                src={embedUrl}
                style={{ border: 0, width: '100%', height }}
                scrolling="no"
                title="Google Calendar Embed"
                loading="lazy"
            />
        </div>
    );
};
