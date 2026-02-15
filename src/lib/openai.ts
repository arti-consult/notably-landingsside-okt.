import { supabase } from './supabase';

type OpenAIAction =
  | 'tldr'
  | 'metaTitle'
  | 'metaDescription'
  | 'keywords'
  | 'faq'
  | 'relatedTopics';

async function invokeOpenAI<T>(
  action: OpenAIAction,
  payload: { title?: string; content: string }
): Promise<T> {
  const { data, error } = await supabase.functions.invoke('openai-generate', {
    body: {
      action,
      ...payload,
    },
  });

  if (error) {
    console.error('OpenAI edge function error:', error);
    throw error;
  }

  if (!data || typeof data.result === 'undefined') {
    throw new Error('OpenAI response missing');
  }

  return data.result as T;
}

export async function generateTLDR(articleContent: string): Promise<string> {
  const plainText = stripHtml(articleContent);
  return await invokeOpenAI<string>('tldr', { content: plainText });
}

export async function generateMetaTitle(articleContent: string): Promise<string> {
  const plainText = stripHtml(articleContent);
  return await invokeOpenAI<string>('metaTitle', { content: plainText });
}

export async function generateMetaDescription(title: string, articleContent: string): Promise<string> {
  const plainText = stripHtml(articleContent);
  return await invokeOpenAI<string>('metaDescription', { title, content: plainText });
}

export async function generateKeywords(title: string, articleContent: string): Promise<string[]> {
  const plainText = stripHtml(articleContent);
  return await invokeOpenAI<string[]>('keywords', { title, content: plainText });
}

export async function generateFAQ(articleContent: string): Promise<Array<{ question: string; answer: string }>> {
  const plainText = stripHtml(articleContent);
  return await invokeOpenAI<Array<{ question: string; answer: string }>>('faq', { content: plainText });
}

export async function suggestRelatedTopics(title: string, articleContent: string): Promise<string[]> {
  const plainText = stripHtml(articleContent);
  return await invokeOpenAI<string[]>('relatedTopics', { title, content: plainText });
}

function stripHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}
