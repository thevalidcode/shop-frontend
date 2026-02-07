"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ApiKeySectionProps {
  apiKey?: string | null;
  onRegenerate: (newKey: string) => void;
}

export function ApiKeySection({ apiKey, onRegenerate }: ApiKeySectionProps) {
  const [show, setShow] = useState(false);

  const maskedKey = apiKey && apiKey.length > 10 ? apiKey.slice(0, 8) + "********" : "********";

  const regenerateApiKey = () => {
    const newKey =
      "sk_live_" + Math.random().toString(36).substring(2, 20) + Date.now().toString(36);
    onRegenerate(newKey);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">API Key</label>
      <div className="flex gap-2">
        <Input readOnly value={show ? apiKey ?? "" : maskedKey} />
        <Button type="button" variant="secondary" onClick={() => setShow((v) => !v)}>
          {show ? (
            <EyeOff className="mr-1 h-4 w-4" />
          ) : (
            <Eye className="mr-1 h-4 w-4" />
          )}
          {show ? "Hide" : "Reveal"}
        </Button>
        <Button type="button" onClick={regenerateApiKey}>
          <RefreshCw className="mr-1 h-4 w-4" />
          Regenerate
        </Button>
      </div>
    </div>
  );
}
