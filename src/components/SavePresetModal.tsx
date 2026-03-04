import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { PresetConfig } from '@/types/preset';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PresetConfig;
  editingPreset?: { id: string; name: string; description: string; public: boolean } | null;
}

export function SavePresetModal({ open, onOpenChange, config, editingPreset }: Props) {
  const [name, setName] = useState(editingPreset?.name || '');
  const [description, setDescription] = useState(editingPreset?.description || '');
  const [isPublic, setIsPublic] = useState(editingPreset?.public || false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error('Name and description are required');
      return;
    }
    if (!user) {
      toast.error('You must be signed in to save presets');
      return;
    }
    setSaving(true);
    try {
      if (editingPreset) {
        const { error } = await supabase
          .from('presets')
          .update({
            name: name.trim(),
            description: description.trim(),
            config: config as any,
            public: isPublic,
          })
          .eq('id', editingPreset.id);
        if (error) throw error;
        toast.success('Preset updated!');
      } else {
        const { error } = await supabase.from('presets').insert({
          name: name.trim(),
          description: description.trim(),
          config: config as any,
          public: isPublic,
          user_id: user.id,
        });
        if (error) throw error;
        toast.success('Preset saved!');
      }
      onOpenChange(false);
      navigate('/my-presets');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save preset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingPreset ? 'Edit Preset' : 'Save as Preset'}</DialogTitle>
          <DialogDescription>Give your haptic sensation a name and description.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="preset-name">Name</Label>
            <Input
              id="preset-name"
              placeholder="e.g. Stock Market Pulse"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preset-desc">Description</Label>
            <Textarea
              id="preset-desc"
              placeholder="Describe what this preset does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="preset-public"
              checked={isPublic}
              onCheckedChange={(c) => setIsPublic(c === true)}
            />
            <Label htmlFor="preset-public" className="text-sm font-normal">
              Make public (share with community)
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
