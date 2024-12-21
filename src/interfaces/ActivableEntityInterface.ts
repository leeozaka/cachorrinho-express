/**
 * Interface for entities that can be activated/deactivated and soft deleted
 */
export default interface ActivableEntity {
  isActive: boolean;
  isDeleted: boolean;

  /**
   * Sets entity as inactive
   */
  inactivate(): this;

  /**
   * Marks entity as deleted (soft delete)
   */
  logicalDelete(): this;

  /**
   * Reactivates a previously inactive entity
   */
  activate(): this;
}

/**
 * Mixin to implement ActivableEntity methods
 */
export const ActivableEntityMixin = {
  inactivate<T extends ActivableEntity>(this: T): T {
    this.isActive = false;
    return this;
  },

  logicalDelete<T extends ActivableEntity>(this: T): T {
    this.isActive = false;
    this.isDeleted = true;
    return this;
  },

  activate<T extends ActivableEntity>(this: T): T {
    this.isActive = true;
    return this;
  },
};
