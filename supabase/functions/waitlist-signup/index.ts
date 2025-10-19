import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Ugyldig e-postadresse' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Du er allerede på ventelisten' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({ email });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Kunne ikke melde deg på ventelisten' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Tjenesten er midlertidig utilgjengelig. Prøv igjen senere.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audienceResponse = await fetch('https://api.resend.com/audiences/7cc7b32f-541e-4609-bc59-cc940bfdb41b/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        unsubscribed: false,
      }),
    });

    if (!audienceResponse.ok) {
      const audienceError = await audienceResponse.text();
      console.error('Resend Audience API error:', audienceError);
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Notably <kontakt@notably.no>',
        to: [email],
        subject: 'Venteliste bekreftet',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #2563eb; font-size: 28px; margin: 0 0 8px 0; font-weight: 600;">Notably</h1>
                  </div>
                  
                  <h2 style="color: #111827; font-size: 24px; margin: 0 0 24px 0; font-weight: 600;">Takk! Du står på ventelisten 🚀</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">Vi laget Notably for at folk skal kunne være mer til stede i møter – uten å miste innsikt og oppfølging.</p>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Du får beskjed så snart du får tilgang til appen.</p>
                  
                  <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <div style="margin-bottom: 20px;">
                      <h3 style="color: #111827; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Beste på norsk:</h3>
                      <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0;">Notably er spesialtrent for norske møtenotater.</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                      <h3 style="color: #111827; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Fang alt viktig:</h3>
                      <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0;">Automatiske transkripsjoner, delbare sammendrag og tydelige oppgaver/beslutninger.</p>
                    </div>
                    
                    <div>
                      <h3 style="color: #111827; font-size: 16px; margin: 0 0 8px 0; font-weight: 600;">Personvern først:</h3>
                      <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0;">Bygd for bedrifter – hostet i Europa og GDPR-kompatibelt.</p>
                    </div>
                  </div>
                  
                  <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin-bottom: 32px; border-radius: 4px;">
                    <p style="color: #1e40af; font-size: 15px; margin: 0; line-height: 1.6;">Har du spørsmål eller vil dele hvordan dere håndterer møtenotater i dag? Svar på denne e-posten – vi leser alt.</p>
                  </div>
                  
                  <div style="text-align: center; padding-top: 32px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px 0;">Du mottar denne e-posten fordi du meldte deg på ventelisten på notably.no.</p>
                    <p style="color: #9ca3af; font-size: 13px; margin: 0;">© Notably</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      
      await supabase
        .from('waitlist')
        .update({ email_sent: false })
        .eq('email', email);
    } else {
      await supabase
        .from('waitlist')
        .update({ email_sent: true })
        .eq('email', email);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Du er nå på ventelisten! Sjekk e-posten din.' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Noe gikk galt. Prøv igjen senere.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
