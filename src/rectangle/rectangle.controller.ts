import { Controller, Post, Get, Body } from '@nestjs/common';
import { RectangleService } from './rectangle.service';
import { IRectangle } from './interface/rectangle.interface';
import { RectangleInputDto } from './dto/rectangle.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Rectangle } from './entity/rectangle.entity';

@Controller('rectangles')
export class RectangleController {
    constructor(private rectangleService: RectangleService) { }

    @Post()
    @ApiBody({
        type: RectangleInputDto
    })
    @ApiResponse({ description: 'Save Rectangle' })
    async saveRectangle(@Body() body: RectangleInputDto): Promise<IRectangle[]> {
        return this.rectangleService.saveRectangle(body);
    }

    @Get()
    @ApiResponse({ description: 'Retrieves all rectangles successfully', type: [Rectangle] })
    async getAllRectangles(): Promise<Rectangle[]> {
        return this.rectangleService.getAllRectangles();
    }
}