import { ISODateString } from "next-auth";
import { PrismaClient } from "@prisma/client";


export interface GraphQLContext {
  session: Session | null;
  // prisma: PrismaClient;
}

export interface Session {
  user: User;
  expires: ISODateString;
}

export interface User {
  id: string;
  username: string;
  name: string;
  image: string;
  email: string;
  emailVerified: boolean;
}