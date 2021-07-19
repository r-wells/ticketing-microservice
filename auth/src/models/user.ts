import mongoose from 'mongoose';
import { Password } from './../services/password';

// An interface describing the properties for creating a new user
interface UserAttrs {
    email: string;
    password: string;
}

// Interface describing the properties a User model has
interface UserModel extends mongoose.Model<UserDocument> {
    build(attrs: UserAttrs): UserDocument;
}

// Interfsce describing what properties a User document has
interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    }
);

UserSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password')); // Gets password off the document
        this.set('password', hashed);
    }
    done();
});

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export { User };