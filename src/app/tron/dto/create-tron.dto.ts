import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTronDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
