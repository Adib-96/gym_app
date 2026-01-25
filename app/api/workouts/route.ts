import fetchExercises from "@/lib/exercise-service";
import { NextResponse } from "next/server";



// in future add pagination, filtering, etc. 
// do not fetch from api in the future but from our own db
export async function GET() { 
    try {
        const exercises =  await fetchExercises();
        return NextResponse.json(exercises);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }   
}
