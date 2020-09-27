export interface UserModel {
  /**
   * The unique identifier of the User.
   */
  uid: string;

  /**
   * A url to the user's avatar image, if available.
   */
  photoUrl?: string;

  /**
   * The text to display to represent the user.
   */
  displayName: string;
}
