import { IsInt, IsPositive, IsString, MinLength, Min } from "class-validator";
export class CreatePokemonDto {

    @IsString()
    @MinLength(1)
    name :string;

    // @IsInt()
    // @IsPositive()
    // @Min(1)
    @IsString()
    no?: number;
}
