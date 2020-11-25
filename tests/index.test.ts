import { ElementKit } from '../src/index'

it('should throw an error if no api key is set', () => {
    expect(() => { new ElementKit({ apiKey: '' }) }).toThrow(Error);
});