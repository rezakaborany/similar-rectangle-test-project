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
        try {
            const { input, main } = body;
            // Filter input rectangles that have common areas with main rectangle
            const filteredRectangles = input.filter((rectangle) => this.checkCommonRectangles(main, rectangle));
            // Save filtered rectangles (or use batch saving if needed)
            await Promise.all(filteredRectangles.map((rectangle) => this.rectangleRepository.save(rectangle)));
            return filteredRectangles;
        } catch (err) {
            throw err;
        }
    }

    async getAllRectangles(): Promise<Rectangle[]> {
        try {
            //return all of rectangles with date
            return this.rectangleRepository.find();
        } catch (err) {
            throw err
        }
    }

    private checkCommonRectangles(rect1: IRectangle, rect2: IRectangle): Boolean {
        const xOverlap: number = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
        const yOverlap: number = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));

        const touchingButNotOverlapping: boolean = (xOverlap === 0 && yOverlap > 0) || (xOverlap > 0 && yOverlap === 0);
        const overlapping: boolean = xOverlap > 0 && yOverlap > 0;
        const intersectingAtCorners: boolean =
            (xOverlap === 0 && yOverlap === 0) &&
            (
                (rect1.x === rect2.x + rect2.width && rect1.y === rect2.y + rect2.height) ||
                (rect1.x === rect2.x + rect2.width && rect1.y + rect1.height === rect2.y) ||
                (rect1.x + rect1.width === rect2.x && rect1.y === rect2.y + rect2.height) ||
                (rect1.x + rect1.width === rect2.x && rect1.y + rect1.height === rect2.y)
            );
        //if one of the conditions is true, true is returned 
        return touchingButNotOverlapping || overlapping || intersectingAtCorners;
    }
}