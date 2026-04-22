import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
    
    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsBoolean()
    @IsNotEmpty()
    isAvailable?: boolean;
}