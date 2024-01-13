export const validate = {
  isEightCharacters: (str: string) => {
    return str.length >= 8;
  },
  hasUppercase: (str: string) => {
    return /[A-Z]/.test(str);
  },
  hasNumbers: (str: string) => {
    var regex = /\d/g;
    return regex.test(str);
  },
  hasSpecialCharacter: (str: string) => {
    const regex = /[ -/:-@[-`{-~]/;
    return regex.test(str);
  },
  hasLowerCase: (str: string) => {
    return str.toUpperCase() !== str;
  },
  passwordMatch: (str: string, confirmStr?: string) => {
    return str === confirmStr && str.length > 0 && confirmStr.length > 0
  }
}

export const validateEmail = (email: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)

export const validateYoutubeURL = (url: string) => /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\/)?(?:(?:watch|embed)(?:\?v=|\/)?|list=(?:\w+&)?)([\w\-]+))(?:\S+)?$/.test(url)

export const validateDownloadURL = (url: string) => /^(https:\/\/)?(www\.)?(dropbox\.com|drive\.google\.com|onedrive\.live\.com)\/[^\s]+$/.test(url)

export const validatePassword = (password: string) => 
  validate.isEightCharacters(password) &&
  validate.hasUppercase(password) &&
  validate.hasNumbers(password) &&
  validate.hasSpecialCharacter(password) &&
  validate.hasLowerCase(password)

export const validateAll = (str: string, confirmStr?: string) =>
  validate.isEightCharacters(str) &&
  validate.hasUppercase(str) &&
  validate.hasNumbers(str) &&
  validate.hasSpecialCharacter(str) &&
  validate.hasLowerCase(str) &&
  validate.passwordMatch(str, confirmStr)

export const bothNotValid = (str: string, confirmStr?: string) =>
  !validate.isEightCharacters(str) ||
  !validate.hasUppercase(str) ||
  !validate.hasNumbers(str) ||
  !validate.hasSpecialCharacter(str) ||
  !validate.hasLowerCase(str) ||
  !validate.passwordMatch(str, confirmStr)

export const passwordNotValid = (str: string) => 
  !validate.isEightCharacters(str) ||
  !validate.hasUppercase(str) ||
  !validate.hasNumbers(str) ||
  !validate.hasSpecialCharacter(str) ||
  !validate.hasLowerCase(str)

