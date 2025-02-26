import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google API credentials');
}

// Create OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL + '/api/auth/callback/google'
);

// Create calendar client
const calendar = google.calendar({ 
  version: 'v3',
  auth: oauth2Client as any // Type assertion to avoid TypeScript error
});

export interface InterviewEvent {
  summary: string;
  description: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
}

export async function createInterviewEvent(
  accessToken: string,
  event: InterviewEvent
): Promise<string> {
  try {
    // Set access token
    oauth2Client.setCredentials({ access_token: accessToken });

    // Create event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        attendees: event.attendees.map((email) => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
      conferenceDataVersion: 1,
    });

    return response.data.htmlLink || '';
  } catch (error) {
    console.error('Error creating interview event:', error);
    throw new Error('Failed to create interview event');
  }
}

export async function listEvents(
  accessToken: string,
  timeMin: Date,
  timeMax: Date
): Promise<any[]> {
  try {
    // Set access token
    oauth2Client.setCredentials({ access_token: accessToken });

    // List events
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error listing events:', error);
    throw new Error('Failed to list events');
  }
}

export async function deleteEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  try {
    // Set access token
    oauth2Client.setCredentials({ access_token: accessToken });

    // Delete event
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}

export default calendar;
