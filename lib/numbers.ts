export const friendlyNumber = (num: number) => {
  // if its 1470 return 1,5K...

  //   but not return any .0 please

  const suffixes = ["", "K", "M", "B", "T"];
  const suffixIndex = Math.floor(Math.log10(num) / 3);
  const scaledNum = num / Math.pow(10, suffixIndex * 3);
  const formattedNum = scaledNum.toFixed(1);
  return formattedNum.replace(/\.0$/, "") + suffixes[suffixIndex];
};
