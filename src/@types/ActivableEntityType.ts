import { DateTime } from 'luxon';

/**
 * Type for entities that implement IActivableEntity
 */
export type ActivableEntityType = {
  isActive: boolean;
  isDeleted: boolean;
  lastModified: DateTime;
  createdAt: DateTime;
};
