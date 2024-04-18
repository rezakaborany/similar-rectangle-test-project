import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rectangle } from './entity/rectangle.entity';
import { IRectangle } from './interface/rectangle.interface';
import { RectangleInputDto } from './dto/rectangle.dto';

@Injectable()
export class RectangleService {
    constructor(
        @InjectRepository(Rectangle)
        private rectangleRepository: Repository<Rectangle>,
    ) { }

    async saveRectangle(body: RectangleInputDto): Promise<IRectangle[]> {
        const { input, main } = body
        let rectangles: IRectangle[] = []
        for (const rectangle of input) {
            if (
                (rectangle.x === main.x)
                ||
                (rectangle.y === main.y)
                ||
                (rectangle.height === main.height)
                ||
                (rectangle.width === main.width)
            ) {
                rectangles.push(rectangle)
                await this.rectangleRepository.save(rectangle);
            }
        }
        return rectangles;
    }

    async getAllRectangles(): Promise<Rectangle[]> {
        return this.rectangleRepository.find();
    }
}