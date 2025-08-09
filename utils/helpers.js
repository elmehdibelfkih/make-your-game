import {} from '../enginestate.js';

export function throttle(cbf, wait) {
    let block = false
    return function (...args) {
        if (block) return
        block = true;
        cbf(...args)
        setTimeout(() => {
            block = false;
        }, wait)
    }
}