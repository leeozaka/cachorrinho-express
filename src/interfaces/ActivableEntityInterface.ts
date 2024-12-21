/**
 * Interface for entities that can be activated/deactivated and soft deleted
 */
export default interface ActivableEntity {
  isActive: boolean;
  isDeleted: boolean;
  lastModified: Date;
  createdAt: Date;

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
  inactivate<T extends ActivableEntity>(this: T) {
    this.isActive = false;
    this.lastModified = new Date();
    return this;
  },

  logicalDelete<T extends ActivableEntity>(this: T) {
    this.isDeleted = true;
    this.lastModified = new Date();
    return this;
  },

  activate<T extends ActivableEntity>(this: T) {
    this.isActive = true;
    this.lastModified = new Date();
    return this;
  },
};
