import { UserPublication } from "@userPublications/entities/UserPublication";
import { CreateUserPublicationDTO, IUserPublicationRepository, ListUserPublicationPaginateReturn, GetAllPaginateParams } from "./IUserPublicationRepository";
import { QueryBuilder, Repository } from "typeorm";
import { PostgresDataSource } from "@shared/typeorm/connect";

export class UsersPublicationRepository implements IUserPublicationRepository {
   userPublicationRepository: Repository<UserPublication>;
   constructor() {
      this.userPublicationRepository = PostgresDataSource.getRepository(UserPublication);
   }

   //create user Publication
   async createUserPublication({
      title,
      description,
      service,
      user,
   }: CreateUserPublicationDTO): Promise<UserPublication> {
      const userPublication = await this.userPublicationRepository.create({
         title,
         description,
         service,
         //instance user to typeorm save userId
         user,
      });

      

      return this.userPublicationRepository.save(userPublication);
   }

   //get All UserPublications with pagination
   async getAllUserPublications({ page, skip, take} : GetAllPaginateParams): Promise<ListUserPublicationPaginateReturn> {
      //criar query,  desestruturar userPublications a quantidade de users publication existente
      const [userPublications, count] = await this.userPublicationRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount() //get the records and the total count in the table. Return thems in an array

      //return object do tipo ListUserPublicationPaginateReturn 
      const result = {
         per_page: take,
         total: count,
         current_page: page,
         data: userPublications
      }


      return result;
   }

   async findUserPublicationById(id: string): Promise<UserPublication | null> {
      return this.userPublicationRepository.findOneBy({ id: id});
   }
}
