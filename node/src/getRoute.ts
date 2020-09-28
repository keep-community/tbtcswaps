import {subscribeToProbeForRoute, getWalletInfo} from 'ln-service';
const pathfindingTimeoutMs = 1000 * 60 * 10;

async function getCurrentBlockHeight(lnd:LND){
  return (await getWalletInfo({lnd})).current_block_height
}

// Returns a value in seconds
export function calculateDelay(blocks: number){
  const extraDelayBlocks = 144; // Add one extra day
  const delayPerBlock = 60*12; // Assumes 12 minutes/block
  const delay = blocks*delayPerBlock + extraDelayBlocks;
  const secondsInDay = 24*60*60;
  if(delay > 5*secondsInDay){
    throw new Error("We don't serve swaps that take longer than 5 days")
  }
  return delay;
}

interface returnedRoute{
  timeoutDelta:number,
  fee:number
}
export default function getRoute(lnd: LND, invoice:Invoice){
    return new Promise<returnedRoute>((resolve, reject)=>{
        const sub = subscribeToProbeForRoute({
            lnd,
            cltv_delta: invoice.cltv_delta,
            destination: invoice.destination,
            payment: invoice.payment,
            routes: invoice.routes,
            tokens: invoice.tokens,
            total_mtokens: invoice.mtokens,
          });
          
          setTimeout(() => {
            sub.removeAllListeners();
            reject()
          },
          pathfindingTimeoutMs);
          
          sub.on('error', reject);
          sub.on('routing_failure', reject);
          
          sub.on('probe_success', async ({route}) => {
            const timeoutDelta = route.timeout - await getCurrentBlockHeight(lnd)
          
            resolve({
              fee: route.safe_fee,
              timeoutDelta
            });
          });
    })
}