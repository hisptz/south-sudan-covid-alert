export function calculateAge(birthday) {
  if (isDate(birthday)) {
    const ageDifference = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  return '';
}
function isDate(dateStr) {
  return !isNaN(new Date(dateStr).getDate());
}
