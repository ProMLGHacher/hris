import { createAxiosDateTransformer } from "axios-date-transformer";
import { store } from "../redux/store";
import { logOut } from "../redux/slices/authSlice";

export const baseURL = "http://localhost:3000"

export const $api = createAxiosDateTransformer({
    baseURL: baseURL,
    headers: {
        "ngrok-skip-browser-warning" : "69420"
    }
})

$api.interceptors.request.use(
    config => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

$api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status === 403) {
            store.dispatch(logOut())
        }
        return Promise.reject(error);
    }
);

export type New = {
    id: number,
    title: string,
    href: string,
    description: string,
    date: Date,
    category: string,
}

export const getNews = async () => {
    const data = (await $api.get<New[]>('/news')).data
    return data
}

export const createNew = async (newPost: Omit<New, 'date' | 'id'>) => {
    const data = await $api.post('/news', newPost)
    return data.status
}

export type Category = {
    id: number,
    name: string
}

export const getCategories = async () => {
    const data = (await $api.get<Category[]>('/categories')).data
    return data
}

export const createCategories = async (newCategory: Omit<Category, 'id'>) => {
    const data = await $api.post('/categories', newCategory)
    return data.status
}

export type Service = {
    id: number,
    title: string,
    description: string,
    category_id: number,
    price: number,
    image: string
}

export const getServices = async (category_id?: number | undefined) => {
    const data = (await $api.get<Service[]>('/services', {
        params: {
            category: category_id
        }
    })).data
    return data
}

export const createServices = async (newService: {
    title: string,
    description: string,
    category_id: number,
    price: number,
    image: File
}) => {
    const formData = new FormData()
    formData.append('title', newService.title)
    formData.append('description', newService.description)
    formData.append('category_id', `${newService.category_id}`)
    formData.append('price', `${newService.price}`)
    formData.append('image', newService.image)
    const data = await $api.post('/services', formData)
    return data.status
}