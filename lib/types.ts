export type Loc = { zh: string; mn: string };

export type NoteImage = {
  seed: string;
  width: number;
  height: number;
};

export type ApiComment = {
  id: number;
  text: Loc;
  author: Loc;
  avatarSeed: string;
  likes: number;
  timeAgo: Loc;
  createdAt: string;
};

export type NoteListItem = {
  id: string;
  title: Loc;
  description: Loc;
  category: string;
  cover: NoteImage;
  author: {
    id: string;
    name: Loc;
    avatarSeed: string;
    followers: string;
  };
  likes: number;
  collects: number;
  commentsCount: number;
  postedAt: string;
  location?: Loc;
  tags: Loc[];
};

export type Note = NoteListItem & {
  images: NoteImage[];
  tags: Loc[];
  comments: ApiComment[];
  liked?: boolean;
  followed?: boolean;
};

export type SessionUser = {
  id: string;
  displayName: Loc;
  avatarSeed: string;
  followersText: string;
  isAuthor: boolean;
};
