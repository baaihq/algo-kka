/**
 * Menghasilkan indeks varian yang deterministik dan konsisten untuk tim tertentu:
 * index = hash(nama tim + id level) mod jumlah varian
 */
export function hitungHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

export function pilihVarianUntukTim(namaTim: string, levelId: string, jumlahVarian: number): number {
  if (jumlahVarian <= 0) return 0;
  const kunci = `${namaTim.trim().toLowerCase()}|${levelId}`;
  return hitungHash(kunci) % jumlahVarian;
}
