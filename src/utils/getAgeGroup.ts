export function getAgeGroup(age: number): string {
  if (age < 18) return 'Under 18';
  if (age <= 25) return '18-25';
  if (age <= 35) return '26-35';
  if (age <= 50) return '36-50';
  return '50+';
}
