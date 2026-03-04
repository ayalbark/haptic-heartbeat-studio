import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RuleSection } from '@/components/RuleSection';
import { BodyVisualization } from '@/components/BodyVisualization';
import { SavePresetModal } from '@/components/SavePresetModal';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { RuleConfig, PresetConfig, EMPTY_RULE } from '@/types/preset';
import { EMPTY_RULE as emptyRule } from '@/types/preset';

export default function Index() {
  const [frontRule, setFrontRule] = useState<RuleConfig>({ ...emptyRule });
  const [backRule, setBackRule] = useState<RuleConfig>({ ...emptyRule });
  const [activeSection, setActiveSection] = useState<'front' | 'back' | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
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
            if (cfg.rule_front) setFrontRule(cfg.rule_front);
            if (cfg.rule_back) setBackRule(cfg.rule_back);
            toast.success('Preset loaded!');
          }
        });
    }
  }, [searchParams]);

  const config: PresetConfig = {
    rule_front: frontRule,
    rule_back: backRule,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Haptic Sensation Designer
        </h1>
        <p className="mt-2 text-muted-foreground">
          Design custom vibration patterns for your 6-motor wearable device
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr]">
        {/* Front Rule */}
        <RuleSection
          title="Front Motors (Rule 1)"
          rule={frontRule}
          onChange={setFrontRule}
          onFocus={() => setActiveSection('front')}
        />

        {/* Body Visualization */}
        <div className="flex items-start justify-center pt-8">
          <BodyVisualization
            frontRule={frontRule}
            backRule={backRule}
            activeSection={activeSection}
          />
        </div>

        {/* Back Rule */}
        <RuleSection
          title="Back Motors (Rule 2)"
          rule={backRule}
          onChange={setBackRule}
          onFocus={() => setActiveSection('back')}
        />
      </div>

      {/* Bottom Actions */}
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
        >
          <Save className="mr-2 h-4 w-4" /> Save as Preset
        </Button>
        <Button variant="outline" onClick={() => navigate('/community')}>
          <FolderOpen className="mr-2 h-4 w-4" /> Load Preset
        </Button>
        <Button variant="secondary" onClick={() => toast.info('Activation coming soon!')}>
          <Zap className="mr-2 h-4 w-4" /> Activate Both Rules
        </Button>
      </div>

      <SavePresetModal
        open={saveOpen}
        onOpenChange={setSaveOpen}
        config={config}
      />
    </div>
  );
}
