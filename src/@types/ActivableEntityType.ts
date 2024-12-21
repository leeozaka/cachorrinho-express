/**
 * Type for entities that implement IActivableEntity
 */
export type ActivableEntityType = {
  isActive: boolean;
  isDeleted: boolean;
  updatedAt?: Date;
  createdAt: Date;
};
