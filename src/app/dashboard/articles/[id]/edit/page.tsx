import EditArticlePage from '@/components/articles/edit-articles-page'
import { db } from '@/db'
import { articles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

type Props = {
    params: Promise<{ id: string }>
}

const page = async ({ params }: Props) => {
    const id = (await params).id
    const article = await db.query.articles.findFirst({
        where: eq(articles.id, id)
    });

    if (!article) {
        return <h1>Article not found.</h1>
    }

    return (
        <div>
            <EditArticlePage article={article} />
        </div>
    )
}

export default page