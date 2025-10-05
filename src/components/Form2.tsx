import { useForm } from "react-hook-form";

import type { SubmitHandler } from "react-hook-form";

type GenderEnum = "female" | "male" | "other";

interface IFormInput {
    firstName: string;
    gender: GenderEnum;
}

export default function Form2() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

    // console.log({ ...register("firstName") });

    console.log(errors);


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>First Name</label>
            <input
                {...register("firstName", {
                    required: "This is required",
                    maxLength: {
                        value: 20,
                        message: "20 character required"
                    },
                })}
            />
            <div>{errors?.firstName?.message}</div>

            <label>Gender Selection</label>
            <select {...register("gender")}>
                <option value="female">female</option>
                <option value="male">male</option>
                <option value="other">other</option>
            </select>
            <input type="submit" />
        </form>
    );
}
