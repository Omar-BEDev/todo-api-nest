import { SignInDto } from "../../auth/dto/sign-in.dto";

import {faker} from "@faker-js/faker"
import { SignUpDto } from "../../auth/dto/sign-up.dto";

const TEST_PASSWORD = "123testing!M"

export const generateValidSignUpData = (): SignUpDto => {
    const validSignUpData : SignUpDto= { 
    name : faker.person.firstName(),
    nickName : faker.person.lastName(),
    email : faker.internet.email(),
    password : TEST_PASSWORD
    }
    return validSignUpData
}

export const generateValidSignInData = (validSignUpData: SignUpDto) : SignInDto => {
   const validSignInData : SignInDto = {
      email : validSignUpData.email,
      password : TEST_PASSWORD
  }
  return validSignInData
}

export const generateInValidSignUpData = (): SignUpDto => {
    const inValidSignUpData : SignUpDto= { 
    name : faker.person.firstName(),
    nickName : faker.person.lastName(),
    email : faker.internet.email(),
    password : faker.internet.password()
    }
    return inValidSignUpData
}

export const generateInValidSignInData = (inValidSignUpData: SignUpDto) : SignInDto => {
   const inValidSignInData : SignInDto = {
      email : inValidSignUpData.email,
      password : TEST_PASSWORD
  }
  return inValidSignInData
}