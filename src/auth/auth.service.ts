import { 
    ConflictException,
    Injectable, 
    InternalServerErrorException, 
    UnauthorizedException 
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "./dto/sign-in.dto";
import { PrismaService } from "../utils/prisma";
import * as bcrypt from "bcrypt"
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService : JwtService,
        private readonly prisma : PrismaService
    ) {}
    //-----------------------------------------------------------------------------------------------------
    // Auxiliary functions of auth services main functions
    private async createToken(userId : string) {
        const token = await this.jwtService.signAsync(
            { userId : userId},
        )
        return token
    }
    private async searchUser(email : string) {
        const user = await this.prisma.user.findUnique({
            where : {
                email : email
            },
            select : {
                id : true,
                password : true
            }
        })
        return user
    }
    private async isSamePassword (inputPassword : string, originalPassword : string) : Promise<boolean> {
       const checkPass = await bcrypt.compare(inputPassword,originalPassword)
       return checkPass
    }

    private async isDuplicateEmail(email : string) : Promise<boolean>{
        const isAvailableEmail = await this.prisma.user.findUnique({
            where : {
                email : email
            }
        })
        if (!isAvailableEmail) {
            return false
        }
        return true
    }
    private async createUser(body : SignUpDto)  {
        
        const hashedPassword = await bcrypt.hash(body.password,10)
        const newUser = await this.prisma.user.create({
            data : {
                name : body.name,
                nickName : body.nickName,
                email : body.email,
                password : hashedPassword
            }
        })
        return newUser
    }


    //-----------------------------------------------------------------------------------------------------
    // The main functions of auth services
    public async signIn(body : SignInDto) {
        const user = await this.searchUser(body.email)
        if (!user) {
            throw new UnauthorizedException("email or password are wrong!")
        }
        const result = await this.isSamePassword(body.password,user.password)
        if (!result) {
            throw new UnauthorizedException("email or password are wrong!")
        }
        const token = await this.createToken(user.id).catch(() =>{
            throw new InternalServerErrorException("Something went wrong, please try again")
        })
        
        return {access_token : token}
    }

    public async signUp(body : SignUpDto) {
        const isDuplicateEmail = await this.isDuplicateEmail(body.email)
        if (isDuplicateEmail) {
            throw new ConflictException("Email already in use")
        }
        const newUser = await this.createUser(body).catch(() => {
            throw new InternalServerErrorException("Something went wrong, please try again")
        })
        const token = await this.createToken(newUser.id).catch(() => {
            throw new InternalServerErrorException("Something went wrong, please try again")
        })
        return {access_token : token}
    }
}

