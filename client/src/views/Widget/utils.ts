export const toMaxDecimalsFloor = (n: number | string, step: number) => {
  const amount = typeof n === "string" ? Number(n.replace(",", ".")) : n;
  //let factor = Number('1e' + decimals)
  let nRound = Math.floor(amount * step) / step;
  return !isFinite(nRound) ? 0 : nRound;
};

export const toMaxDecimalsRound = (n: number | string, step: number) => {
  const amount = typeof n === "string" ? Number(n.replace(",", ".")) : n;
  if (step <= 0) return amount;
  //let factor = Number('1e' + decimals)
  let factor = 1 / step;
  let nRound = Math.round(amount * factor) / factor;
  return !isFinite(nRound) ? 0 : nRound;
};

export function convertToUint(amount:string, tokenDecimals:number){
  let [int, decimals] = amount.split('.');
  decimals = decimals ?? '';
  int = int.replace(/^0+/, '');
  decimals = decimals.padEnd(tokenDecimals, '0')
  if(decimals.length > tokenDecimals){
    throw new Error("Too many decimals were provided")
  }
  return int + decimals;
}

export function addDecimalsToUint(amount:string, tokenDecimals:number){
  const padded = amount.padStart(tokenDecimals + 1, '0');
  const decimals = padded.substr(-tokenDecimals).replace(/0+$/, '')
  let int = padded.substr(0, padded.length - tokenDecimals).replace(/^0+/, '')
  if(int === ''){
    int='0'
  }
  if(decimals===''){
      return int
  } else {
      return `${int}.${decimals}`
  }  
}