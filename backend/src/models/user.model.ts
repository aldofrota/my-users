import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: number;

  @Prop({ required: true })
  password: string;
}

export const UserModel = SchemaFactory.createForClass(User);
