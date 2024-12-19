import type { Options } from './types';
import { generateIdentifier } from './identifier';
import { transformCss } from './transform';

class Mob {
    prefix: string;
    animationTimeline : Options[] = []
    className: string = '';

    constructor() {
        this.prefix = 'mob';
    }

  to(options: Options) {
    
    const identifier = generateIdentifier('to', options);
    const className = `${this.prefix}-${identifier}`;
    transformCss(['to'], className, [options]);

    return className;
  }
  
  from(options: Options) {
    
    const identifier = generateIdentifier('from', options);
    const className = `${this.prefix}-${identifier}`;
    transformCss(['from'], className, [options]);

    return className;
  }

  fromTo(fromOptions: Options, toOptions: Options) {
    
    const fromIdentifier = generateIdentifier('fromTo', {...fromOptions, ...toOptions});
    const className = `${this.prefix}-${fromIdentifier}`;
    transformCss(['from','to'], className, [fromOptions, toOptions]);

    return className;
  }

  timeline() {
    const identifier = generateIdentifier('timeline',{});
    this.className = `${this.prefix}-${identifier}`;
    return this
  }

  add(options: Options) {
    this.animationTimeline.push(options);
    return this;
  }

  generate() {
    // Calcula o tempo total da timeline
    const totalTime = this.animationTimeline.reduce((acc, curr) => {
      return acc + (Number(curr.duration) || 0);
    }, 0);
  
    let accumulatedTime = 0;
  
    // Gera porcentagens cumulativas baseadas no tempo total
    const percentageTimeline = this.animationTimeline.map((options, index) => {
      accumulatedTime += Number(options.duration) || 0;
      // Para o último item, força 100% para evitar erros de arredondamento
      const percentage = (index === this.animationTimeline.length - 1)
        ? 100
        : Math.round((accumulatedTime / totalTime) * 100);
  
      return `${percentage}%`;
    });
  
    // Chama a função transformCss com as porcentagens calculadas
    transformCss(percentageTimeline, this.className, this.animationTimeline);
  
    // Limpa a timeline após a geração
    this.animationTimeline = [];
  
    return this.className;
  }
  
  
}

const mob = new Mob();

export default mob;

