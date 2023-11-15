type Film = {
    id : number;
    title : string;
    description : string;
    genres : string[];
    watch : boolean;
}

interface Window {
    dispatch : (eventName: string, detail?: Record<string,any>) => void
}
