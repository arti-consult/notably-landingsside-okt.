import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ArticleEditor from '../components/ArticleEditor';
import SEOPanel from '../components/SEOPanel';
import { generateSlug, calculateReadingTime, generateTableOfContents } from '../utils/seo';
import { generateTLDR, generateFAQ } from '../lib/openai';
import { Save, Eye, ArrowLeft, Sparkles, Image as ImageIcon, Upload, X, Plus, Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  file_name: string;
  public_url: string;
  alt_text: string;
}

export default function ArticleManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id && id !== 'new');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tldr, setTldr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>('draft');
  const [featuredImageId, setFeaturedImageId] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingTldr, setGeneratingTldr] = useState(false);
  const [faq, setFaq] = useState<Array<{ question: string; answer: string }>>([]);
  const [generatingFaq, setGeneratingFaq] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [mediaImages, setMediaImages] = useState<MediaItem[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadAltText, setUploadAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    loadCategories();
    const loadData = async () => {
      await loadMediaImages();
      if (isEditing) {
        await loadArticle();
      }
    };
    loadData();
  }, [id]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('article_categories')
      .select('id, name')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const loadMediaImages = async () => {
    const { data } = await supabase
      .from('media_library')
      .select('id, name, file_name, public_url, alt_text')
      .order('created_at', { ascending: false });

    if (data) {
      setMediaImages(data);
    }
  };

  const loadArticle = async () => {
    if (!id) return;

    const { data: article } = await supabase
      .from('articles')
      .select(`
        *,
        article_seo_metadata (*),
        article_tags (tag),
        media_library!articles_featured_image_id_fkey (public_url)
      `)
      .eq('id', id)
      .single();

    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setContent(article.content || '');
      setExcerpt(article.excerpt || '');
      setTldr(article.tldr || '');
      setFaq(article.faq_json || []);
      setCategoryId(article.category_id || '');
      setStatus(article.status);
      setFeaturedImageId(article.featured_image_id || '');

      if (article.media_library) {
        setFeaturedImageUrl(article.media_library.public_url);
      }

      if (article.article_seo_metadata) {
        setMetaTitle(article.article_seo_metadata.meta_title || '');
        setMetaDescription(article.article_seo_metadata.meta_description || '');
        setKeywords(article.article_seo_metadata.meta_keywords || []);
      }

      if (article.article_tags) {
        const tags = article.article_tags.map((t: { tag: string }) => t.tag);
        setKeywords(tags);
      }
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(generateSlug(newTitle));
    }
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const { data, error } = await supabase
      .from('article_categories')
      .insert({
        name: newCategoryName,
        slug: generateSlug(newCategoryName),
      })
      .select()
      .single();

    if (data) {
      setCategories([...categories, data]);
      setCategoryId(data.id);
      setNewCategoryName('');
      setShowCategoryForm(false);
    } else if (error) {
      alert('Kunne ikke opprette kategori: ' + error.message);
    }
  };

  const handleGenerateTldr = async () => {
    if (!content) {
      alert('Vennligst skriv innhold først');
      return;
    }

    setGeneratingTldr(true);
    try {
      const generated = await generateTLDR(content);
      setTldr(generated);
    } catch (error) {
      console.error('Failed to generate TLDR:', error);
      alert('Kunne ikke generere TLDR. Prøv igjen.');
    } finally {
      setGeneratingTldr(false);
    }
  };

  const handleGenerateFaq = async () => {
    if (!content) {
      alert('Vennligst skriv innhold først');
      return;
    }

    setGeneratingFaq(true);
    try {
      const generated = await generateFAQ(content);
      setFaq(generated);
    } catch (error) {
      console.error('Failed to generate FAQ:', error);
      alert('Kunne ikke generere FAQ. Prøv igjen.');
    } finally {
      setGeneratingFaq(false);
    }
  };

  const handleAddFaqItem = () => {
    setFaq([...faq, { question: '', answer: '' }]);
  };

  const handleRemoveFaqItem = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index));
  };

  const handleUpdateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faq];
    updated[index][field] = value;
    setFaq(updated);
  };

  const handleSave = async (newStatus?: typeof status) => {
    if (!title || !slug || !content) {
      alert('Vennligst fyll ut tittel, slug og innhold');
      return;
    }

    setSaving(true);
    try {
      const readingTime = calculateReadingTime(content);
      const toc = generateTableOfContents(content);
      const articleStatus = newStatus || status;

      const articleData = {
        title,
        slug,
        content,
        excerpt,
        tldr,
        faq_json: faq,
        category_id: categoryId || null,
        status: articleStatus,
        author_id: user?.id,
        featured_image_id: featuredImageId || null,
        reading_time_minutes: readingTime,
        published_at: articleStatus === 'published' && !isEditing ? new Date().toISOString() : undefined,
      };

      let articleId = id;

      if (isEditing) {
        await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
      } else {
        const { data, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single();

        if (error) throw error;
        articleId = data.id;
      }

      await supabase
        .from('article_seo_metadata')
        .upsert({
          article_id: articleId,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: keywords,
        });

      await supabase
        .from('article_table_of_contents')
        .upsert({
          article_id: articleId,
          toc_json: toc,
        });

      await supabase
        .from('article_tags')
        .delete()
        .eq('article_id', articleId);

      if (keywords.length > 0) {
        await supabase
          .from('article_tags')
          .insert(keywords.map(tag => ({ article_id: articleId, tag })));
      }

      alert('Artikkelen ble lagret!');
      if (!isEditing) {
        navigate(`/admin/articles/edit/${articleId}`);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Kunne ikke lagre artikkelen. Prøv igjen.');
    } finally {
      setSaving(false);
    }
  };

  const handleInsertImage = (imageUrl: string) => {
    const imgTag = `<img src="${imageUrl}" alt="" class="max-w-full h-auto rounded-lg" />`;
    setContent(content + imgTag);
    setShowImagePicker(false);
  };

  const handleSelectFeaturedImage = (image: MediaItem) => {
    setFeaturedImageId(image.id);
    setFeaturedImageUrl(image.public_url);
    setShowImagePicker(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadAltText('');
      setShowUploadDialog(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('admin-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('admin-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          name: selectedFile.name,
          alt_text: uploadAltText || '',
          file_name: selectedFile.name,
          storage_path: `admin-images/${filePath}`,
          public_url: publicUrlData.publicUrl,
          file_size: selectedFile.size,
          mime_type: selectedFile.type
        });

      if (dbError) throw dbError;

      await loadMediaImages();
      setShowUploadDialog(false);
      setSelectedFile(null);
      setUploadAltText('');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Feil ved opplasting av bilde');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/articles')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Rediger artikkel' : 'Ny artikkel'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Utkast</option>
                <option value="published">Publisert</option>
                <option value="scheduled">Planlagt</option>
                <option value="archived">Arkivert</option>
              </select>
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Lagrer...' : 'Lagre'}
              </button>
              {status === 'draft' && (
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Eye className="w-4 h-4" />
                  Publiser
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tittel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Skriv artikkelens tittel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL-slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="artikkel-url-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: notably.no/artikler/{slug || 'artikkel-url-slug'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <div className="flex gap-2">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Velg kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Ny kategori
                </button>
              </div>
              {showCategoryForm && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Kategorinavn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleCreateCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Opprett
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hovedbilde
                </label>
                <button
                  onClick={() => setShowImagePicker(true)}
                  className="text-sm flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  <ImageIcon className="w-4 h-4" />
                  Velg bilde
                </button>
              </div>
              {featuredImageUrl && (
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  TLDR (Too Long; Didn't Read)
                </label>
                <button
                  onClick={handleGenerateTldr}
                  disabled={generatingTldr}
                  className="text-sm flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {generatingTldr ? 'Genererer...' : 'Generer med AI'}
                </button>
              </div>
              <textarea
                value={tldr}
                onChange={(e) => setTldr(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="En kort oppsummering av artikkelen (2-3 setninger)"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  FAQ (Ofte stilte spørsmål)
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateFaq}
                    disabled={generatingFaq}
                    className="text-sm flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {generatingFaq ? 'Genererer...' : 'Generer med AI'}
                  </button>
                  <button
                    onClick={handleAddFaqItem}
                    className="text-sm flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                    Legg til
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {faq.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    Ingen FAQ-spørsmål ennå. Klikk "Generer med AI" eller "Legg til" for å legge til spørsmål.
                  </p>
                ) : (
                  faq.map((item, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <label className="text-sm font-medium text-gray-700">Spørsmål {index + 1}</label>
                        <button
                          onClick={() => handleRemoveFaqItem(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => handleUpdateFaqItem(index, 'question', e.target.value)}
                        placeholder="Skriv spørsmålet her..."
                        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700 block mb-2">Svar</label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => handleUpdateFaqItem(index, 'answer', e.target.value)}
                        rows={3}
                        placeholder="Skriv svaret her..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Innhold
              </label>
              <ArticleEditor
                content={content}
                onChange={setContent}
                onImageClick={() => setShowImagePicker(true)}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Optimalisering</h2>
              <SEOPanel
                title={title}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                content={content}
                keywords={keywords}
                slug={slug}
                featuredImage={Boolean(featuredImageId)}
                onMetaTitleChange={setMetaTitle}
                onMetaDescriptionChange={setMetaDescription}
                onKeywordsChange={setKeywords}
              />
            </div>
          </div>
        </div>
      </div>

      {showImagePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">Velg bilde</h3>
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload className="w-4 h-4" />
                    Last opp nytt bilde
                  </div>
                </label>
                <button
                  onClick={() => setShowImagePicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto flex-1">
              {mediaImages.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Ingen bilder funnet</p>
                  <p className="text-sm text-gray-500">Last opp ditt første bilde for å komme i gang</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaImages.map(image => (
                    <div
                      key={image.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white group"
                    >
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                          src={image.public_url}
                          alt={image.alt_text || image.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EBilde ikke funnet%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">{image.name}</p>
                        {image.alt_text && (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{image.alt_text}</p>
                        )}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleInsertImage(image.public_url)}
                            className="w-full text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Sett inn i artikkel
                          </button>
                          <button
                            onClick={() => handleSelectFeaturedImage(image)}
                            className="w-full text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Bruk som hovedbilde
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showUploadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Last opp nytt bilde</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fil: <span className="font-normal">{selectedFile?.name}</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt-tekst (beskrivelse)
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="Beskriv bildet for tilgjengelighet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alt-teksten brukes for skjermlesere og vises hvis bildet ikke kan lastes
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Laster opp...' : 'Last opp'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadDialog(false);
                    setSelectedFile(null);
                    setUploadAltText('');
                  }}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
