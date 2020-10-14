/**
 * Checks if number is in exponential format (eg: 1e-8 for 0.00000001).
 * If it does not, original number is returned.
 * If it does it converts it to string representation of that number
 * which forces it to format 0.00000001
 */
export function convertExponentialToDecimal(exponentialNumber) {
  const data = String(exponentialNumber).split(/[eE]/);
  if (data.length === 1) {
    return data[0];
  }

  let z = '';
  const sign = exponentialNumber < 0 ? '-' : '';
  const str = data[0].replace('.', '');
  let mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + '0.';
    while (mag++) {
      z += '0';
    }
    return z + str.replace(/^\-/, '');
  }
  mag -= str.length;
  while (mag--) {
    z += '0';
  }
  return str + z;
}
