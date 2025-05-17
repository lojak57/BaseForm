declare module 'resend' {
  export interface EmailResponse {
    id: string;
    from: string;
    to: string[];
    created_at: string;
  }

  export interface SendEmailOptions {
    from: string;
    to: string[];
    subject: string;
    html?: string;
    text?: string;
    cc?: string[];
    bcc?: string[];
    reply_to?: string;
    attachments?: Array<{
      content: string | Buffer;
      filename: string;
    }>;
  }

  export interface EmailError {
    statusCode: number;
    message: string;
    name: string;
  }

  export interface EmailResult {
    data: EmailResponse | null;
    error: EmailError | null;
  }

  export class Resend {
    constructor(apiKey: string);
    
    emails: {
      send: (options: SendEmailOptions) => Promise<EmailResult>;
    };
  }
} 