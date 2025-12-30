// app/types.ts

//interface (객체의 뼈대 정의)
export interface Candidate {
    id: number;
    name: string;
    partyPath: string[];
    currentParty: string;
    initialHint: string;
}