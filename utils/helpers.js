import * as state from '../utils/state.js';
import {} from '../enginestate.js';

export async function getCurrentLevelObj() {
    return await fetch(`assets/maps/level${state.CURRENT_LEVEL}.json`).then(res => res.json());
}