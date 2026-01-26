import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Camera, User, Edit2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile({
        full_name: data.full_name || '',
        username: data.username || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile({ ...profile, avatar_url: urlData.publicUrl });
      
      await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);

      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition"
          >
            <ChevronLeft size={22}/>
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
          <button 
            onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
            disabled={loading}
            className={`p-2.5 rounded-xl transition ${
              isEditing 
                ? 'bg-blue-600 hover:bg-blue-500' 
                : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50'
            }`}
          >
            {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={48} className="text-slate-600" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2.5 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 transition"
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <p className="text-slate-400 text-sm">Tap camera to change photo</p>
        </div>

        {/* Profile Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none transition disabled:opacity-60"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none transition disabled:opacity-60"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none transition disabled:opacity-60 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-slate-500"
            />
          </div>
        </div>

        {/* Cancel Button (when editing) */}
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              fetchProfile();
            }}
            className="w-full mt-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:bg-slate-700/50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
