// round(1.005 );    //1.01
export function round(number: number, pow1 = 2, pow2 = 2) {
  return Math.round(number * Math.pow(10, pow1)) / Math.pow(10, pow2);
}
