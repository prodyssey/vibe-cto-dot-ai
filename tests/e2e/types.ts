// Type definitions for E2E tests
export interface Database {
  public: {
    Tables: {
      contacts: any;
      community_waitlist: any;
      ignition_waitlist: any;
      launch_control_waitlist: any;
      adventure_sessions: any;
      [key: string]: any;
    };
  };
}

// Fallback for when the main types aren't available
export type DatabaseType = Database;