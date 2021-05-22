import Firebase, { FirebaseObj } from "./API/Firebase";

test('Get Super-Admin Info', async () => {
  // expect.assertions(1);
  const firebase = FirebaseObj;
  const getSuper = firebase.getUserByUID("6ykgDp4swCWj1WJbUGfnZ5BPEIJ2");
  await expect(getSuper).resolves.toMatchObject({
    email : "admin@gmail.com",
    uid   : "6ykgDp4swCWj1WJbUGfnZ5BPEIJ2",
    rol   : "Garbage"
  });
});
