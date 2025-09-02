import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

export class TestDatabase {
  private client: SupabaseClient<Database>;
  private testDataIds = new Set<string>();

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables for testing');
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  // Generic method to insert test data and track for cleanup
  async insertTestData<T extends Record<string, any>>(
    table: keyof Database['public']['Tables'],
    data: T
  ): Promise<T & { id: string }> {
    const { data: inserted, error } = await this.client
      .from(table as any)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to insert test data into ${table}: ${error.message}`);
    }

    // Track the ID for cleanup
    if (inserted?.id) {
      this.testDataIds.add(`${table}:${inserted.id}`);
    }

    return inserted;
  }

  // Verify data exists in database
  async verifyDataExists<T>(
    table: keyof Database['public']['Tables'],
    conditions: Record<string, any>
  ): Promise<T | null> {
    let query = this.client.from(table as any).select('*');
    
    // Apply conditions
    Object.entries(conditions).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Failed to verify data in ${table}: ${error.message}`);
    }

    return data as T | null;
  }

  // Verify contact form submission
  async verifyContactSubmission(email: string, sessionId: string) {
    return this.verifyDataExists('contacts', { 
      email: email.toLowerCase(), 
      session_id: sessionId 
    });
  }

  // Verify community waitlist submission
  async verifyCommunityWaitlistSubmission(email: string, sessionId?: string) {
    const conditions: Record<string, any> = { email: email.toLowerCase() };
    if (sessionId) {
      conditions.session_id = sessionId;
    }
    return this.verifyDataExists('community_waitlist', conditions);
  }

  // Verify ignition waitlist submission
  async verifyIgnitionWaitlistSubmission(sessionId: string) {
    return this.verifyDataExists('ignition_waitlist', { session_id: sessionId });
  }

  // Verify launch control waitlist submission
  async verifyLaunchControlWaitlistSubmission(sessionId: string) {
    return this.verifyDataExists('launch_control_waitlist', { session_id: sessionId });
  }

  // Verify adventure session update
  async verifyAdventureSessionUpdate(sessionId: string, expectedData: Record<string, any>) {
    const session = await this.verifyDataExists('adventure_sessions', { id: sessionId });
    if (!session) {return null;}

    // Check that expected fields match
    const matches = Object.entries(expectedData).every(([key, value]) => {
      return (session as any)[key] === value;
    });

    return matches ? session : null;
  }

  // Create test adventure session
  async createTestAdventureSession(playerName = 'Test Player') {
    const sessionData = {
      id: crypto.randomUUID(),
      player_name: playerName,
      is_generated_name: false,
      current_scene: 'start',
      choices_made: {},
      email: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return this.insertTestData('adventure_sessions', sessionData);
  }

  // Get all test data that was inserted
  getTrackedTestData(): string[] {
    return Array.from(this.testDataIds);
  }

  // Clean up all test data
  async cleanup(): Promise<void> {
    const errors: string[] = [];

    // Group IDs by table
    const tableIds = new Map<string, string[]>();
    
    this.testDataIds.forEach(id => {
      const [table, recordId] = id.split(':');
      if (!tableIds.has(table)) {
        tableIds.set(table, []);
      }
      tableIds.get(table)!.push(recordId);
    });

    // Delete from each table
    for (const [table, ids] of tableIds.entries()) {
      try {
        const { error } = await this.client
          .from(table as any)
          .delete()
          .in('id', ids);

        if (error) {
          errors.push(`Failed to cleanup ${table}: ${error.message}`);
        } else {
          console.log(`Cleaned up ${ids.length} records from ${table}`);
        }
      } catch (error) {
        errors.push(`Error cleaning up ${table}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Clear the tracking set
    this.testDataIds.clear();

    if (errors.length > 0) {
      console.warn('Cleanup errors:', errors);
      // Don't throw - we want tests to continue even if cleanup fails
    }
  }

  // Clean up specific test data by email or session ID
  async cleanupByEmail(email: string): Promise<void> {
    const tables = ['contacts', 'community_waitlist', 'ignition_waitlist', 'launch_control_waitlist'];
    
    for (const table of tables) {
      try {
        await this.client
          .from(table as any)
          .delete()
          .eq('email', email.toLowerCase());
      } catch (error) {
        console.warn(`Failed to cleanup ${table} by email:`, error);
      }
    }
  }

  async cleanupBySessionId(sessionId: string): Promise<void> {
    const tables = ['adventure_sessions', 'ignition_waitlist', 'launch_control_waitlist', 'community_waitlist', 'contacts'];
    
    for (const table of tables) {
      try {
        const column = table === 'adventure_sessions' ? 'id' : 'session_id';
        await this.client
          .from(table as any)
          .delete()
          .eq(column, sessionId);
      } catch (error) {
        console.warn(`Failed to cleanup ${table} by session ID:`, error);
      }
    }
  }

  // Check if test environment is properly configured
  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client.from('contacts').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

// Export singleton instance for tests
export const testDb = new TestDatabase();