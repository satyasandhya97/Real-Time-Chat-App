interface IUser extends Document {
    _id: string;
    name: String;
    email: string;
}

export interface AuthenticatedRequest extends Request{
    
}