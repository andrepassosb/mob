import hash from '@emotion/hash';
import { sortObjs } from './utils';


export function generateIdentifier(direction: string,options: object): string {
  const sortedOptions = sortObjs(options);

  let identifier = hash(`${direction}-${JSON.stringify(sortedOptions)}`);
  return identifier;
}