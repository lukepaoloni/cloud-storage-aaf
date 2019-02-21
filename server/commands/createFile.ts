import axios from 'axios';
import { File as FileModel } from '../src/file/file.model';
import * as faker from 'faker';
import { User } from '@user';
import { normalize, join } from 'path';
import * as download from 'image-downloader';
import { DeepPartial } from 'typeorm';
const path = normalize(
  `${join(__dirname, '../../client', 'public', 'uploads')}/tmp`,
);
const url = faker.image.image();
const name = faker.random.word();
const tag = faker.random.word();
const filename = /[^/]*$/.exec(url)[0] + '.jpg';
axios.get('http://localhost:4000/api/rest/users').then(res => {
  const users: User[] = res.data;
  const user = users[faker.random.number(48)];
  download
    .image({ url, dest: `${path}/${filename}` })
    .then(image => {
      const body: DeepPartial<FileModel> = {
        name: filename,
        url,
        title: name,
        size: image.image.length,
        original_author: { id: user.id, email: user.email, name: user.name },
        tags: [{ title: tag, code: tag.toLowerCase().replace(/ /g, '_') }],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };
      console.log(body);
      axios.post(`http://localhost:4000/api/rest/files`, body).then(__res => {
        console.log(__res.data);
      }).catch(err => console.error(err));
    })
    .catch(err => console.error(err));
});
