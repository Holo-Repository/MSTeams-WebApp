// custom file type
export interface aFile extends Blob {
     readonly name: string;
     readonly size: number;
     readonly type: string;
     readonly id?: string;
}







