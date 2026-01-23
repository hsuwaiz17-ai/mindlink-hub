import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
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

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setFullName(data.full_name || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || '');
        }
      }
    } catch (error: any) {
      alert('Error loading user data!');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const updates = {
          id: user.id,
          full_name: fullName,
          bio,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) {
          throw error;
        }
        alert('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error: any) {
      alert('Error updating the profile!');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setLoading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      }
      setAvatarUrl(publicUrl);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    else window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Your Profile</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="text-2xl">{fullName ? fullName[0] : 'U'}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>
          )}
        </div>
        <h2 className="text-xl font-semibold text-foreground mt-3">{fullName || "Guest User"}</h2>
        <p className="text-muted-foreground">{email}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing || loading}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={!isEditing || loading}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Button onClick={() => setIsEditing(!isEditing)} disabled={loading}>
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
        {isEditing && (
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        )}
        <Button variant="outline" onClick={handleSignOut} disabled={loading}>
          Sign Out
        </Button>
        <Button variant="destructive" disabled={loading}>
          Delete Account (Coming Soon)
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
