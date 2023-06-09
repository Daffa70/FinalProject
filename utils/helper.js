module.exports = {
  generateOtpNumber: () => {
    // Generate a random 6-digit number
    const min = 100000;
    const max = 999999;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
  },
};