import * as express from 'express';
// Request interface extension

interface MessageResponse {
  message: string;
}

interface ErrorResponse extends MessageResponse {
  stack?: string;
}

interface Request extends express.Request {
  params: {
    id: string; // Assuming comment IDs are strings
  };
  session?: express.CookieOptions;
}

// Response interface extension
interface Response extends express.Response {
  status(code: number): this;
  json(data: Record<string, unknown>): this;
}

interface CommentProps { 

  comment?: {

    id?: string;

    postId?: string;

    commentId?: string;

    userId?: string;

    createdAt?: Date;

    updatedAt?: Date;

    comments?: CommentProps[];

    profileName?: string;

    content?: string;

    img?: string;

    audio?: string;

    file?: string;

    commentHierarchy?: CommentProps;

    user?: string;

    likes?: ILike[];

  };

  commentId?: string;

  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => Promise<void>;
  onComment?: (commentId: string, content: string) => void;
  postLikeForComment?: (commentId: string) => void;

}


type ApiDataType = {
  token?: string;
  message: string;
  status: 'success' | 'danger';
  posts?: IPost[];
  todo?: TodoProps['todo'];
  profile?: IProfile;
  picture?: IPicture;
  profiles: IProfile[];
};

interface IPost {
  id: string;
  title: string;
  content: string;
  status?: boolean; // Assuming false by default
  createdAt?: string;
  updatedAt?: string;
  accToken?: string;
  profileId: number;
  likes?: ILike[];
}

interface IPicture {
  id: string;
  profileId: number;
  avatarUrl: string;
  createdAt?: string;
  updatedAt?: string;
  accToken?: string;
}

interface ILike {
  id: string;
  profileId: string;
  userId: string;
  post?: IPost;
  comment?: CommentProps;
  commentId?: string;
  postId?: string;
  profile: IProfile;
  user: IUser;
  createdAt?: string;
  accToken?: string;
}

interface IProfile {
  id: string;
  userId: string;
  authorEmail: string;
  website: string;
  username: string;
  company: string;
  status?: boolean; // Assuming false by default
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  picture?: IPicture;
  programmingLanguages?: string[];
}

interface IUser {
  id: string;
  email?: string;
  username?: string;
  password?: string;
  paswordHash?: string;
  name: string;
  session?: string;
  secret?: string;
}

type TodoProps = {
  todo: IPost;
};

type GetPostsResponse = {
  posts: IPost[];
};

interface ProfilePageProps {
  childToParent?: boolean;
}

interface ReadMoreButtonProps {
  postId: number;
}

interface ProfilesProps {
  profiles: IProfile[];
}

// type ToastProps = {
//   show: boolean;
//   onClose: () => void;
//   title: string;
//   message: string;
//   variant: 'success' | 'danger' | 'warning' | 'info';
// };

type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

interface ToastMessage {
  title: string;
  message: string;
  variant: ToastVariant;
}


declare global {
  namespace Express {
    interface Request {
      user?: IUser; // You can replace 'any' with a more specific type if you have one
    }
  }
}

// Documenting changes to the interfaces:
