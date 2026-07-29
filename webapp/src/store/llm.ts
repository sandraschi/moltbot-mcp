import { create } from "zustand";

export interface ProviderInfo {
  name: string;
  port: number;
  base: string;
}

interface LLMState {
  detectedProviders: ProviderInfo[];
  providerStatus: Record<string, "probing" | "detected" | "not_found">;
  selectedProvider: string;
  selectedModel: string;
  availableModels: string[];
  gpuDetected: boolean;
  setProviders: (providers: ProviderInfo[], status: Record<string, "probing" | "detected" | "not_found">) => void;
  setSelectedProvider: (p: string) => void;
  setSelectedModel: (m: string) => void;
  setAvailableModels: (models: string[]) => void;
  setGpuDetected: (d: boolean) => void;
}

export const useLLMStore = create<LLMState>((set) => ({
  detectedProviders: [],
  providerStatus: {},
  selectedProvider: "",
  selectedModel: "",
  availableModels: [],
  gpuDetected: false,
  setProviders: (providers, status) => set({ detectedProviders: providers, providerStatus: status }),
  setSelectedProvider: (p) => set({ selectedProvider: p }),
  setSelectedModel: (m) => set({ selectedModel: m }),
  setAvailableModels: (m) => set({ availableModels: m }),
  setGpuDetected: (d) => set({ gpuDetected: d }),
}));
