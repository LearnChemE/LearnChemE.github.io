import { expect, test } from 'vitest';
import { antoines } from './calcs';

test('antoines returns normal boiling pt', async () => {
    expect(antoines(373.15)).approximately(1, .05);
});
