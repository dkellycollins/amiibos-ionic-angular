import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core';
import { AmiiboSortField, AMIIBO_SORT_FIELD_OPTIONS } from '../../models/amiibo-sort.model';

/**
 * Opens an action sheet that lets the user pick which field the Amiibos list is sorted by.
 */
@Injectable()
export class SelectSortActionSheetService {

  constructor(private readonly actionSheetController: ActionSheetController) { }

  /**
   * Resolves with the chosen field, or undefined if the user cancelled.
   */
  public async open(currentField: AmiiboSortField): Promise<AmiiboSortField | undefined> {
    let selectedField: AmiiboSortField | undefined;

    const fieldButtons: Array<ActionSheetButton> = AMIIBO_SORT_FIELD_OPTIONS.map(option => {
      return {
        text: option.label,
        icon: option.field === currentField ? 'checkmark' : undefined,
        handler: () => {
          selectedField = option.field;
        }
      };
    });

    const cancelButton: ActionSheetButton = {
      text: 'Cancel',
      role: 'cancel'
    };

    const actionSheet = await this.actionSheetController.create({
      header: 'Sort by',
      buttons: [...fieldButtons, cancelButton]
    });

    await actionSheet.present();
    await actionSheet.onDidDismiss();
    return selectedField;
  }
}
