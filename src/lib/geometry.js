/**
 * Dış cephe geometrisi: ölçülen döşeme çizgilerinden kat çokgenleri üretir.
 * Saf fonksiyonlar — derlemede (SVG) ve testlerde kullanılır.
 */

/** Sağ cephe çizgi eğimi: ufuk çizgisinde (~698) sıfıra inen doğrusal model (ölçümle uyumlu). */
export function rightSlope(y) {
  return 0.56 * (698 - y) / 661.5;
}

/** Sol cephe çizgi eğimi (köşeden sola doğru iner). Ölçüm: y≈140'ta −0.61, y≈590'da −0.25. */
export function leftSlope(yCorner) {
  return -0.61 + 0.0008 * (yCorner - 140);
}

/**
 * x=measureX'te ölçülen bir döşeme çizgisinin üç noktası: sol kenar, köşe, sağ kenar.
 * @returns {[number, number][]}
 */
export function linePoints(yMeasured, facade) {
  const s = rightSlope(yMeasured);
  const yc = yMeasured - (facade.measureX - facade.corner) * s;
  const yr = yMeasured + (facade.right - facade.measureX) * s;
  const yl = yc + (facade.left - facade.corner) * leftSlope(yc);
  const r = (v) => Math.round(v * 10) / 10;
  return [[facade.left, r(yl)], [facade.corner, r(yc)], [facade.right, r(yr)]];
}

/**
 * Kat bantlarını üretir (yukarıdan aşağı). number: temsili kat numarası.
 * @param {number[]} lines
 * @param {{corner:number,right:number,left:number,measureX:number}} facade
 * @param {number} topNumber
 */
export function buildFloors(lines, facade, topNumber) {
  const floors = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const top = linePoints(lines[i], facade);
    const bot = linePoints(lines[i + 1], facade);
    const points = [top[0], top[1], top[2], bot[2], bot[1], bot[0]];
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const bbox = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    // Yakınlaşma hedefi: sağ cephedeki bant ortası (pencere sırası)
    const target = { x: (facade.corner + facade.right) / 2, y: (top[1][1] + top[2][1] + bot[1][1] + bot[2][1]) / 4 };
    floors.push({ number: topNumber - i, points, bbox, target });
  }
  return floors;
}

export function pointsAttr(points) {
  return points.map((p) => p.join(',')).join(' ');
}
