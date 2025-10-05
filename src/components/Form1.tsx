import { useForm } from "react-hook-form";

import type { SubmitHandler } from 'react-hook-form';

type Inputs = {
    firstName: string,
    lastName: string,
};

export default function Form1() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = data => {
        console.log(data);
    }

    console.log(watch()) // watch input value by passing the name of it

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <div>
                <input {...register("firstName")} />
            </div>
            <p>
                {errors?.firstName?.message}
            </p>
            <br />
            {/* include validation with required or other standard HTML validation rules */}
            <input {...register("lastName", { required: "This is required" })} />
            {/* errors will return when field validation fails  */}
            <p>
                {errors?.lastName?.message}
            </p>

            <input type="submit" />
        </form>
    );
}
