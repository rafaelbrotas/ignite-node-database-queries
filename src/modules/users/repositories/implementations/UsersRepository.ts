import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return this.repository.findOneOrFail(user_id, { relations: ["games"] });
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository
      .createQueryBuilder("users")
      .orderBy("users.first_name", "ASC")
      .getMany();
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query("Select * from users where Upper(users.first_name) = $1 or Upper(users.last_name) = $2  order by first_name", [first_name.toUpperCase(), last_name.toUpperCase()]);

    return users;
  }
}
