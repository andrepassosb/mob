import type { Options } from './types';
import type { Plugin } from 'jss';
import { appendCss } from './adapter';

import {create} from 'jss'
import camelCase from 'jss-plugin-camel-case';


type DefaultType = {
  default: () => Plugin;
};

const camelCasePlugin = (camelCase as unknown as DefaultType).default;
const jss = create();
jss.use(camelCasePlugin());

export function transformCss(identifier: string[], className: string, options: Options[])  {
    const keyframes = generateKeyframes(identifier, className, options);
    const cssClass = generateClass(options, className);

    appendCss([keyframes.toString(), cssClass.toString()], 'style.css');
}

function generateKeyframes(identifier: string[], className: string, options: Options[]) {
    const createGenerateId = () => () => `keyframe-${className}`
    jss.setup({createGenerateId})


    const keyframes = identifier.reduce((acc: Record<string, Record<string, string>>, key: string, index: number) => {
        acc[key] = setStyle(options[index]);
        return acc;
    }
    , {})
    const cssKeyFrame = jss.createStyleSheet({ [`@keyframes ${className}`]: keyframes });
    return cssKeyFrame
}

function generateClass(options: Options[], className: string) {
    const createGenerateId = () => () => className
    jss.setup({createGenerateId})
    let duration = 0;
    options.forEach(option => {
        if (option.duration) {
            if (typeof option.duration === 'number') {
                duration = option.duration;
            }
        }
    });
    const rule = {
        'animation-name': `keyframe-${className}`,
        'animation-duration': `${duration}s`,
        'animation-fill-mode': 'forwards'
    };
    const cssClass = jss.createStyleSheet({  rule });
    return cssClass
}


function setStyle(options: Options): Record<string, string> {
  // Armazena os estilos resultantes
  const keyframes: Record<string, string> = {};

  // Adiciona transformações no keyframe
  const transform = (key: string, value: string | number) => {
    keyframes.transform = `${keyframes.transform || ""}${key}(${value}) `;
  };

  // Itera pelas opções fornecidas
  for (const key in options) {
    const value = options[key];

    // Valida transformações específicas
    if (validTransforms.includes(key)) {
      switch (key) {
        case "x":
          transform("translateX", is.number(value) ? `${value}px` : value);
          break;
        case "y":
          transform("translateY",  is.number(value) ? `${value}px` : value);
          break;
        case "z":
          transform("translateZ",  is.number(value) ? `${value}px` : value);
          break;
        case "rotate":
            transform("rotate",  is.number(value) ? `${value}deg` : value);
            break;
        default:
          transform(key, value);
          break;
      }
    } 
    // Verifica outras propriedades válidas
    else if (!validAnimationProps.includes(key)) {
      keyframes[key] = value.toString();
    }
  }

  return keyframes;
}


const is = {
    number: (value: any) => typeof value === 'number',
    string: (value: any) => typeof value === 'string',
}

// Propriedades válidas de animação
const validAnimationProps = [
  "animation",
  "animationName",
  "animationDuration",
  "animationTimingFunction",
  "animationDelay",
  "animationIterationCount",
  "animationDirection",
  "animationFillMode",
  "animationPlayState",
  "duration",
];

// Transformações válidas
const validTransforms = [
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "skew",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "matrix3d",
];




