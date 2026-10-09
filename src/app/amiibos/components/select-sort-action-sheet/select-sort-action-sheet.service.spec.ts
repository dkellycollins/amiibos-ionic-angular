import { ActionSheetController } from '@ionic/angular';
import { ActionSheetOptions } from '@ionic/core';
import { SelectSortActionSheetService } from './select-sort-action-sheet.service';

describe('SelectSortActionSheetService', () => {
  let createdOptions: ActionSheetOptions;
  let buttonToClick: string | undefined;
  let service: SelectSortActionSheetService;

  beforeEach(() => {
    createdOptions = undefined;
    buttonToClick = undefined;

    // Simulates the user tapping the button labelled `buttonToClick` (or dismissing when undefined).
    const actionSheetController = {
      create: async (options: ActionSheetOptions) => {
        createdOptions = options;

        return {
          present: async () => { },
          onDidDismiss: async () => {
            const clickedButton = options.buttons.find(button => {
              return typeof button !== 'string' && button.text === buttonToClick;
            });

            if (clickedButton && typeof clickedButton !== 'string' && clickedButton.handler) {
              clickedButton.handler();
            }

            return {};
          }
        };
      }
    } as unknown as ActionSheetController;

    service = new SelectSortActionSheetService(actionSheetController);
  });

  it('returns the selected field', async () => {
    buttonToClick = 'Release date';
    const result = await service.open('name');
    expect(result).toBe('releaseDate');
  });

  it('returns undefined when cancelled', async () => {
    buttonToClick = 'Cancel';
    const result = await service.open('name');
    expect(result).toBeUndefined();
  });

  it('marks the current field with a checkmark', async () => {
    await service.open('series');

    const seriesButton = createdOptions.buttons.find(button => {
      return typeof button !== 'string' && button.text === 'Series';
    });

    expect(typeof seriesButton !== 'string' && seriesButton.icon).toBe('checkmark');
  });
});
