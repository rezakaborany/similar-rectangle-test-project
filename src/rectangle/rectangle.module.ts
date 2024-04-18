import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RectangleService } from './rectangle.service';
import { RectangleController } from './rectangle.controller';
import { Rectangle } from './entity/rectangle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rectangle])],
  providers: [RectangleService],
  controllers: [RectangleController],
})
export class RectangleModule {}