module.exports = {
  generateOtpNumber: () => {
    // Generate a random 6-digit number
    const min = 100000;
    const max = 999999;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
  },

  generateBookingCode: (userId) => {
    const code = userId + generateRandomCode();
    return code;
  },
};
function generateRandomCode() {
  // Generate a random alphanumeric code, you can customize this based on your requirements
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}
