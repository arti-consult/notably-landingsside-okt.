import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, Upload, Trash2, CreditCard as Edit2, X, Check, Save } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  alt_text: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export default function ImageManagement() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [uploadAltText, setUploadAltText] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
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

      await loadImages();
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

  const handleDelete = async (image: MediaItem) => {
    if (!confirm('Er du sikker på at du vil slette dette bildet?')) return;

    try {
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      const pathParts = image.storage_path.split('/');
      const bucketName = pathParts[0];
      const fileName = pathParts.slice(1).join('/');

      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Feil ved sletting av bilde');
    }
  };

  const startEditing = (image: MediaItem) => {
    setEditingId(image.id);
    setEditName(image.name);
    setEditAltText(image.alt_text || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditAltText('');
  };

  const saveEditing = async (image: MediaItem) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({
          name: editName,
          alt_text: editAltText
        })
        .eq('id', image.id);

      if (error) throw error;

      await loadImages();
      cancelEditing();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Feil ved lagring av endringer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Laster bilder...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bildebibliotek</h2>
          <p className="text-gray-600 mt-1">Administrer alle bilder på nettsiden</p>
        </div>
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Upload className="w-5 h-5" />
            Last opp bilde
          </div>
        </label>
      </div>

      {showUploadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Last opp nytt bilde</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fil: {selectedFile?.name}
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
                  <Save className="w-4 h-4" />
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

      {images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Ingen bilder funnet</p>
          <p className="text-sm text-gray-500 mt-1">Last opp ditt første bilde for å komme i gang</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 relative p-4 flex items-center justify-center min-h-[200px]">
                <img
                  src={image.public_url}
                  alt={image.alt_text || image.name}
                  className="max-w-full max-h-[300px] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EBilde ikke funnet%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="p-4">
                {editingId === image.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Navn</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Alt-tekst</label>
                      <textarea
                        value={editAltText}
                        onChange={(e) => setEditAltText(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Beskriv bildet..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditing(image)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Lagre
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.name}</h3>
                    {image.alt_text ? (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{image.alt_text}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-2">Ingen alt-tekst</p>
                    )}
                    <div className="bg-gray-50 rounded p-2 mb-3">
                      <p className="text-xs text-gray-500 mb-1">URL:</p>
                      <p className="text-xs text-gray-700 break-all font-mono">{image.public_url}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(image)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Rediger
                      </button>
                      <button
                        onClick={() => handleDelete(image)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Slett
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
