/**
 * Menyamarkan operator perbandingan dalam string kondisi (misal: "suhu <= 30" -> "suhu [?] 30").
 */
export function samarkanOperator(kondisi: string): string {
  return kondisi.replace(/(!=|>=|<=|=|>|<)/, '[?]');
}
