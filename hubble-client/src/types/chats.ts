


export interface chats{
        id: string;
        messages: {
            to:string,
            from:string,
            message:string
        }[];
        for: string[];
        createdAt: Date | null;
        updatedAt: Date | null;
    }
