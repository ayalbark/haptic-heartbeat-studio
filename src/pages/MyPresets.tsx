import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PresetCard } from '@/components/PresetCard';
import { SavePresetModal } from '@/components/SavePresetModal';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PresetConfig } from '@/types/preset';

export default function MyPresets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingPreset, setEditingPreset] = useState<any>(null);

  const { data: presets, isLoading } = useQuery({
    queryKey: ['my-presets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('presets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-presets'] });
      toast.success('Preset deleted');
    },
    onError: () => toast.error('Failed to delete preset'),
  });

  const togglePublicMutation = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const { error } = await supabase.from('presets').update({ public: isPublic }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-presets'] });
      toast.success('Visibility updated');
    },
    onError: () => toast.error('Failed to update visibility'),
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">My Presets</h1>
        <p className="text-muted-foreground mb-6">Sign in to view and manage your saved presets.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Presets</h1>
          <p className="text-muted-foreground mt-1">Manage your saved haptic sensation presets</p>
        </div>
        <Button onClick={() => navigate('/')}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (presets || []).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          You haven't saved any presets yet. Go to the designer to create one!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(presets || []).map((preset) => (
            <PresetCard
              key={preset.id}
              preset={{ ...preset, config: preset.config as PresetConfig }}
              isOwner
              onDelete={(id) => deleteMutation.mutate(id)}
              onTogglePublic={(id, isPublic) => togglePublicMutation.mutate({ id, isPublic })}
              onEdit={(p) => setEditingPreset(p)}
            />
          ))}
        </div>
      )}

      {editingPreset && (
        <SavePresetModal
          open={!!editingPreset}
          onOpenChange={(open) => {
            if (!open) {
              setEditingPreset(null);
              queryClient.invalidateQueries({ queryKey: ['my-presets'] });
            }
          }}
          config={editingPreset.config as PresetConfig}
          editingPreset={editingPreset}
        />
      )}
    </div>
  );
}
