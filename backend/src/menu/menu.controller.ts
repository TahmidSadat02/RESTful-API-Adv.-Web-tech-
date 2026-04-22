import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { Public } from "../auth/decorators/public.decorator";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guard/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UserRole } from "../user/user.entity";
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth() // This tells Swagger that these endpoints require a token
@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Public()
    @Get()
    async getMenu() {
        return await this.menuService.findAll();
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async addMenuItem(@Body() createMenuDto: CreateMenuDto) {
        return await this.menuService.create(createMenuDto);
    }
}