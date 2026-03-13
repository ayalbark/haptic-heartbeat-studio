import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RuleSection } from '@/components/RuleSection';
import { BodyVisualization } from '@/components/BodyVisualization';
import { StockInfoCard } from '@/components/StockInfoCard';
import { StockWavesBackground } from '@/components/StockWavesBackground';
import { SavePresetModal } from '@/components/SavePresetModal';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { activatePreset, testPattern } from '@/lib/nodeRed';
import { fetchQuote } from '@/lib/stock';
import type { RuleConfig, PresetConfig } from '@/types/preset';
import { EMPTY_RULE as emptyRule } from '@/types/preset';

export default function Index() {
  const [rule, setRule] = useState<RuleConfig>({ ...emptyRule });
  const [saveOpen, setSaveOpen] = useState(false);
  const [activating, setActivating] = useState(false);
  const [stockDirection, setStockDirection] = useState<'up' | 'down' | null>(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load preset from URL param
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      supabase
        .from('presets')
        .select('config')
        .eq('id', presetId)
        .single()
        .then(({ data, error }) => {
          if (data?.config) {
            const cfg = data.config as unknown as PresetConfig;
            if (cfg.rule_front) setRule(cfg.rule_front);
            toast.success('Preset loaded!');
          }
        });
    }
  }, [searchParams]);

  // Fetch stock for direction (for body glow)
  useEffect(() => {
    if (!rule.data_source?.trim()) {
      setStockDirection(null);
      return;
    }
    const t = setTimeout(() => {
      fetchQuote(rule.data_source.trim())
        .then((q) => {
          if (q && q.dp != null) setStockDirection(q.dp >= 0 ? 'up' : 'down');
          else setStockDirection(null);
        })
        .catch(() => setStockDirection(null));
    }, 300);
    return () => clearTimeout(t);
  }, [rule.data_source]);

  const config: PresetConfig = {
    rule_front: rule,
    rule_back: null,
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#0A1929]">
      <StockWavesBackground />
      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Feel The Market
          </h1>
          <p className="mt-2 text-[#00D9FF]/80">
            Translate stock movements into embodied sensation
          </p>
        </div>

        <div className="mb-4">
          <StockInfoCard ticker={rule.data_source} intensity={rule.intensity} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
          <RuleSection
            title="Stock Rule"
            rule={rule}
            variant="design"
            onChange={setRule}
            onFocus={() => {}}
            onTestPattern={async () => {
              try {
                await testPattern(rule);
                toast.success('Test pattern sent!');
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Failed to send test pattern';
                toast.error(msg);
              }
            }}
          />

          <div className="flex items-start justify-center pt-8">
            <BodyVisualization rule={rule} direction={stockDirection} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => {
              if (!user) {
                toast.error('Sign in to save presets');
                navigate('/auth');
                return;
              }
              setSaveOpen(true);
            }}
            className="bg-[#00D9FF] text-[#0A1929] hover:bg-[#00D9FF]/90"
          >
            <Save className="mr-2 h-4 w-4" /> Save as Preset
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/community')}
            className="border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/10"
          >
            <FolderOpen className="mr-2 h-4 w-4" /> Load Preset
          </Button>
          <Button
            disabled={activating}
            onClick={async () => {
              if (!rule.data_source?.trim()) {
                toast.error('Add a stock ticker first');
                return;
              }
              setActivating(true);
              try {
                await activatePreset(config);
                toast.success('Activated! Node-RED is feeding stock data to your wearable.');
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Failed to connect to Node-RED';
                toast.error(msg);
              } finally {
                setActivating(false);
              }
            }}
            className="bg-[#00D9FF] text-[#0A1929] hover:bg-[#00D9FF]/90"
          >
            {activating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Activate
          </Button>
        </div>

        <SavePresetModal
          open={saveOpen}
          onOpenChange={setSaveOpen}
          config={config}
        />
      </div>
    </div>
  );
}
