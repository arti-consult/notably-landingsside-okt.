/*
  # Fix waitlist edge function access

  1. Changes
    - Add policy to allow service role (edge functions) to insert into waitlist
    - Add policy to allow service role to update email_sent status
  
  2. Security
    - Service role policies allow edge functions to manage waitlist entries
    - Anonymous users can still sign up via the frontend
*/

-- Allow service role to insert waitlist entries (for edge functions)
CREATE POLICY "Service role can insert waitlist entries"
  ON waitlist
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to update waitlist entries (for edge functions)
CREATE POLICY "Service role can update waitlist entries"
  ON waitlist
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);