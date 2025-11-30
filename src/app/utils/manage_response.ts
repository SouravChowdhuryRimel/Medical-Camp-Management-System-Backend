import { Response } from "express"
interface IResponse<T> {
    success: boolean,
    statusCode: number,
    message: string,
    data?: T,
    meta?: {
        page?: number,
        limit?: number,
        skip?: number,
        total?: number
    }
}

const manageResponse = <T>(res: Response, payload: IResponse<T>) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        data: payload.data || undefined || null,
        meta: payload.meta || undefined || null
    })
}

export default manageResponse