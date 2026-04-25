"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface ApiKeySectionProps {
  onRegenerate: () => Promise<string>;
  isRegenerating?: boolean;
}

export function ApiKeySection({ onRegenerate, isRegenerating }: ApiKeySectionProps) {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const regenerateApiKey = async () => {
    const newKey = await onRegenerate();
    setGeneratedKey(newKey);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">API Key</label>
      <div className="flex gap-2">
        <Input
          readOnly
          value={generatedKey || "********"}
          placeholder="Regenerate to view your new API key once"
        />
        <Button type="button" onClick={regenerateApiKey} disabled={isRegenerating}>
          <RefreshCw className="mr-1 h-4 w-4" />
          {isRegenerating ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        The API key is only shown once after regeneration. Save it securely.
      </p>
    </div>
  );
}
