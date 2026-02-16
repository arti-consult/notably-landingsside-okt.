import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const deployHookUrl = Deno.env.get('VERCEL_DEPLOY_HOOK_URL');
  if (!deployHookUrl) {
    return jsonResponse({ error: 'VERCEL_DEPLOY_HOOK_URL is not set' }, 503);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    return jsonResponse({ error: 'Supabase environment not configured' }, 500);
  }

  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: authData, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !authData?.user) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from('admin_users')
    .select('id')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (adminError) {
    console.error('Admin check failed:', adminError);
    return jsonResponse({ error: 'Admin check failed' }, 500);
  }

  if (!adminUser) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  try {
    const hookResponse = await fetch(deployHookUrl, {
      method: 'POST',
    });

    if (!hookResponse.ok) {
      const hookBody = await hookResponse.text();
      console.error('Deploy hook failed:', hookResponse.status, hookBody);
      return jsonResponse({ error: 'Deploy hook failed' }, 502);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Trigger rebuild failed:', error);
    return jsonResponse({ error: 'Trigger rebuild failed' }, 500);
  }
});
