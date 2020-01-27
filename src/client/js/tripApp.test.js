import { getcurrentData } from './tripApp.js';



test("Test getPixabayData", () => {
    //postData(addTripDataURL, { id: recID, location: tripDest, date: tripStartDate, nights: tripNights });
    let result = getcurrentData();
    expect(result);
});