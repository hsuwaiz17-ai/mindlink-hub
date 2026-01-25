import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, ArrowLeft, LogOut, Settings as SettingsIcon, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`full_name, avatar_url, bio`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) throw error;

        if (data) {
          setFullName(data.full_name || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || '');
        }
      }
    } catch (error: any) {
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setSaving(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; // Storage bucket path

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      }
      
      setAvatarUrl(publicUrl);
      toast.success('Profile picture updated!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateProfile() {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const updates = {
          id: user.id,
          full_name: fullName,
          bio,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;
        toast.success('Profile saved!');
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 text-slate-600" />
        </Button>
        <h1 className="text-lg font-bold text-slate-800">MindLink Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <SettingsIcon className="h-6 w-6 text-slate-600" />
        </Button>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-4xl">
                {fullName ? fullName[0] : <UserCircle className="w-20 h-20" />}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 transition-all">
              <Camera className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">{fullName || "MindLink User"}</h2>
          <p className="text-slate-500 font-medium">{email}</p>
        </div>

        {/* Form Section */}
        <div className="space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing || saving}
              className="rounded-xl border-slate-200 focus:border-indigo-500 h-12"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">About Me (Bio)</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing || saving}
              className="rounded-xl border-slate-200 focus:border-indigo-500 min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {isEditing ? (
            <Button onClick={updateProfile} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full h-12 bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 rounded-xl font-bold text-lg">
              Edit Profile
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            onClick={() => supabase.auth.signOut().then(() => navigate('/auth'))}
            className="w-full h-12 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
          >
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
