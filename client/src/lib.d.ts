interface Window {
  ethereum:
    | {
        enable(): Promise<string[]>;
        selectedAddress: string | null;
        request: (params: { method: string }) => Promise<string[]>;
      }
    | undefined;
}
