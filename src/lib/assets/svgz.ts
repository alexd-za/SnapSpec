/**
 * SVGZ = gzip-compressed SVG.
 * In the browser we use CompressionStream; Node scripts use zlib instead
 * (see scripts/compress-svgz.ts).
 */
export async function gzipSvgInBrowser(svg: string): Promise<Blob> {
  if (typeof CompressionStream === 'undefined') {
    throw new Error('CompressionStream is not supported in this browser')
  }
  const stream = new Blob([svg], { type: 'image/svg+xml' })
    .stream()
    .pipeThrough(new CompressionStream('gzip'))
  const compressed = await new Response(stream).blob()
  return new Blob([compressed], { type: 'image/svg+xml' })
}
