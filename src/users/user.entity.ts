import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`User with id: ${this.id} inserted`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User with id: ${this.id} removed`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User with id: ${this.id} updated`);
  }
}
