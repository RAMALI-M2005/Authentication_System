"use server"
import User from "@/models/user.model";
import { comparePasswords, generateSalt, hashpassword } from "./helpers";
import { createUserSession, removeUserFromSession } from "./auth";
import dbConnect from "./dbConnect";
import { cookies } from "next/headers";
import { OAuthClient } from "./oauth/base";

export const signIn = async(data: { email: string; password: string }) => {

    const { email, password } = data;
    
    if (!email || !password) {
        return {error:"Email and password are required"};
    }
    
   try {
     await dbConnect();
    
    const  user = await User.findOne({ email });
    if (!user) {
        return {error:"User not found"};
    }
    const hashedPassword = String(user.password)
    const salt = String(user.salt);
    const isPasswordValid = await comparePasswords(password, hashedPassword, salt);
    if (!isPasswordValid) {
        return {error :"Invalid password"};
    }

    await createUserSession(String(user._id), await cookies());
    
   return {message:"User signed in successfully"};
   } catch  {
    return {error:`Unable to sign you. Please try again later`};
   }

}

export const signUp = async(data: { name: string; email: string; password: string }) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        return {error:"Name, email, and password are required"};
    }

    await dbConnect();

 try {
       const existingUser = await User.findOne({ email });
    if (existingUser) {
        return {error:"Email already in use"};
    }

    const salt = generateSalt();
    const hashedPassword = hashpassword(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        salt
    });

    await newUser.save();

    const id = String(newUser._id);

   await createUserSession(id,await cookies());

    return {message:"User created successfully"};
 } catch{
    return {error:"Unable to create you account"};
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