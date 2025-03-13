
import { NextResponse } from 'next/server';
import { apiRoot } from '../../lib/commercetools'; // Adjust the path as needed

export async function POST(request: Request) {
    try {
        const { anonymousId } = await request.json();
        const projectKey = process.env.CTP_PROJECT_KEY || "";

        console.log("Creating anonymous cart custom object:", { anonymousId });

        const createResponse = await apiRoot
            .withProjectKey({ projectKey })
            .customObjects()
            .post({
                body: {
                    container: 'anonymous-carts',
                    key: anonymousId,
                    value: [], // Initialize with an empty array
                },
            })
            .execute();

        console.log("Anonymous cart custom object created:", createResponse);
        return NextResponse.json({ message: 'Anonymous cart created' });
    } catch (error) {
        console.error("Error creating anonymous cart:", error);
        return NextResponse.json({ error: 'Failed to create anonymous cart' }, { status: 500 });
    }
}