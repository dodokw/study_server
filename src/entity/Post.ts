import { Exclude, Expose } from "class-transformer";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { makeid, slugify } from "../utils/helpers";
import Comment from "./Comment";
import BaseEntity from "./Entity";
import Sub from "./Sub";
import { User } from "./User";
import Vote from "./Vote";

@Entity("posts")
export default class Post extends BaseEntity {
  @Index()
  @Column()
  identifier?: string; //7 character id

  @Column()
  title!: string;

  @Index()
  @Column()
  slug?: string;

  @Column({ type: "text", nullable: true })
  body?: string;

  @Column()
  subName?: string;

  @Column()
  username?: string;

  @ManyToMany(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user?: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub?: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes!: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote?: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes![index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(7);
    this.slug = slugify(this.title);
  }
}
