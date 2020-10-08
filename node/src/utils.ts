import { ethAddress } from "./contract";

interface commonEvent {
  returnValues?: {
    providerAddress: string;
  };
}
export function ignoreUnrelatedEvents<T extends commonEvent>(
  handler: (event: T) => void
) {
  return (_: any, event: T) => {
    if (event?.returnValues?.providerAddress !== ethAddress) {
      console.log("Ignored event:", event);
      return;
    }
    handler(event);
  };
}
