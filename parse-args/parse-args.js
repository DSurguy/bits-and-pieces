/**
 * Parse an array of args into an object
 * 
 * Args that start with -- are assumed to be keys, and consume all following args that are not keys as values.
 *   If the next arg is also a key, the current arg is assumed to be a boolean flag set to "true"
 * 
 * Args that contain = are assumed to be a key=value pair, even if they start with --.
 * 
 * If a key is encountered more than once, its value will be stored as an array of all found values (unless the arg is determined to be a boolean true at any point)
 * 
 * Numbers are not parsed into strings.
 * 
 * @param {string[]} args 
 * @returns {Object.<string, string|boolean|string[]>}
 */
export function parseArgs(args) {
  const argsOut = {};
  let skip = 0;
  args.forEach((arg, index) => {
    if( skip ) {
      skip--;
      return;
    }

    let name, value;

    if( arg.includes('=') ){
      const parts = arg.split('=');
      name = parts[0].replace(/^--/, '');
      value = parts[1];
    }
    else if( arg.startsWith('--') ) {
      name = arg.replace(/^--/, '');

      let ref = index+1;
      let values = [];
      while( argIsValue(args[ref]) ){
        skip++;
        values.push(args[ref])
        ref++;
      }

      if( values.length ) {
        value = values.length > 1 ? values : values[0];
      }
      else {
        value = true;
      }
    }
    else return;

    if( typeof value === 'boolean' ) argsOut[name] = value;
    else if( typeof argsOut[name] !== 'boolean' ) {
      if( argsOut[name] !== undefined ) {
        if( !Array.isArray(argsOut[name]) ) argsOut[name] = [argsOut[name]];
        if( Array.isArray(value) ) argsOut[name].push(...value);
        argsOut[name].push(value);
      }
      else argsOut[name] = value;
    }
  })
  return argsOut;
}

const argIsValue = arg => arg && !arg.startsWith('--') && !arg.includes('=')