interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(messages: OpenAIMessage[], maxTokens = 500): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured. Returning mock response.');
    return 'OpenAI API ikke konfigurert. Vennligst legg til VITE_OPENAI_API_KEY miljøvariabel.';
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
}

export async function generateTLDR(articleContent: string): Promise<string> {
  const plainText = stripHtml(articleContent);

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'Du er en ekspert på å skrive korte, konsise sammendrag av artikler på norsk. Skriv alltid på norsk.',
    },
    {
      role: 'user',
      content: `Skriv en TLDR (Too Long; Didn't Read) sammendrag av denne artikkelen på norsk. Den skal være 2-3 setninger og fange hovedpoengene. Svar kun med sammendraget, ingen ekstra tekst.\n\nArtikkel:\n${plainText.slice(0, 4000)}`,
    },
  ];

  return await callOpenAI(messages, 150);
}

export async function generateMetaTitle(articleContent: string): Promise<string> {
  const plainText = stripHtml(articleContent);

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'Du er en SEO-ekspert som skriver meta-titler på norsk. Meta-tittelen skal være mellom 50-60 tegn, inneholde relevante nøkkelord, være fengende og beskrivende.',
    },
    {
      role: 'user',
      content: `Skriv en SEO-optimalisert meta-tittel på norsk for denne artikkelen. Den skal være mellom 50-60 tegn, fengende og inneholde hovedbudskapet. Svar kun med meta-tittelen, ingen ekstra tekst.\n\nArtikkelinnhold:\n${plainText.slice(0, 3000)}`,
    },
  ];

  return await callOpenAI(messages, 50);
}

export async function generateMetaDescription(title: string, articleContent: string): Promise<string> {
  const plainText = stripHtml(articleContent);

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'Du er en SEO-ekspert som skriver meta-beskrivelser på norsk. Meta-beskrivelsen skal være mellom 150-160 tegn, inneholde relevant nøkkelord, og være overbevisende for å få brukere til å klikke.',
    },
    {
      role: 'user',
      content: `Skriv en SEO-optimalisert meta-beskrivelse på norsk for denne artikkelen. Den skal være mellom 150-160 tegn. Svar kun med meta-beskrivelsen, ingen ekstra tekst.\n\nTittel: ${title}\n\nArtikkel:\n${plainText.slice(0, 3000)}`,
    },
  ];

  return await callOpenAI(messages, 100);
}

export async function generateKeywords(title: string, articleContent: string): Promise<string[]> {
  const plainText = stripHtml(articleContent);

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'Du er en SEO-ekspert som identifiserer relevante nøkkelord på norsk. Skriv kun nøkkelordene separert med komma.',
    },
    {
      role: 'user',
      content: `Identifiser 5-8 relevante SEO-nøkkelord på norsk for denne artikkelen. Returner kun nøkkelordene separert med komma, ingen ekstra tekst.\n\nTittel: ${title}\n\nArtikkel:\n${plainText.slice(0, 3000)}`,
    },
  ];

  const result = await callOpenAI(messages, 100);
  return result.split(',').map(k => k.trim()).filter(k => k.length > 0);
}

export async function generateFAQ(articleContent: string): Promise<Array<{ question: string; answer: string }>> {
  const plainText = stripHtml(articleContent);

  const messages: OpenAIMessage[] = [
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

Artikkel:\n${plainText.slice(0, 4000)}`,
    },
  ];

  const result = await callOpenAI(messages, 800);

  try {
    const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedResult);
  } catch {
    return [];
  }
}

export async function suggestRelatedTopics(title: string, articleContent: string): Promise<string[]> {
  const plainText = stripHtml(articleContent);

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: 'Du er en innholdsstrateg som foreslår relaterte emner på norsk. Returner kun emnene separert med komma.',
    },
    {
      role: 'user',
      content: `Basert på denne artikkelen, foreslå 3-5 relaterte emner på norsk som ville være gode å skrive om. Returner kun emnene separert med komma, ingen ekstra tekst.\n\nTittel: ${title}\n\nArtikkel:\n${plainText.slice(0, 2000)}`,
    },
  ];

  const result = await callOpenAI(messages, 150);
  return result.split(',').map(t => t.trim()).filter(t => t.length > 0);
}

function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}
