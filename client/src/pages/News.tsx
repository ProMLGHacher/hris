import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { New, getNews } from "../shared/api"

export const News = () => {

    const [news, setNews] = useState<New[]>([])

    useEffect(() => {
        getNews().then(e => {
            setNews(e)
        })
    }, [])

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-[1444px] px-6 lg:px-8">
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {news?.map((post) => (
                        <article key={post.id} className="flex max-w-xl flex-col items-start justify-between bg-slate-50 p-6 rounded-2xl">
                            <div className="flex items-center gap-x-4 text-xs">
                                <time dateTime={post.date.toLocaleDateString('ru')} className="text-gray-500">
                                    {post.date.toLocaleDateString('ru')}
                                </time>
                                <Link
                                    to={''}
                                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    {post.category}
                                </Link>
                            </div>
                            <div className="group relative w-full">
                                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                    <a href={post.href}>
                                        <span className="absolute inset-0" />
                                        {post.title}
                                    </a>
                                </h3>
                                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 text-wrap">{post.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}