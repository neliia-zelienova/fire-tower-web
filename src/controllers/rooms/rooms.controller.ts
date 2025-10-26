import { Controller, Post } from "@nestjs/common";
import { Public } from "src/decorators/public-routes.decorator";
import { PrismaService } from "src/services/prisma/prisma.service";

@Controller('rooms')
export class RoomsController {
    constructor(private readonly prisma: PrismaService) {}


    @Post('')
    @Public()
    async createRoom() {
    }
}
