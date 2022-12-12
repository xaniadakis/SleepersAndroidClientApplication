export default class Utils {

  static equals(string1: string, username: string) {
    return string1 == username;
  }

  static notEmpty(string: string) {
    if (string == null || string.trim().length === 0)
      return false;
    else
      return true;
  }
}
