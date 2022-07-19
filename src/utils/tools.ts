// RGB转HEX
const RGBToHex = (r:number, g:number, b:number):string => {
  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')
}
// HEX转RGB
const HEXtoRGB = (hex:string) => {
  let alpha = false
  let h:string|number
  h = hex.slice(hex.startsWith('#') ? 1 : 0)
  if (h.length === 3) h = [...h].map(x => x + x).join('')
  else if (h.length === 8) alpha = true
  h = parseInt(h, 16)
  if (alpha) {
    return ({
      r: (h >>> (alpha ? 24 : 16)),
      g: ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)),
      b: ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)),
      a: h & 0x000000ff
    })
  } else {
    return ({
      r: (h >>> (alpha ? 24 : 16)),
      g: ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)),
      b: ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0))
    })
  }
}

export { RGBToHex, HEXtoRGB }
