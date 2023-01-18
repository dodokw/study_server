import { IsEmail, Length } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  In,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";
import BaseEntity from "./Entity";

@Entity("users")
export class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: "Invalid email address" })
  @Length(1, 255, { message: "Email must be between 1 and 255 characters" })
  @Column({ unique: true })
  email!: string;

  @Index()
  @Length(3, 32, { message: "First name must be between 3 and 32 characters" })
  @Column({ unique: true })
  username!: string;

  @Column()
  @Length(8, 255, { message: "Password must be at least 8 characters" })
  password!: string;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes?: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
