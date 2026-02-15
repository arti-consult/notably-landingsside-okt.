import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

type OpenAIAction =
  | 'tldr'
  | 'metaTitle'
  | 'metaDescription'
  | 'keywords'
  | 'faq'
  | 'relatedTopics';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function buildPrompt(action: OpenAIAction, title: string | undefined, content: string) {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { error: 'Innhold mangler' };
  }

  switch (action) {
    case 'tldr':
      return {
        maxTokens: 150,
        messages: [
          {
            role: 'system',
            content: 'Du er en ekspert på å skrive korte, konsise sammendrag av artikler på norsk. Skriv alltid på norsk.',
          },
          {
            role: 'user',
            content: `Skriv en TLDR (Too Long; Didn't Read) sammendrag av denne artikkelen på norsk. Den skal være 2-3 setninger og fange hovedpoengene. Svar kun med sammendraget, ingen ekstra tekst.\n\nArtikkel:\n${trimmedContent.slice(0, 4000)}`,
          },
        ] as OpenAIMessage[],
      };
    case 'metaTitle':
      return {
        maxTokens: 50,
        messages: [
          {
            role: 'system',
            content: 'Du er en SEO-ekspert som skriver meta-titler på norsk. Meta-tittelen skal være mellom 50-60 tegn, inneholde relevante nøkkelord, være fengende og beskrivende.',
          },
          {
            role: 'user',
            content: `Skriv en SEO-optimalisert meta-tittel på norsk for denne artikkelen. Den skal være mellom 50-60 tegn, fengende og inneholde hovedbudskapet. Svar kun med meta-tittelen, ingen ekstra tekst.\n\nArtikkelinnhold:\n${trimmedContent.slice(0, 3000)}`,
          },
        ] as OpenAIMessage[],
      };
    case 'metaDescription':
      if (!title?.trim()) {
        return { error: 'Tittel mangler' };
      }
      return {
        maxTokens: 100,
        messages: [
          {
            role: 'system',
            content: 'Du er en SEO-ekspert som skriver meta-beskrivelser på norsk. Meta-beskrivelsen skal være mellom 150-160 tegn, inneholde relevant nøkkelord, og være overbevisende for å få brukere til å klikke.',
          },
          {
            role: 'user',
            content: `Skriv en SEO-optimalisert meta-beskrivelse på norsk for denne artikkelen. Den skal være mellom 150-160 tegn. Svar kun med meta-beskrivelsen, ingen ekstra tekst.\n\nTittel: ${title}\n\nArtikkel:\n${trimmedContent.slice(0, 3000)}`,
          },
        ] as OpenAIMessage[],
      };
    case 'keywords':
      if (!title?.trim()) {
        return { error: 'Tittel mangler' };
      }
      return {
        maxTokens: 100,
        messages: [
          {
            role: 'system',
            content: 'Du er en SEO-ekspert som identifiserer relevante nøkkelord på norsk. Skriv kun nøkkelordene separert med komma.',
          },
          {
            role: 'user',
            content: `Identifiser 5-8 relevante SEO-nøkkelord på norsk for denne artikkelen. Returner kun nøkkelordene separert med komma, ingen ekstra tekst.\n\nTittel: ${title}\n\nArtikkel:\n${trimmedContent.slice(0, 3000)}`,
          },
        ] as OpenAIMessage[],
      };
    case 'faq':
      return {
        maxTokens: 800,
        messages: [
          {
            role: 'system',
            content: 'Du er en SEO- og innholdsekspert som lager FAQ-seksjoner på norsk. FAQ-spørsmål skal være naturlige søkespørsmål brukere faktisk stiller. Svar skal være konsise, informative og verdifulle for leseren. Returner kun JSON-format: [{"question": "...", "answer": "..."}]',
          },
          {
            role: 'user',
            content: `Lag 4-6 SEO-optimaliserte ofte stilte spørsmål (FAQ) med svar på norsk basert på denne artikkelen.

Krav til spørsmål:
- Formuler som naturlige søkespørsmål (hvem, hva, hvorfor, hvordan)
- Inkluder relevante nøkkelord
- Vær spesifikk til artikkelens innhold

Krav til svar:
- Gi konsise men komplette svar (2-4 setninger)
- Vær informativ og verdifull
- Unngå å gjenta spørsmålet i svaret

Returner kun JSON-format: [{"question": "...", "answer": "..."}]. Ingen ekstra tekst eller formatering.

Artikkel:\n${trimmedContent.slice(0, 4000)}`,
          },
        ] as OpenAIMessage[],
      };
    case 'relatedTopics':
      if (!title?.trim()) {
        return { error: 'Tittel mangler' };
      }
      return {
        maxTokens: 150,
        messages: [
          {
            role: 'system',
            content: 'Du er en innholdsstrateg som foreslår relaterte emner på norsk. Returner kun emnene separert med komma.',
          },
          {
            role: 'user',
            content: `Basert på denne artikkelen, foreslå 3-5 relaterte emner på norsk som ville være gode å skrive om. Returner kun emnene separert med komma, ingen ekstra tekst.\n\nTittel: ${title}\n\nArtikkel:\n${trimmedContent.slice(0, 2000)}`,
          },
        ] as OpenAIMessage[],
      };
  }

  return { error: 'Ugyldig handling' };
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

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    return jsonResponse({ error: 'OPENAI_API_KEY is not set' }, 503);
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

  let payload: { action?: string; title?: string; content?: string };
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const actionValue = typeof payload.action === 'string' ? payload.action : '';
  const allowedActions: OpenAIAction[] = [
    'tldr',
    'metaTitle',
    'metaDescription',
    'keywords',
    'faq',
    'relatedTopics',
  ];
  if (!allowedActions.includes(actionValue as OpenAIAction)) {
    return jsonResponse({ error: 'Invalid action' }, 400);
  }
  const action = actionValue as OpenAIAction;

  const content = typeof payload.content === 'string' ? payload.content : '';
  const title = typeof payload.title === 'string' ? payload.title : undefined;

  const prompt = buildPrompt(action, title, content);
  if (!prompt || 'error' in prompt) {
    return jsonResponse({ error: prompt?.error || 'Invalid request' }, 400);
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: prompt.messages,
        max_tokens: prompt.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return jsonResponse({ error: 'OpenAI API error' }, 502);
    }

    const data: OpenAIResponse = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? '';

    let result: unknown = raw;
    if (action === 'keywords' || action === 'relatedTopics') {
      result = raw
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    } else if (action === 'faq') {
      try {
        const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        result = JSON.parse(cleaned);
      } catch {
        result = [];
      }
    }

    return jsonResponse({ result });
  } catch (error) {
    console.error('OpenAI call failed:', error);
    return jsonResponse({ error: 'OpenAI call failed' }, 500);
  }
});
