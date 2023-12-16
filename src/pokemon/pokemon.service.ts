import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase(); 

    try {

      const pok = await this.pokemonModel.create(createPokemonDto);
      return pok;

    } catch (error) {
      this.handleExceptions ( error );
    }
  }

  async findAll() {
    return this.pokemonModel.find()
  }

  async findOne(term: string) {

    let pokemon: Pokemon

    if( !isNaN(+term) )  pokemon = await this.pokemonModel.findOne({ no: term});  
    else if (isValidObjectId ( term )) pokemon = await this.pokemonModel.findById(term); 
    else pokemon = await this.pokemonModel.findOne({ name : term});

    if( ! pokemon ) {
      throw new NotFoundException('Pokemon no encontrado');
    }
    return pokemon;
  }

  async update(term : string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne( term )
      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
      await pokemon.updateOne( updatePokemonDto )

      return { ...pokemon.toJSON(),  ...updatePokemonDto};

    } catch (error) {
      this.handleExceptions ( error );
    }
  }

  // async remove(id : string) {
  // const pokemon = await this.findOne(id )
     // await pokemon.deleteOne();
    // return pokemon;
     //const result = await this.pokemonModel.findByIdAndDelete(id 
  //   const result = await this.pokemonModel.deleteOne({_id: id }) 
  //   return result 
  // }

  async remove(id : string){
    const { deletedCount} = await this.pokemonModel.deleteOne({_id: id })
    
    if( deletedCount == 0) throw new BadRequestException('No existe el Pokemon')
    
    return {
      msg: `Deleted Pokemon ${ id }`
    };
  }
  
  private handleExceptions ( error : any) {
    if ( error?.code === 11000) {
      throw new BadRequestException(
        `Pokemos duplicado ${ JSON.stringify(error.keyValue) }` 
      );
      throw new InternalServerErrorException('Error al crear pokemon')
    }
  }

}

