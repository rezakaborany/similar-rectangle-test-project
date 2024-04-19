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
            const { input, main } = body
            let rectangles: IRectangle[] = []
            for (const rectangle of input) {
                if (this.checkCommonRectangles(main, rectangle)) {
                    rectangles.push(rectangle)
                    await this.rectangleRepository.save(rectangle);
                }
            }
            return rectangles;
        }
        catch (err) {
            throw err
        }
    }

    async getAllRectangles(): Promise<Rectangle[]> {
        try {
            return this.rectangleRepository.find();
        } catch (err) {
            throw err
        }
    }

    private checkCommonRectangles(rect1: IRectangle, rect2: IRectangle): Boolean {
        const xOverlap = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
        const yOverlap = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));

        const touchingButNotOverlapping = (xOverlap === 0 && yOverlap > 0) || (xOverlap > 0 && yOverlap === 0);
        const overlapping = xOverlap > 0 && yOverlap > 0;
        const intersectingAtCorners =
            (xOverlap === 0 && yOverlap === 0) &&
            (
                (rect1.x === rect2.x + rect2.width && rect1.y === rect2.y + rect2.height) ||
                (rect1.x === rect2.x + rect2.width && rect1.y + rect1.height === rect2.y) ||
                (rect1.x + rect1.width === rect2.x && rect1.y === rect2.y + rect2.height) ||
                (rect1.x + rect1.width === rect2.x && rect1.y + rect1.height === rect2.y)
            );

        return touchingButNotOverlapping || overlapping || intersectingAtCorners;
    }
}