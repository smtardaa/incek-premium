/** Base yolu ile göreli yolu birleştirir: hem kök alan adında hem repository alt yolunda çalışır. */
export function withBase(path = '', base = import.meta.env.BASE_URL) {
  const b = base.endsWith('/') ? base : base + '/';
  return b + String(path).replace(/^\/+/, '');
}
