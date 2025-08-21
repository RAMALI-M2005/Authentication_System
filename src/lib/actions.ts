"use server"
import User from "@/models/user.model";
import { comparePasswords, generateSalt, hashPassword } from "@/lib/helpers";
import { createUserSession, removeUserFromSession } from "./auth";
import dbConnect from "./dbConnect";
import { cookies } from "next/headers";
import { OAuthClient } from "./oauth/base";

export const signIn = async(data: { email: string; password: string }) => {

    const { email, password } = data;
    
    if (!email || !password) {
        return {status:false,error:"Email and password are required",verificate:false};
    }
    
   try {
     await dbConnect();
    
    const  user = await User.findOne({ email });
    if (!user) {
        return {status:false,error:"User not found",verificate:false};
    }
    const hashedPassword = String(user.password)
    const salt = String(user.salt);
    const isPasswordValid =  comparePasswords(password, hashedPassword, salt);
    if (!isPasswordValid) {
        return {status:false,error :"Invalid password",verificate:false};
    }

    if(!user?.verification?.isVerified)    return {status:false,error:`email not verified`,desc:`${email}`,verificate:true};

    await createUserSession(String(user._id), await cookies());
    
   return {status:true,message:"User signed in successfully"};
   } catch(error)  {
    console.log("error:",error)
    return {status:false,error:`Unable to sign you. Please try again later`};
   }
}

export const signUp = async(data: { name: string; email: string; password: string }) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        return {status:false,message:"Name, email, and password are required"};
    }

    await dbConnect();

 try {
       const existingUser = await User.findOne({ email });
    if (existingUser) {
        return {status:false,message:"Email already in use"};
    }


    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        salt
    });

    await newUser.save();

 return {status:true,message:"User created successfully",desc:"verify your email",email};
 } catch{
    return {status:false,error:"Unable to create you account"};
 }
}

export const signOut = async () => {
  return  await removeUserFromSession(await cookies());
}


export const oAuthSignIn = async () => {
  return new OAuthClient().createOAuthUrl();
};

export async function connectUserToAccount(
  { email, name, firstName, lastName, picture }: {
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    picture: string;
  }
) {
  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) {
    const newUser = new User({
      name,
      firstname: firstName,
      lastname: lastName,
      email,
      avatarURL: picture,
    });
    const savedUser = await newUser.save();
    await createUserSession(String(savedUser._id), await cookies());
    return;
  }

  await createUserSession(String(user._id), await cookies());
  return;
}