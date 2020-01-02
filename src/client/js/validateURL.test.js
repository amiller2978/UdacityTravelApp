import { validateURL } from "./validateURL";


  test('Test validateURL',()=>{
    let result = validateURL('http://www.google.com');
    expect(result).toBe(true);
  });