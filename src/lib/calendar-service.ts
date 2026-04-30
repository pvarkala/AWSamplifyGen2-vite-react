// Gmail Calendar Integration Service

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export interface GmailAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

class CalendarService {
  private readonly GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
  
  private readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.REACT_APP_GOOGLE_CLIENT_ID;
  private readonly REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || import.meta.env.REACT_APP_REDIRECT_SIGN_IN;
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];

  // Initiate Google OAuth flow for calendar access
  initiateGoogleAuth(): void {
    const authUrl = new URL(this.GOOGLE_AUTH_URL);
    
    authUrl.searchParams.set('client_id', this.CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', this.REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.SCOPES.join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    
    // Store state for security
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('google_auth_state', state);
    authUrl.searchParams.set('state', state);
    
    window.location.href = authUrl.toString();
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, state: string): Promise<GmailAuthResponse> {
    // Verify state to prevent CSRF attacks
    const storedState = sessionStorage.getItem('google_auth_state');
    if (!storedState || storedState !== state) {
      throw new Error('Invalid state parameter. Possible CSRF attack.');
    }
    
    sessionStorage.removeItem('google_auth_state');
    
    const response = await fetch(this.GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || import.meta.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code for token');
    }

    return response.json();
  }

  // Get user's calendar events
  async getCalendarEvents(accessToken: string, timeMin?: Date, timeMax?: Date): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({
      access_token: accessToken,
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    if (timeMin) {
      params.set('timeMin', timeMin.toISOString());
    }
    if (timeMax) {
      params.set('timeMax', timeMax.toISOString());
    }

    const response = await fetch(
      `${this.GOOGLE_CALENDAR_API}/calendars/primary/events?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    const data = await response.json();
    return data.items || [];
  }

  // Create a new calendar event
  async createCalendarEvent(accessToken: string, event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await fetch(`${this.GOOGLE_CALENDAR_API}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    return response.json();
  }

  // Get user's Google profile information
  async getUserProfile(accessToken: string): Promise<{
    id: string;
    email: string;
    name: string;
    picture: string;
  }> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken: string): Promise<GmailAuthResponse> {
    const response = await fetch(this.GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || import.meta.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    return response.json();
  }

  // Revoke access token
  async revokeToken(accessToken: string): Promise<void> {
    const response = await fetch('https://oauth2.googleapis.com/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to revoke access token');
    }
  }
}

export const calendarService = new CalendarService();
