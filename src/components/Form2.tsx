import { useForm, } from "react-hook-form"

import type { SubmitHandler } from "react-hook-form";

type GenderEnum = "female" | "male" | "other";

interface IFormInput {
    firstName: string
    gender: GenderEnum
}


export default function Form2() {
    const { register, handleSubmit } = useForm<IFormInput>()
    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>First Name</label>
            <input {...register("firstName")} />
            <label>Gender Selection</label>
            <select {...register("gender")}>
                <option value="female">female</option>
                <option value="male">male</option>
                <option value="other">other</option>
            </select>
            <input type="submit" />
        </form>
    )
}
