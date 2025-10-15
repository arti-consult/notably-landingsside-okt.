import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { calculateSEOScore, type SEOScore } from '../utils/seo';
import { generateMetaTitle, generateMetaDescription, generateKeywords } from '../lib/openai';

interface SEOPanelProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  keywords: string[];
  slug: string;
  featuredImage?: boolean;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onKeywordsChange: (value: string[]) => void;
}

export default function SEOPanel({
  title,
  metaTitle,
  metaDescription,
  content,
  keywords,
  slug,
  featuredImage,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onKeywordsChange,
}: SEOPanelProps) {
  const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, issues: [], suggestions: [] });
  const [keywordInput, setKeywordInput] = useState('');
  const [isGeneratingMetaTitle, setIsGeneratingMetaTitle] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  useEffect(() => {
    const score = calculateSEOScore({
      title,
      metaTitle,
      metaDescription,
      content,
      keywords,
      slug,
      featuredImage,
    });
    setSeoScore(score);
  }, [title, metaTitle, metaDescription, content, keywords, slug, featuredImage]);

  const handleGenerateMetaTitle = async () => {
    if (!content) {
      alert('Vennligst skriv innhold først');
      return;
    }

    setIsGeneratingMetaTitle(true);
    try {
      const generated = await generateMetaTitle(content);
      onMetaTitleChange(generated);
    } catch (error) {
      console.error('Failed to generate meta title:', error);
      alert('Kunne ikke generere meta-tittel. Prøv igjen.');
    } finally {
      setIsGeneratingMetaTitle(false);
    }
  };

  const handleGenerateMetaDescription = async () => {
    if (!title || !content) {
      alert('Vennligst skriv tittel og innhold først');
      return;
    }

    setIsGeneratingMeta(true);
    try {
      const generated = await generateMetaDescription(title, content);
      onMetaDescriptionChange(generated);
    } catch (error) {
      console.error('Failed to generate meta description:', error);
      alert('Kunne ikke generere meta-beskrivelse. Prøv igjen.');
    } finally {
      setIsGeneratingMeta(false);
    }
  };

  const handleGenerateKeywords = async () => {
    if (!title || !content) {
      alert('Vennligst skriv tittel og innhold først');
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const generated = await generateKeywords(title, content);
      onKeywordsChange([...keywords, ...generated.filter(k => !keywords.includes(k))]);
    } catch (error) {
      console.error('Failed to generate keywords:', error);
      alert('Kunne ikke generere nøkkelord. Prøv igjen.');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      onKeywordsChange([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(keywords.filter(k => k !== keyword));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${getScoreBackground(seoScore.score)}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">SEO Score</h3>
          <span className={`text-3xl font-bold ${getScoreColor(seoScore.score)}`}>
            {seoScore.score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              seoScore.score >= 80 ? 'bg-green-600' : seoScore.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${seoScore.score}%` }}
          />
        </div>
      </div>

      {seoScore.issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-900">Problemer som må fikses</h4>
          </div>
          <ul className="space-y-1">
            {seoScore.issues.map((issue, idx) => (
              <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {seoScore.suggestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-yellow-900">Forbedringsforslag</h4>
          </div>
          <ul className="space-y-1">
            {seoScore.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Meta-tittel
              <span className="text-gray-500 ml-2">
                ({metaTitle.length}/60 tegn)
              </span>
            </label>
            <button
              onClick={handleGenerateMetaTitle}
              disabled={isGeneratingMetaTitle}
              className="text-xs flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              {isGeneratingMetaTitle ? 'Genererer...' : 'Generer med AI'}
            </button>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Skriv en SEO-optimalisert tittel"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Meta-beskrivelse
              <span className="text-gray-500 ml-2">
                ({metaDescription.length}/160 tegn)
              </span>
            </label>
            <button
              onClick={handleGenerateMetaDescription}
              disabled={isGeneratingMeta}
              className="text-xs flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              {isGeneratingMeta ? 'Genererer...' : 'Generer med AI'}
            </button>
          </div>
          <textarea
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Skriv en overbevisende beskrivelse for søkemotorer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Nøkkelord
            </label>
            <button
              onClick={handleGenerateKeywords}
              disabled={isGeneratingKeywords}
              className="text-xs flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              {isGeneratingKeywords ? 'Genererer...' : 'Generer med AI'}
            </button>
          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Legg til nøkkelord"
            />
            <button
              onClick={addKeyword}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Legg til
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-green-900">SEO Tips</h4>
        </div>
        <ul className="space-y-1 text-sm text-green-800">
          <li>• Bruk nøkkelord naturlig i tittelen og første avsnitt</li>
          <li>• Strukturer innholdet med overskrifter (H2, H3)</li>
          <li>• Legg til relevante bilder med beskrivende alt-tekst</li>
          <li>• Sørg for at artikkelen er minst 1000 ord for best resultat</li>
          <li>• Bruk interne lenker til andre artikler på nettstedet</li>
        </ul>
      </div>
    </div>
  );
}
