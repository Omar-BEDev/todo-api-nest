import { 
    Body, 
    Controller, 
    Get, 
    HttpCode, 
    Post, 
    Put, 
    UseGuards
} from "@nestjs/common";
import { TodoService } from "./todos.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { User } from "../common/decoraters/user.decorator";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Throttle } from "@nestjs/throttler";

@UseGuards(AuthGuard)

@Controller("api/todo")
export class TodoController {
    constructor(private readonly todoService : TodoService) {}
    @Throttle({
        default : {
            ttl : 60000,
            limit : 5
        }
    })
    @Post("/createTask")
    @HttpCode(200)
    async createTask(
        @User() userId : string,
        @Body() body : CreateTodoDto
    ) {
        return await this.todoService.createTodo(body, userId)
    }
    
    @Throttle({
        default : {
            ttl : 60000,
            limit : 5
        }
    })
    @Put("/updateTask")
    @HttpCode(200)
    async updateTask(
        @User() userId : string,
        @Body() body : UpdateTodoDto
    ) {
        return await this.todoService.updateTodo(body, userId)
    }
    
    @Get('/todos')
    @HttpCode(200)
    async getTodos(
        @User() userId : string
    ) {
        return await this.todoService.getTodos(userId)
    }
}
