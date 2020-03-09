import { ElementKit } from '../src/elementkit'
jest.mock('axios')

it('should throw an error if no api key is set', () => {
    expect(() => { new ElementKit({ apiKey: '' }) }).toThrow(Error);
});
