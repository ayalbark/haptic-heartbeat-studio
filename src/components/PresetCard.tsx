import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Eye, Lock, Globe, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { PresetConfig } from '@/types/preset';
import { PATTERN_LABELS } from '@/types/preset';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PresetData {
  id: string;
  name: string;
  description: string | null;
  config: PresetConfig;
  public: boolean;
  user_id: string;
  created_at: string;
}

interface Props {
  preset: PresetData;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
  onTogglePublic?: (id: string, isPublic: boolean) => void;
  onEdit?: (preset: PresetData) => void;
}

function getPatternEmoji(pattern?: string) {
  const map: Record<string, string> = {
    rising: '📈',
    falling: '📉',
    pulse_all: '💓',
  };
  return map[pattern || ''] || '⚡';
}

export function PresetCard({ preset, isOwner, onDelete, onTogglePublic, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const cfg = preset.config;

  const tickers = [cfg.rule_front?.data_source, cfg.rule_back?.data_source].filter(Boolean);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPatternEmoji(cfg.rule_front?.pattern)}</span>
            <CardTitle className="text-base">{preset.name}</CardTitle>
          </div>
          {isOwner && (
            <Badge variant={preset.public ? 'default' : 'secondary'} className="text-xs shrink-0">
              {preset.public ? <Globe className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
              {preset.public ? 'Public' : 'Private'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {preset.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{preset.description}</p>
        )}

        {tickers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tickers.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate(`/?preset=${preset.id}`)}>
            Load
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            <Eye className="mr-1 h-3 w-3" />
            {expanded ? 'Hide' : 'Preview'}
            {expanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
          </Button>
          {isOwner && (
            <>
              {onEdit && (
                <Button size="sm" variant="ghost" onClick={() => onEdit(preset)}>
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
              {onTogglePublic && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onTogglePublic(preset.id, !preset.public)}
                >
                  {preset.public ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                </Button>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Preset</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{preset.name}"? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(preset.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
        </div>

        {expanded && (
          <div className="mt-3 rounded-lg bg-muted p-3 text-xs space-y-2 animate-in slide-in-from-top-2">
            {(cfg.rule_front || cfg.rule_back) && (cfg.rule_front?.data_source || cfg.rule_back?.data_source) && (
              <div>
                <p className="font-semibold mb-1">Rule:</p>
                <p>Ticker: {cfg.rule_front?.data_source || cfg.rule_back?.data_source}</p>
                <p>Pattern: {PATTERN_LABELS[(cfg.rule_front || cfg.rule_back)?.pattern as keyof typeof PATTERN_LABELS] || PATTERN_LABELS.pulse_all}</p>
                <p>Intensity: {(cfg.rule_front || cfg.rule_back)?.intensity ?? 5}/10</p>
              </div>
            )}
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={() => navigate(`/?preset=${preset.id}`)}
            >
              Load This Preset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
