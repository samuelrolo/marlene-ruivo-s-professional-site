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

export interface AvailabilitySlot {
    time: string;
    available: boolean;
}

export interface BookingData {
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    notes?: string;
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
 * Get available appointment slots for a date
 */
export async function getAvailability(date: Date): Promise<AvailabilitySlot[]> {
    try {
        const dateStr = date.toISOString().split('T')[0];
        const response = await fetch(`/api/calendar/availability?date=${dateStr}`);

        if (!response.ok) {
            throw new Error('Failed to fetch availability');
        }

        return await response.json();
    } catch (error) {
        console.error('Availability Error:', error);
        throw error;
    }
}

/**
 * Book an appointment
 */
export async function bookAppointment(data: BookingData): Promise<{ success: boolean; eventLink?: string }> {
    try {
        const response = await fetch('/api/calendar/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Booking failed');
        }

        return result;
    } catch (error) {
        console.error('Booking Error:', error);
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
