import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateTodoDto } from "./dto/create-todo.dto";
import {PrismaService} from "src/utils/prisma";
import { UpdateTodoDto } from "./dto/update-todo.dto";



@Injectable()
export class TodoService {
    constructor(private readonly prisma : PrismaService) {}
    async createTodo(body : CreateTodoDto, userId : string) {
     await this.prisma.todo.create({
        data : {
           name : body.name,
           description : body.description,
           userId : userId
        }
        })
        return {
            message : "create task succesfully"
        }
    }

    async updateTodo(body : UpdateTodoDto, userId : string) {
        await this.prisma.todo.update({
            where : {
                id : userId
            },
            data : {
                name : body.name,
                description : body.description
            }
        })
        return {
            message : "update todo succefully",
        }
    }
    async getTodos(userId : string) {
        const todos = await this.prisma.todo.findMany({
            where : {
                id : userId
            },
            select : {
                name : true,
                description : true,
                createdAt : true
            }
        })
        return {
            todos : todos
        }
    }
}

