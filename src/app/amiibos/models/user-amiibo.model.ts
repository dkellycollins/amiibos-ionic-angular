export interface UserAmiiboModel {
  /**
   * The unique id of the UserModel, if available.
   */
  userUid?: string;

  /**
   * The unique id of the AmiiboModel.
   */
  amiiboSlug: string;

  /**
   * Indicates if the AmiiboModel has been collected by the user.
   */
  isCollected: boolean;
}
