import { IsNumber , ValidateNested , IsArray } from 'class-validator';

export class RectangleDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

export class RectangleInputDto {
    @ValidateNested()
    main: RectangleDto;
    
    @IsArray()
    @ValidateNested({ each: true })
    input: RectangleDto[];
  }