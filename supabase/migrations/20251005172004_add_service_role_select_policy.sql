/*
  # Add service role SELECT policy for waitlist

  1. Changes
    - Add policy to allow service role (edge functions) to select from waitlist
    - This is needed to check for duplicate emails
  
  2. Security
    - Service role can read waitlist to prevent duplicates
*/

CREATE POLICY "Service role can select waitlist entries"
  ON waitlist
  FOR SELECT
  TO service_role
  USING (true);