interface LND {
  autopilot: any;
  chain: any;
  default: any;
  invoices: any;
  router: any;
  router_legacy: any;
  signer: any;
  tower_client: any;
  tower_server: any;
  wallet: any;
  version: any;
}

interface Route {
  base_fee_mtokens?: string;
  channel?: string;
  cltv_delta?: number;
  fee_rate?: number;
  public_key: string;
}

type ProbeForRouteSubscription = {
  on(
    event: "probe_success",
    cb: (res: {
      route: {
        fee: number;
        fee_mtokens: string;
        mtokens: string;
        safe_fee: number;
        safe_tokens: number;
        timeout: number;
        tokens: number;
      };
    }) => void
  ): void;
  on(event: "error" | "routing_failure", cb: any): void;
  removeAllListeners(): void;
};

interface Invoice {
  chain_addresses?: string;
  cltv_delta: number;
  created_at: string;
  description?: string;
  description_hash?: string;
  destination: string;
  expires_at: string;
  features: {
    bit: number;
    is_required: boolean;
    type: string;
  }[];
  id: string;
  is_expired: boolean;
  mtokens?: string;
  network: "bitcoin" | "regtest" | "testnet";
  payment?: string;
  routes?: Route[][];
  safe_tokens?: number;
  tokens?: number;
}

declare module "ln-service" {
  export function authenticatedLndGrpc(params: {
    cert: string;
    macaroon: string;
    socket: string;
  }): { lnd: LND };
  export function parsePaymentRequest(params: { request: string }): Invoice;
  export function subscribeToProbeForRoute(params: {
    lnd: LND;
    cltv_delta?: number;
    destination: string;
    features?: number;
    max_fee?: number;
    payment?: string;
    routes?: Route[][];
    tokens?: number;
    total_mtokens?: string;
  }): ProbeForRouteSubscription;
  export function createHodlInvoice(params: {
    lnd: LND;
    id?: string;
    cltv_delta?: number;
    description?: string;
    tokens?: number;
  }): Promise<{
    request: string;
  }>;
  export function settleHodlInvoice(params: {
    lnd: LND;
    secret: string;
  }): Promise<void>;
  export function subscribeToPayViaRoutes(params: {
    id: string;
    lnd: LND;
    routes: Route[];
    }): {on(
      event: "success",
      cb: (res: {
    failures: [number, string, any][];
    fee: number;
    fee_mtokens: string;
    hops: {
      channel: string;
      channel_capacity: number;
      fee_mtokens: string;
      forward_mtokens: string;
      timeout: number;
    }[];
    id: string;
    is_confirmed: boolean;
    is_outgoing: boolean;
    mtokens: string;
    safe_fee: number;
    safe_tokens: number;
    secret: string;
    tokens: number;
  }) => void
  ): void
  };
  export function getWalletInfo(params: {
    lnd: LND;
  }): Promise<{
    current_block_height: number;
  }>;
  export function subscribeToInvoice(params: {
    id: string;
    lnd: LND;
  }): {
    on(
      event: "invoice_updated",
      cb: (res: {
        id: string;
        secret: string;
        is_canceled?: boolean;
        is_confirmed: boolean;
        is_held?: boolean;
        is_outgoing: boolean;
      }) => void
    ): void;
  };
}
