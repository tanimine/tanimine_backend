const indonesiaPhoneNumberFormat = (phoneNumber: string) => {
  if (phoneNumber[0] === '0') {
    phoneNumber = phoneNumber.slice(1)
  }

  if (phoneNumber[0] === '8') {
    phoneNumber = `+62${phoneNumber}`
  }

  return phoneNumber
}

export { indonesiaPhoneNumberFormat }
