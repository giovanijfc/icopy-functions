export const getMercadoLivreSignatureWebHook = (xSignature: string) => {
  const [tsKeyValueString, secretValueString] = xSignature.split(",");
  const [, timestamp] = tsKeyValueString.split("=");
  const [, secretHeader] = secretValueString.split("=");

  return { timestamp, secretHeader };
};
