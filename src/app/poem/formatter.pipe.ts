import { Pipe, PipeTransform } from '@angular/core';

export enum FormatFeature {
  italic    = 'italic',
  bold      = 'bold',
  underline = 'underline',
  emDash    = 'emDash',
  newLine   = 'newLine',
}

export interface FormatSegment {
  text: string;
  feature?: FormatFeature;
}

const FORMAT_PATTERN = /(_[^_]+_|\*\*[^*]+\*\*|__[^_]+__|--)/g;

const classify = (chunk: string): FormatSegment => {
  if (chunk === '--')                                                              return { text: '—',                             feature: FormatFeature.emDash };
  if (chunk.startsWith('_') && chunk.endsWith('_'))         return { text: chunk.slice(1, -1),   feature: FormatFeature.italic };
  if (chunk.startsWith('**') && chunk.endsWith('**'))       return { text: chunk.slice(2, -2),   feature: FormatFeature.bold };
  if (chunk.startsWith('__') && chunk.endsWith('__'))       return { text: chunk.slice(2, -2),   feature: FormatFeature.underline };
  return { text: chunk };
};

@Pipe({
  name: 'formatter'
})
export class FormatterPipe implements PipeTransform {
  transform(value: string): FormatSegment[] {
    if (value.trim() === '') {
      return [{ text: '', feature: FormatFeature.newLine }];
    }

    return value.split(FORMAT_PATTERN).filter((chunk) => chunk?.length > 0).map(classify);
  }
}
