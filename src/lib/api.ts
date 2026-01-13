/**
 * API Client for Backend Services
 */

export interface PaymentData {
    phoneNumber: string;
    amount: number;
    email?: string;
}

export interface PaymentResponse {
    success: boolean;
    orderId: string;
    data: any;
    error?: string;
    message?: string;
}

export interface ChatMessage {
    message: string;
    sessionId?: string;
}

export interface ChatResponse {
    reply: string;
    sessionId: string;
}

/**
 * Process MB WAY Payment
 */
export async function mbwayPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
        const response = await fetch('/api/mbway', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Payment processing failed');
        }

        return result;
    } catch (error) {
        console.error('MB WAY Payment Error:', error);
        throw error;
    }
}

/**
 * Send message to chatbot
 */
export async function sendChatMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    try {
        const response = await fetch('/api/chatbot/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, sessionId }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Chat failed');
        }

        return result;
    } catch (error) {
        console.error('Chat Error:', error);
        throw error;
    }
}

/**
 * Get Google Calendar booking URL from environment
 */
export function getCalendarBookingUrl(): string {
    return import.meta.env.VITE_CALENDAR_BOOKING_URL || 'https://calendar.app.google/JsNJtR3uj9XPHh5J7';
}
