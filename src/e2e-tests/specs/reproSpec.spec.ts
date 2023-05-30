
import recordHomeFlexipage2 from 'salesforce-pageobjects/global/pageObjects/recordHomeFlexipage2';
describe('Spec file to reproduce upgrade issue', () => {

    afterAll(async () => {
        console.log('This shouldnt fail');
    });

    it('check to cover jasmine test count issue resolved in v8', async () => {
        try { await utam.load(recordHomeFlexipage2); }
        catch (exception) {

        }
        expect(2).toBe(1);
    })
})