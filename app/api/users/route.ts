import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";


export async function POST(request: Request) {

    const body = await request.json();


    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        user_metadata: {
            full_name: body.full_name,
            roleId: body.roleId,
            national_id: body.national_id,
        },
        email_confirm: true,
    });

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });

}