import { CreateTodoDto } from "src/todos/dto/create-todo.dto";
import { UpdateTodoDto } from "src/todos/dto/update-todo.dto";
import {faker} from "@faker-js/faker";

export const generateValidCreateTodoData = (): CreateTodoDto => {
    const validTodoData : CreateTodoDto = {
        name : faker.lorem.words(3),
        description : faker.lorem.sentence()
    };
    return validTodoData;
};

export const generateValidUpdateTodoData = (): UpdateTodoDto => {
    const validUpdateTodoData : UpdateTodoDto = {
        name : faker.lorem.words(3),
        description : faker.lorem.sentence()
    };
    return validUpdateTodoData;
};

export const generateInvalidCreateTodoData = (): CreateTodoDto => {
    const invalidData : CreateTodoDto = {
        name: faker.lorem.word(1),
        description: faker.lorem.words(501)
    }
    return invalidData
}

export const generateInvalidUpdateTodoData = (): CreateTodoDto => {
    const invalidData : CreateTodoDto = {
        name: faker.lorem.word(51),
        description: faker.lorem.words(501)
    }
    return invalidData
}