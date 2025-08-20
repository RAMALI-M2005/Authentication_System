import { IUser, WorkspaceRef } from '@/types/typescript';
import mongoose, { Schema , Model } from 'mongoose';



const WorkspaceSchema = new Schema<WorkspaceRef>(
    {
        workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
        role: { type: String, enum: ['owner', 'member'], required: true },
    },
    { _id: false }
);

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        firstname:{type:String},
        lastname:{tyep:String},
        email: { type: String, required: true, unique: true, index: true, lowercase: true },
        password: { type: String}, 
        salt: { type: String},
        avatarURL: { type: String },
        workspaces: { type: [WorkspaceSchema], default: [] },
        sessionId: { type: String, default: "" },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;