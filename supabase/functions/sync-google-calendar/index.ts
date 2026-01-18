import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  description?: string;
}

serve(async (req) => {
  // Apenas aceitar POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const googleCalendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

    if (!googleCalendarId || !googleApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing Google Calendar configuration" }),
        { status: 400 }
      );
    }

    // Buscar eventos do Google Calendar dos últimos 30 dias
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?key=${googleApiKey}&timeMin=${thirtyDaysAgo.toISOString()}&timeMax=${new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()}&singleEvents=true&orderBy=startTime`;

    const calendarResponse = await fetch(calendarUrl);
    const calendarData = await calendarResponse.json();

    if (!calendarData.items) {
      return new Response(
        JSON.stringify({ message: "No events found", synced: 0 }),
        { status: 200 }
      );
    }

    let syncedCount = 0;

    // Processar cada evento do Google Calendar
    for (const event of calendarData.items) {
      const eventId = event.id;
      const eventTitle = event.summary || "Consulta";
      const eventStart = event.start?.dateTime || event.start?.date;

      if (!eventStart) continue;

      // Procurar o email do paciente nos attendees
      const attendeeEmail = event.attendees?.[0]?.email;
      if (!attendeeEmail) continue;

      // Verificar se já existe um agendamento com este evento do Google
      const { data: existingAppointment } = await supabase
        .from("appointments")
        .select("id")
        .eq("payment_reference", `google_calendar_${eventId}`)
        .single();

      if (existingAppointment) {
        // Já foi sincronizado
        continue;
      }

      // Procurar o utilizador pelo email
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const user = users.find((u) => u.email === attendeeEmail);

      if (!user) {
        // Utilizador não encontrado, saltar
        continue;
      }

      // Determinar o tipo de consulta baseado no título
      const consultationType = eventTitle.toLowerCase().includes("seguimento")
        ? "followup"
        : "first";

      // Determinar o valor baseado no tipo
      const amount = consultationType === "first" ? 60 : 50;

      // Inserir o agendamento na base de dados
      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          appointment_date: new Date(eventStart).toISOString(),
          consultation_type: consultationType,
          amount: amount,
          payment_status: "pending",
          payment_reference: `google_calendar_${eventId}`,
          notes: `Agendado via Google Calendar: ${eventTitle}`,
        });

      if (!insertError) {
        syncedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Sync completed",
        synced: syncedCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao sincronizar Google Calendar:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
