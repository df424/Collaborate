
export class ColabObject {
    content: string;
    in_use: boolean;
    objectId: string;
    inUseByMe: boolean;

    constructor(content: string, in_use: boolean, objectID?: string)
    {
        this.content = content;
        this.in_use = in_use;
        this.objectId = objectID;
    }
}