import {
  Entity as Collection,
  ObjectIdColumn,
  Column as Property,
  ObjectID,
  VersionColumn as VersionProperty,
  CreateDateColumn as CreateDateProperty,
  UpdateDateColumn as UpdateDateProperty,
  BaseEntity,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import { User } from '../user';
import { History } from '@history';
import { Tag } from '../tag/tag.model';
import { TagDTO } from '../tag/tag.dto';
import { Status } from './enum/status';
import { UserDto } from '../user/user.dto';
import { UserFileStatus } from './dto/userFileStatus.dto';
import { UserDTO } from '@shared/interfaces/user.dto';

@Collection('files')
export class File extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Property()
  title: string;

  @Property({
    unique: true,
  })
  name: string;

  @Property()
  type: string;

  @Property()
  size: number;

  @Property()
  url?: string;

  @Property()
  path: string;

  @OneToOne(type => User)
  @Property()
  original_author: UserDTO;

  @Property()
  history: Partial<History[]>;

  @ManyToMany(type => Tag)
  @Property()
  tags: TagDTO[];

  @OneToOne(type => User)
  @Property()
  currentUserCheckedIn: UserFileStatus;

  @Property({
    default: 'active',
  })
  status: 'active' | 'archived';

  @VersionProperty()
  version: number;

  @CreateDateProperty()
  created_at: Date;

  @UpdateDateProperty()
  updated_at: Date;

  setData(data: Partial<File>) {
    Object.assign(this, data);
  }

  addToHistory(data: History) {
    if (!this.history) {
      this.history = new Array<History>();
    }
    this.history.push(data);
  }

  restoreVersion(historyVersion: number) {
    const historyFile = this.history.find(
      history => history.version === historyVersion,
    );

    if (historyFile) {
      this.size = historyFile.size;
      this.path = historyFile.path;
      this.version = historyFile.version;
      this.tags = historyFile.tags;
      this.title = historyFile.title;
      return true;
    }
    return false;
  }

  getLastVersion() {
    return this.history ? this.history.length : 0;
  }

  toJson(showHistory = true) {
    const { _id, title, name, type, size, url, path, original_author, history, tags, status, version, currentUserCheckedIn, updated_at } = this;
    const response = {
      _id,
      title,
      name,
      type,
      size,
      url,
      path,
      original_author,
      history,
      tags,
      status,
      version,
      currentUserCheckedIn,
      updated_at,
    };
    if (!showHistory) {
      delete response.history;
    }
    return response;
  }
}
