function toVal(mix) {
  let k, y, str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      const len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          if ((y = toVal(mix[k]))) {
            if (str) str += ' ';
            str += y;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix && mix[k]) {
          if (str) str += ' ';
          str += k;
        }
      }
    }
  }

  return str;
}

export function clsx(...args) {
  let i = 0, tmp, str = '', len = args.length;
  for (; i < len; i++) {
    if ((tmp = args[i])) {
      if ((tmp = toVal(tmp))) {
        if (str) str += ' ';
        str += tmp;
      }
    }
  }
  return str;
}

export function twMerge(...args) {
  return clsx(...args);
}

export function cn(...inputs) {
  return clsx(...inputs);
}

export default cn;
