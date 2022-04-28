export class AbstractEntity {
  id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id: string) {
    this.id = id;
  }
}
