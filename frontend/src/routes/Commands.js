import { nanoid } from "nanoid";

export const all_templates_grouped = [
  { name: "Geometry & Transform", commands: [
      { id: nanoid(), tool: "resize",            format: "$1x$2",            template: "Resize to $1n×$2n",               value: ["1000","1000"], name: "Resize" },
      { id: nanoid(), tool: "rotate",            format: "$1",               template: "Rotate by $1n°",                   value: ["90"],          name: "Rotate" },
      { id: nanoid(), tool: "crop",              format: "$1x$2+$3+$4",      template: "Crop to $1n×$2n at ($3n,$4n)",      value: ["300","300","0","0"], name: "Crop" },
      { id: nanoid(), tool: "flip",              format: "",                 template: "Flip vertically",                  value: [],             name: "Flip Vertical" },
      { id: nanoid(), tool: "flop",              format: "",                 template: "Flip horizontally",                value: [],             name: "Flip Horizontal" },
      { id: nanoid(), tool: "trim",              format: "",                 template: "Trim edges",                      value: [],             name: "Trim" },
      { id: nanoid(), tool: "border",            format: "$1",               template: "Add $1n px border",               value: ["5"],          name: "Border" }
    ]
  },
  { name: "Color & Tone", commands: [
      { id: nanoid(), tool: "grayscale",         format: "",                 template: "Convert to grayscale",             value: [],             name: "Grayscale" },
      { id: nanoid(), tool: "sepia-tone",        format: "$1%",              template: "Sepia tone $1n%",                value: ["80"],         name: "Sepia" },
      { id: nanoid(), tool: "negate",            format: "",                 template: "Invert colors",                   value: [],             name: "Invert" },
      { id: nanoid(), tool: "brightness-contrast", format: "$1x$2",          template: "Brightness +$1n%, Contrast +$2n%", value: ["0","0"],      name: "Brightness/Contrast" },
      { id: nanoid(), tool: "auto-level",        format: "",                 template: "Auto-level",                      value: [],             name: "Auto Level" },
      { id: nanoid(), tool: "auto-gamma",        format: "",                 template: "Auto-gamma",                      value: [],             name: "Auto Gamma" },
      { id: nanoid(), tool: "modulate",          format: "$1,$2,$3",         template: "Modulate: $1n% brightness, $2n% saturation, $3n° hue", value: ["100","100","100"], name: "Modulate" }
    ]
  },
  { name: "Sharpen & Noise", commands: [
      { id: nanoid(), tool: "blur",              format: "0x$1",             template: "Blur radius $1n",                 value: ["5"],          name: "Blur" },
      { id: nanoid(), tool: "adaptive-blur",     format: "$1x$2",            template: "Adaptive blur $1n×$2n",           value: ["0","2"],      name: "Adaptive Blur" },
      { id: nanoid(), tool: "sharpen",           format: "0x$1",             template: "Sharpen radius $1n",               value: ["2"],          name: "Sharpen" },
      { id: nanoid(), tool: "despeckle",         format: "",                 template: "Despeckle (reduce noise)",         value: [],             name: "Despeckle" },
      { id: nanoid(), tool: "wavelet-denoise",   format: "$1",               template: "Wavelet denoise threshold $1n",    value: ["10"],         name: "Wavelet Denoise" }
    ]
  },
  { name: "Edge Enhancements", commands: [
      { id: nanoid(), tool: "unsharp",           format: "$1x$2+$3+$4",      template: "Unsharp mask r=$1n σ=$2n gain=$3n thr=$4n", value: ["0","1","1","0"], name: "Unsharp Mask" },
      { id: nanoid(), tool: "sigmoidal-contrast", format: "$1x$2",           template: "Sigmoidal contrast $1n $2n",       value: ["3","2"],      name: "Sigmoidal Contrast" },
      { id: nanoid(), tool: "kuwahara",          format: "$1x$2",            template: "Kuwahara filter r=$1n σ=$2n",      value: ["3","0"],      name: "Kuwahara Filter" }
    ]
  },
  { name: "Artistic & Stylize", commands: [
      { id: nanoid(), tool: "charcoal",          format: "$1",               template: "Charcoal effect factor $1n",       value: ["2"],          name: "Charcoal" },
      { id: nanoid(), tool: "sketch",            format: "$1x$2+$3",         template: "Sketch r=$1n σ=$2n θ=$3n",         value: ["0","10","135"], name: "Sketch" },
      { id: nanoid(), tool: "spread",            format: "$1",               template: "Spread by $1n px",                 value: ["5"],          name: "Spread" },
      { id: nanoid(), tool: "swirl",             format: "$1",               template: "Swirl $1n°",                      value: ["180"],        name: "Swirl" }
    ]
  },
  { name: "Text", commands: [
      { id: nanoid(), tool: "caption",           format: "$1x$2",            template: 'Caption $1n×$2n: "$3t"',          value: ["400","200","Your Text"], name: "Caption" },
      { id: nanoid(), tool: "annotate",          format: "+$1+$2",           template: 'Annotate +$1n+$2n: "$3t"',        value: ["10","10","© 2025"], name: "Annotate" },
      { id: nanoid(), tool: "draw",              format: "text $1,$2 '$3'",     template: 'Draw at $1n,$2n: "$3t"',            value: ["25","65","Hello"], name: "Draw Text" },
      { id: nanoid(), tool: "gravity",           format: "$1",               template: 'Gravity: "$1t"',                  value: ["SouthEast"],   name: "Gravity" }
    ]
  },
  { name: "Other / Metadata", commands: [
      { id: nanoid(), tool: "quality",           format: "$1",               template: "JPEG quality $1n",                value: ["85"],         name: "JPEG Quality" },
      { id: nanoid(), tool: "strip",             format: "",                 template: "Strip metadata",                  value: [],             name: "Strip Metadata" },
      { id: nanoid(), tool: "depth",             format: "$1",               template: "Bit depth $1n",                   value: ["8"],          name: "Bit Depth" },
      { id: nanoid(), tool: "alpha",             format: "$1",               template: 'Alpha: "$1t"',                    value: ["on"],         name: "Alpha Channel" },
      { id: nanoid(), tool: "channel",           format: "$1",               template: 'Channel: "$1t"',                  value: ["RGB"],        name: "Channel" }
    ]
  }
];
