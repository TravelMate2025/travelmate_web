/** "ADAEZE OKAFOR-EZE" -> "Adaeze Okafor-Eze" (names are stored in capitals for the airline). */
export const titleCase = (name: string) => name.toLowerCase().replace(/(^|[\s'-])([a-z])/g, (_, sep: string, c: string) => sep + c.toUpperCase());
