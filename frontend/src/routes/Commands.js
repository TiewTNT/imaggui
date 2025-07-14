import { nanoid } from "nanoid";

export const all_templates_grouped = [
  {
    name: "Geometry & Transform", commands: [
      { id: nanoid(), format: "-resize $1x$2", template: "Resize to $1n×$2n", value: ["1000", "1000"], name: "Resize", type: "in" },
      { id: nanoid(), format: "-rotate $1", template: "Rotate by $1n°", value: ["90"], name: "Rotate", type: "in" },
      { id: nanoid(), format: "-crop $1x$2+$3+$4", template: "Crop to $1n×$2n at ($3n,$4n)", value: ["300", "300", "0", "0"], name: "Crop", type: "in" },
      { id: nanoid(), format: "-flip", template: "Flip vertically", value: [], name: "Flip Vertical", type: "in" },
      { id: nanoid(), format: "-flop", template: "Flip horizontally", value: [], name: "Flip Horizontal", type: "in" },
      { id: nanoid(), format: "-trim", template: "Trim edges", value: [], name: "Trim", type: "in" },
      { id: nanoid(), format: "-border $1", template: "Add $1n px border", value: ["5"], name: "Border", type: "in" }
    ]
  },
  {
    name: "Color & Tone", commands: [
      { id: nanoid(), format: "-colorspace Gray", template: "Convert to grayscale", value: [], name: "Grayscale", type: "in" },
      { id: nanoid(), format: "-sepia-tone $1%", template: "Sepia tone $1n%", value: ["80"], name: "Sepia", type: "in" },
      { id: nanoid(), format: "-negate", template: "Invert colors", value: [], name: "Invert", type: "in" },
      { id: nanoid(), format: "-brightness-contrast $1x$2", template: "Brightness +$1n%, Contrast +$2n%", value: ["0", "0"], name: "Brightness/Contrast", type: "in" },
      { id: nanoid(), format: "-auto-level", template: "Auto-level", value: [], name: "Auto Level", type: "in" },
      { id: nanoid(), format: "-auto-gamma", template: "Auto-gamma", value: [], name: "Auto Gamma", type: "in" },
      { id: nanoid(), format: "-modulate $1,$2,$3", template: "Modulate: $1n% brightness, $2n% saturation, $3n° hue", value: ["100", "100", "100"], name: "Modulate", type: "in" }
    ]
  },
  {
    name: "Sharpen & Noise", commands: [
      { id: nanoid(), format: "-blur 0x$1", template: "Blur radius $1n", value: ["5"], name: "Blur", type: "in" },
      { id: nanoid(), format: "-adaptive-blur $1x$2", template: "Adaptive blur $1n×$2n", value: ["0", "2"], name: "Adaptive Blur", type: "in" },
      { id: nanoid(), format: "-sharpen 0x$1", template: "Sharpen radius $1n", value: ["2"], name: "Sharpen", type: "in" },
      { id: nanoid(), format: "-despeckle", template: "Despeckle (reduce noise)", value: [], name: "Despeckle", type: "in" },
      { id: nanoid(), format: "-wavelet-denoise $1", template: "Wavelet denoise threshold $1n", value: ["10"], name: "Wavelet Denoise", type: "in" }
    ]
  },
  {
    name: "Edge Enhancements", commands: [
      { id: nanoid(), format: "-unsharp $1x$2+$3+$4", template: "Unsharp mask r=$1n σ=$2n gain=$3n thr=$4n", value: ["0", "1", "1", "0"], name: "Unsharp Mask", type: "in" },
      { id: nanoid(), format: "-sigmoidal-contrast $1x$2", template: "Sigmoidal contrast $1n $2n", value: ["3", "2"], name: "Sigmoidal Contrast", type: "in" },
      { id: nanoid(), format: "-kuwahara $1x$2", template: "Kuwahara filter r=$1n σ=$2n", value: ["3", "0"], name: "Kuwahara Filter", type: "in" }
    ]
  },
  {
    name: "Artistic & Stylize", commands: [
      { id: nanoid(), format: "-charcoal $1", template: "Charcoal effect factor $1n", value: ["2"], name: "Charcoal", type: "in" },
      { id: nanoid(), format: "-sketch $1x$2+$3", template: "Sketch r=$1n σ=$2n θ=$3n", value: ["0", "10", "135"], name: "Sketch", type: "in" },
      { id: nanoid(), format: "-spread $1", template: "Spread by $1n px", value: ["5"], name: "Spread", type: "in" },
      { id: nanoid(), format: "-swirl $1", template: "Swirl $1n°", value: ["180"], name: "Swirl", type: "in" }
    ]
  },
  {
    name: "Text", commands: [
      { id: nanoid(), format: "-font $4 -annotate +$1+$2 '$3'", template: "Annotate +$1n+$2n: \"$3t\" with font $4s{Sans Serif:DejaVu-Sans;Serif:DejaVu-Serif;Monospace:DejaVu-Sans-Mono;}", value: ["10", "10", "© 2025", "DejaVu-Sans-Mono"], name: "Annotate", type: "in" },
      { id: nanoid(), format: "-font $4 -draw \"text $1,$2 '$3'\"", template: "Draw at $1n,$2n: \"$3t\" with font $4s{Sans Serif:DejaVu-Sans;Serif:DejaVu-Serif;Monospace:DejaVu-Sans-Mono;}", value: ["25", "65", "Hello", "DejaVu-Sans-Mono"], name: "Draw Text", type: "in" },
      { id: nanoid(), format: "-pointsize $1", template: "Point size: $1n", value: ["18"], name: "Point Size", type: "pi" },
      { id: nanoid(), format: "-gravity $1", template: 'Gravity: "$1s{Top Left:NorthWest;Top:North;Top Right:NorthEast;Left:West;Center:Center;Right:East;Bottom Left:SouthWest;Bottom:South;Bottom Right:SouthEast;}"', value: ["SouthWest"], name: "Gravity", type: "pi" }
    ]
  },
  {
    name: "Shapes", commands: [
      { id: nanoid(), format: "-fill $1", template: "Shape fill: \"$1t\"", value: ["black"], name: "Fill", type: "in" },
      { id: nanoid(), format: "-stroke $1", template: "Stroke color: \"$1t\"", value: ["none"], name: "Stroke", type: "in" },
      { id: nanoid(), format: "-strokewidth $1", template: "Stroke width: $1n", value: ["1"], name: "Stroke Width", type: "in" },
      { id: nanoid(), format: "-draw \"rectangle $1,$2 $3,$4\"", template: "Draw rectangle: ($1n,$2n) to ($3n,$4n)", value: ["10", "10", "100", "100"], name: "Draw Rectangle", type: "in" },
      { id: nanoid(), format: "-draw \"circle $1,$2 $3,$4\"", template: "Draw circle center ($1n,$2n), edge ($3n,$4n)", value: ["50", "50", "50", "10"], name: "Draw Circle", type: "in" },
      { id: nanoid(), format: "-draw \"ellipse $1,$2 $3,$4 0,360\"", template: "Draw ellipse center ($1n,$2n), radius ($3n,$4n)", value: ["100", "100", "60", "30"], name: "Draw Ellipse", type: "in" },
      { id: nanoid(), format: "-draw \"line $1,$2 $3,$4\"", template: "Draw line from ($1n,$2n) to ($3n,$4n)", value: ["0", "0", "100", "100"], name: "Draw Line", type: "in" },
      { id: nanoid(), format: "-draw \"polygon $1\"", template: "Draw polygon points: $1t", value: ["10,10 50,10 30,40"], name: "Draw Polygon", type: "in" },
      { id: nanoid(), format: "-draw \"roundrectangle $1,$2 $3,$4 $5,$6\"", template: "Draw rounded rectangle: ($1n,$2n)-($3n,$4n) r=($5n,$6n)", value: ["10", "10", "100", "60", "10", "10"], name: "Draw Round Rectangle", type: "in" },
      { id: nanoid(), format: "-draw 'point $1,$2'", template: "Draw point at ($1n,$2n)", value: ["50", "50"], name: "Draw Point", type: "in" }
    ]
  },
  {
    name: "Conversion", commands: [
      { id: nanoid(), format: "-density $1", template: "Set vector → raster density to $1n", value: ["300"], name: "Density", type: "pi" },
      { id: nanoid(), format: "-units $1", template: "Set units to \"$1s{Pixels per Inch:PixelsPerInch;Pixels per Centimeter:PixelsPerCentimeter;Undefined:Undefined;}\"", value: ["PixelsPerInch"], name: "Units", type: "pi" },
      { id: nanoid(), format: "-colorspace $1", template: "Convert to \"$1s{sRGB:sRGB;Grayscale:Gray;CMYK:CMYK;Rec.709:Rec709;XYZ:XYZ;CIE Lab:Lab;}\" colorspace", value: ["sRGB"], name: "Colorspace", type: "in" },
      { id: nanoid(), format: "-background '$1'", template: "Background color: \"$1t\"", value: ["white"], name: "Background Color", type: "pi" },
      { id: nanoid(), format: "-flatten", template: "Flatten all layers", value: [], name: "Flatten", type: "po" },
      { id: nanoid(), format: "-alpha remove", template: "Remove alpha channel", value: [], name: "Remove Alpha", type: "in" },
      { id: nanoid(), format: "-alpha background", template: "Replace transparency with background color", value: [], name: "Flatten Alpha to Background", type: "in" },
      { id: nanoid(), format: "-type $1", template: "Image type: \"$1s{Grayscale:Grayscale;True Color:TrueColor;Palette-Based:Palette;Black & White:Bilevel;}\"", value: ["Grayscale"], name: "Image Type", type: "po" },
      { id: nanoid(), format: "-define $1=$2", template: "Define option: $1t = $2t", value: ["png:compression-level", "9"], name: "Define Compression", type: "gb" }
    ]
  },
  {
    name: "Other / Metadata", commands: [
      { id: nanoid(), format: "-quality $1", template: "JPEG quality $1n", value: ["85"], name: "JPEG Quality", type: "po" },
      { id: nanoid(), format: "-strip", template: "Strip metadata", value: [], name: "Strip Metadata", type: "in" },
      { id: nanoid(), format: "-depth $1", template: "Bit depth $1n", value: ["8"], name: "Bit Depth", type: "pi" },
      { id: nanoid(), format: "-alpha $1", template: "Alpha: \"$1t\"", value: ["on"], name: "Alpha Channel", type: "in" },
      { id: nanoid(), format: "-channel $1", template: "$1s{All Channels:All;Red:Red;Green:Green;Blue:Blue;Alpha:Alpha;RGB:RGB;RGBA:RGBA;}", value: ["All"], name: "Channel", type: "in" }
    ]
  }
];
