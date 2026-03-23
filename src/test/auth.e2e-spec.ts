import {config} from "dotenv"
config()
import {Test} from "@nestjs/testing"
import { generateValidSignInData, generateValidSignUpData } from "./fixture/user.fixture"
import { PrismaService } from "../utils/prisma";
import { INestApplication } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import request, { Response } from "supertest";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { SignInDto } from "src/auth/dto/sign-in.dto";





describe("AuthController",() => {
    let app : INestApplication;
    let validSignUpData : SignUpDto;
    let prisma : PrismaService;
    beforeEach(async () => {
        
        const moduleRef = await Test.createTestingModule({
            imports : [
                AuthModule
            ],
            providers : [
                PrismaService
            ]
        })
        .compile()
        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        validSignUpData = generateValidSignUpData()
        await prisma.user.deleteMany()
        await app.init()
    })
    describe("test with valid data",() => {
        jest.setTimeout(30000)
        it("sign up and in test with user",async () => {
            let response = await request(app.getHttpServer())
            .post("/api/auth/signup")
            .send(
                validSignUpData
            ) 
            
            response = await request(app.getHttpServer())
            .post("/api/auth/signin")
            .send(generateValidSignInData(validSignUpData))
            expect( response.status).toBe(200)
            expect(response.body).toHaveProperty("access_token")
 })
        
    })

    afterAll(async () => {
        await app?.close()
    }) 
})