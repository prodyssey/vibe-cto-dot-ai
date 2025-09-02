import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

test.describe('RLS Policy Debug', () => {
  test('should test RLS policy with anon key', async () => {
    // Test the exact same setup that the contact form uses
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Testing with:');
    console.log('- Supabase URL:', supabaseUrl);
    console.log('- Anon key exists:', !!anonKey);
    
    if (!supabaseUrl || !anonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Create client exactly like the contact form does
    const supabase = createClient(supabaseUrl, anonKey);
    
    const testContact = {
      name: 'RLS Test User',
      email: 'rls-test@example.com',
      phone: null,
      company: null,
      inquiry_type: 'general',
      preferred_contact: 'email',
      message: 'Testing RLS policy with anon key',
      source: 'contact_form',
      status: 'pending',
      session_id: crypto.randomUUID(),
    };
    
    console.log('Attempting insert with anon key...');
    
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(testContact)
        .select()
        .single();
      
      if (error) {
        console.log('Insert failed with error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // This is expected if RLS is blocking it
        expect(error.code).toBe('42501'); // RLS violation
      } else {
        console.log('Insert succeeded:', data);
        
        // Clean up if it worked
        await supabase.from('contacts').delete().eq('id', data.id);
        
        expect(data.name).toBe('RLS Test User');
      }
    } catch (error) {
      console.log('Insert threw exception:', error);
      throw error;
    }
  });
  
  test('should check current RLS policies', async () => {
    // Use service role to check the actual policies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.log('Service role key not available, skipping policy check');
      return;
    }
    
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    try {
      // Query the pg_policies table to see what policies exist
      const { data: policies, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'contacts');
        
      if (error) {
        console.log('Could not query policies:', error);
      } else {
        console.log('Current RLS policies for contacts table:');
        policies?.forEach(policy => {
          console.log(`- ${policy.policyname}: ${policy.cmd} for ${policy.roles}`);
          console.log(`  Check: ${policy.qual}`);
          console.log(`  With Check: ${policy.with_check}`);
        });
      }
    } catch (error) {
      console.log('Policy check failed:', error);
    }
  });
});