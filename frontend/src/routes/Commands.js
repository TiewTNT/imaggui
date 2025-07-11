import { nanoid } from "nanoid";

export const all_templates_grouped = [
  { name: "Geometry & Transform", commands: [
      { id: nanoid(), format: "-resize $1x$2", template: "Resize to $1n×$2n", value: ["1000","1000"], name: "Resize" },
      { id: nanoid(), format: "-rotate $1", template: "Rotate by $1n°", value: ["90"], name: "Rotate" },
      { id: nanoid(), format: "-crop $1x$2+$3+$4", template: "Crop to $1n×$2n at ($3n,$4n)", value: ["300","300","0","0"], name: "Crop" },
      { id: nanoid(), format: "-flip", template: "Flip vertically", value: [], name: "Flip Vertical" },
      { id: nanoid(), format: "-flop", template: "Flip horizontally", value: [], name: "Flip Horizontal" },
      { id: nanoid(), format: "-trim", template: "Trim edges", value: [], name: "Trim" },
      { id: nanoid(), format: "-border $1", template: "Add $1n px border", value: ["5"], name: "Border" }
    ]
  },
  { name: "Color & Tone", commands: [
      { id: nanoid(), format: "-grayscale", template: "Convert to grayscale", value: [], name: "Grayscale" },
      { id: nanoid(), format: "-sepia-tone $1%", template: "Sepia tone $1n%", value: ["80"], name: "Sepia" },
      { id: nanoid(), format: "-negate", template: "Invert colors", value: [], name: "Invert" },
      { id: nanoid(), format: "-brightness-contrast $1x$2", template: "Brightness +$1n%, Contrast +$2n%", value: ["0","0"], name: "Brightness/Contrast" },
      { id: nanoid(), format: "-auto-level", template: "Auto-level", value: [], name: "Auto Level" },
      { id: nanoid(), format: "-auto-gamma", template: "Auto-gamma", value: [], name: "Auto Gamma" },
      { id: nanoid(), format: "-modulate $1,$2,$3", template: "Modulate: $1n% brightness, $2n% saturation, $3n° hue", value: ["100","100","100"], name: "Modulate" }
    ]
  },
  { name: "Sharpen & Noise", commands: [
      { id: nanoid(), format: "-blur 0x$1", template: "Blur radius $1n", value: ["5"], name: "Blur" },
      { id: nanoid(), format: "-adaptive-blur $1x$2", template: "Adaptive blur $1n×$2n", value: ["0","2"], name: "Adaptive Blur" },
      { id: nanoid(), format: "-sharpen 0x$1", template: "Sharpen radius $1n", value: ["2"], name: "Sharpen" },
      { id: nanoid(), format: "-despeckle", template: "Despeckle (reduce noise)", value: [], name: "Despeckle" },
      { id: nanoid(), format: "-wavelet-denoise $1", template: "Wavelet denoise threshold $1n", value: ["10"], name: "Wavelet Denoise" }
    ]
  },
  { name: "Edge Enhancements", commands: [
      { id: nanoid(), format: "-unsharp $1x$2+$3+$4", template: "Unsharp mask r=$1n σ=$2n gain=$3n thr=$4n", value: ["0","1","1","0"], name: "Unsharp Mask" },
      { id: nanoid(), format: "-sigmoidal-contrast $1x$2", template: "Sigmoidal contrast $1n $2n", value: ["3","2"], name: "Sigmoidal Contrast" },
      { id: nanoid(), format: "-kuwahara $1x$2", template: "Kuwahara filter r=$1n σ=$2n", value: ["3","0"], name: "Kuwahara Filter" }
    ]
  },
  { name: "Artistic & Stylize", commands: [
      { id: nanoid(), format: "-charcoal $1", template: "Charcoal effect factor $1n", value: ["2"], name: "Charcoal" },
      { id: nanoid(), format: "-sketch $1x$2+$3", template: "Sketch r=$1n σ=$2n θ=$3n", value: ["0","10","135"], name: "Sketch" },
      { id: nanoid(), format: "-spread $1", template: "Spread by $1n px", value: ["5"], name: "Spread" },
      { id: nanoid(), format: "-swirl $1", template: "Swirl $1n°", value: ["180"], name: "Swirl" }
    ]
  },
  { name: "Text", commands: [
      { id: nanoid(), format: "-font $4 -annotate +$1+$2 '$3'", template: "Annotate +$1n+$2n: \"$3t\" with font $4t", value: ["10","10","© 2025", "DejaVu-Sans-Mono"], name: "Annotate" },
      { id: nanoid(), format: `-font $4 -draw "text $1,$2 '$3'"`, template: "Draw at $1n,$2n: \"$3t\" with font $4t", value: ["25","65","Hello", "DejaVu-Sans-Mono"], name: "Draw Text" },
      { id: nanoid(), format: "-gravity $1", template: "Gravity: \"$1t\"", value: ["SouthEast"], name: "Gravity" }
    ]
  },
  { name: "Other / Metadata", commands: [
      { id: nanoid(), format: "-quality $1", template: "JPEG quality $1n", value: ["85"], name: "JPEG Quality" },
      { id: nanoid(), format: "-strip", template: "Strip metadata", value: [], name: "Strip Metadata" },
      { id: nanoid(), format: "-depth $1", template: "Bit depth $1n", value: ["8"], name: "Bit Depth" },
      { id: nanoid(), format: "-alpha $1", template: "Alpha: \"$1t\"", value: ["on"], name: "Alpha Channel" },
      { id: nanoid(), format: "-channel $1", template: "Channel: \"$1t\"", value: ["RGB"], name: "Channel" }
    ]
  }
];
