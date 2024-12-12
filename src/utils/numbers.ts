export const getOnlyNumber = (
  value?: string | null,
  maxLength?: number
): string => {
  let transformedValue;
  if (value?.endsWith(".") || value?.endsWith(",")) {
    transformedValue = `${value}0`;
  }
  const returnValue = transformedValue?.replace(/[^0-9,.-]/g, "") ?? "";
  if (maxLength) {
    return returnValue.slice(0, maxLength);
  }
  return returnValue;
};

export const formatNumberValue = (
  val: number | string | null | undefined,
  useMoney = true
): string => {
  if (val) {
    const dollarUSLocale: Intl.NumberFormat = Intl.NumberFormat("en-US");

    const valueNumber = getOnlyNumber(`${val}`);
    if (valueNumber) {
      console.log("valueNumber", valueNumber);
      return `${useMoney ? "$" : ""}${dollarUSLocale.format(
        Number(valueNumber)
      )}`;
    } else {
      return "";
    }
  } else {
    return "";
  }
};
