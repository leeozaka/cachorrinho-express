import { ActivableEntityType } from 'types/ActivableEntityType';

export class ActivableEntityMapper {
  static toDomain<T extends ActivableEntityType>(entity: T): T {
    return {
      ...entity,
      createdAt: new Date(entity.createdAt),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt) : null,
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
    } as T;
  }
}
