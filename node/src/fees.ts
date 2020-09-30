export function addFees(
  amount: bigint,
  constantFee: bigint,
  linearFee: bigint
) {
  const e8 = BigInt(10) ** BigInt(8);
  return (amount * (e8 + linearFee)) / e8 + constantFee;
}
