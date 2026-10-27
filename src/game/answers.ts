// Ramène une réponse à sa forme la plus simple : sans accents, majuscules,
// ponctuation ni espaces. « 88 MPH ! » et « 88mph » deviennent « 88mph ».
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function isAccepted(input: string, answers: string[]): boolean {
  const value = normalize(input)
  return value !== '' && answers.some((answer) => normalize(answer) === value)
}
