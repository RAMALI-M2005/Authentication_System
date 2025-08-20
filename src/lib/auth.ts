import { Cookies } from "@/types/typescript";
import crypto from 'crypto';
import dbConnect from "./dbConnect";
import User from "@/models/user.model";


const SESSION_EXPIRATION_SECONDS = 7 * 60 * 60 * 24; // 7 day

export const createUserSession = async (id:string,cookies:Cookies)=>{
    const sessionId = crypto.randomBytes(512).toString('hex').normalize();

    await dbConnect();

    try {

        const user = await User.findByIdAndUpdate(id, { sessionId }, { new: true });
        if (!user) {
            return {message: "User not found" };
        }

        setCookie(sessionId,cookies);
        
    } catch  {
    return { message: "Error creating session" };
}


}

const setCookie = (sessionId: string, cookies: Pick<Cookies, "set">) => {
    cookies.set("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000)
    });
};



export const getUserFromSession = async (cookies:Pick<Cookies,"get">) => {

    const sessionCookie = cookies.get("sessionId");
    if (!sessionCookie) {
        return null;
    }

    const sessionId = sessionCookie.value;

    await dbConnect();

    try {
        const user = await User.findOne({ sessionId });
        

        const formatUser = {
            _id: user?._id.toString(),
            name: user?.name,
            email: user?.email,
            avatarURL: user?.avatarURL,
            workspaces: user?.workspaces,
            sessionId: user?.sessionId
        }

        return formatUser;

    } catch {
        return null;
    }

}


export const removeUserFromSession = async (cookies:Pick<Cookies,"get" | "delete">) => {
    const sessionCookie = cookies.get("sessionId");
    if (!sessionCookie) {
        return { error: "No active session found" };
    }

    const sessionId = sessionCookie.value;

    await dbConnect();

    try {
        // Clear the session ID from the user document
        await User.updateOne({ sessionId }, { $unset: { sessionId: "" } });

        // Remove the cookie
        cookies.delete("sessionId");

        return { message: "Signed out successfully" };
    } catch {
        return { error: "Error signing out" };
    }
}