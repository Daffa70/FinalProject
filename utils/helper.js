module.exports = {
  generateOtpNumber: () => {
    // Generate a random 6-digit number
    const min = 100000;
    const max = 999999;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
  },

  generateBookingCode: () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 6;
    let bookingCode = "";

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      bookingCode += characters.charAt(randomIndex);
    }

    return bookingCode;
  },
};
