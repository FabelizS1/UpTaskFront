import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

export async function updateProfile(formData: UserProfileForm) {
    try {
        console.log("updateProfile...")
        const { data } = await api.put<string>('/auth/profile', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function changePassword(formData: UpdateCurrentUserPasswordForm) {
    try {
        console.log("changePassword...")
        console.log("formData-current_password: ", formData.current_password)
        console.log("formData-password: ", formData.password)
        console.log("formData-password_confirmation: ", formData.password_confirmation)

        const { data } = await api.post<string>('/auth/update-password', formData)
        console.log("data: ", data)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            console.log("error.response: ", error.response)
            throw new Error(error.response.data.error)
        }
    }
}