import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PresetCard } from '@/components/PresetCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import type { PresetConfig } from '@/types/preset';

export default function Community() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  const { data: presets, isLoading } = useQuery({
    queryKey: ['community-presets', filter],
    queryFn: async () => {
      let query = supabase.from('presets').select('*').order('created_at', { ascending: false });

      if (filter === 'public') {
        query = query.eq('public', true);
      } else if (filter === 'mine' && user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('public', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
  });

  const filtered = (presets || []).filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const cfg = p.config as PresetConfig;
    return (
      p.name.toLowerCase().includes(s) ||
      (p.description || '').toLowerCase().includes(s) ||
      cfg.rule_front?.data_source?.toLowerCase().includes(s) ||
      cfg.rule_back?.data_source?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Community Presets</h1>
      <p className="text-muted-foreground mb-6">Browse and load haptic sensation presets shared by the community</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, or ticker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Public</SelectItem>
            <SelectItem value="public">Public Only</SelectItem>
            {user && <SelectItem value="mine">My Presets</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No presets found. Be the first to share one!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={{ ...preset, config: preset.config as PresetConfig }}
              isOwner={user?.id === preset.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
