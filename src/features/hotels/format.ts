/** The review score is out of 5 in our data; guests see it out of 10, like on IMPT. */
export const outOfTen = (score: number) => (score * 2).toFixed(1);

export const scoreWord = (score10: number) =>
  score10 >= 9 ? "Exceptional" : score10 >= 8.5 ? "Excellent" : score10 >= 8 ? "Very good" : score10 >= 7 ? "Good" : "Pleasant";
