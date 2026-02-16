import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Upload, Save } from 'lucide-react';

interface AdminProfile {
  full_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
}

export default function AdminProfileSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdminProfile>({
    full_name: '',
    bio: '',
    profile_picture_url: null,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('admin_users')
      .select('full_name, bio, profile_picture_url')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        bio: data.bio || '',
        profile_picture_url: data.profile_picture_url,
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user) return;

    const file = event.target.files[0];

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Vennligst velg en bildefil' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('admin-profile-pictures')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('admin-profile-pictures')
        .getPublicUrl(fileName);

      setProfile({ ...profile, profile_picture_url: publicUrl });
      setMessage({ type: 'success', text: 'Profilbilde lastet opp' });
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Kunne ikke laste opp profilbilde' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const displayName = profile.full_name?.trim() || 'Notably Team';

      const { error } = await supabase
        .from('admin_users')
        .update({
          full_name: profile.full_name?.trim() || null,
          bio: profile.bio || null,
          profile_picture_url: profile.profile_picture_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      const { error: articleSyncError } = await supabase
        .from('articles')
        .update({
          author_name: displayName,
          author_profile_picture_url: profile.profile_picture_url,
        })
        .eq('author_id', user.id);

      if (articleSyncError) {
        console.error('Error syncing author data to articles:', articleSyncError);
        setMessage({
          type: 'success',
          text: 'Profil oppdatert, men kunne ikke synkronisere eksisterende artikler.',
        });
        return;
      }

      setMessage({ type: 'success', text: 'Profil oppdatert og synkronisert til artikler' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Kunne ikke lagre profil' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profilinnstillinger</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profilbilde
            </label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt="Profilbilde"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Laster opp...' : 'Last opp bilde'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG eller GIF (maks 5 MB)</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Fullt navn
            </label>
            <input
              type="text"
              id="full_name"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Skriv inn ditt fulle navn"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Biografi
            </label>
            <textarea
              id="bio"
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Skriv en kort biografi om deg selv"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-post
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">E-post kan ikke endres</p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Lagrer...' : 'Lagre endringer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
