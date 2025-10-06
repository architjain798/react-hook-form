import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import type { SubmitHandler } from "react-hook-form";

type Inputs = {
    firstName: string;
    lastName: string;
    age: number;
};

export default function Form1() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const renderCount = useRef(0);

    renderCount.current += 1;

    useEffect(() => {
        console.log(`Render count: ${renderCount.current}`);
    }, [renderCount.current]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    console.log(watch()); // watch input value by passing the name of it

    // console.log(watch(["firstName","lastName"]));

    // console.log(watch('firstName','archit')); // firstName, and default value

    // useEffect(() => {
    //     const subsription = watch((data) => {
    //         console.log(data);
    //     });

    //     return () => {
    //         subsription.unsubscribe();
    //     };
    // }, [watch]);


    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={handleSubmit(onSubmit)}>

            <div>
                FirstName:{" "}
                <input
                    {...register("firstName", {
                        required: {
                            message: "first name is required",
                            value: true,
                        },
                        validate: (value) => {
                            return value == "archit";
                        },
                    })}
                />
            </div>
            <p>{errors?.firstName?.message}</p>

            LastName:{" "}
            <input {...register("lastName", { required: "This is required" })} />
            <p>{errors?.lastName?.message}</p>

            <label htmlFor="user-age">
                Age:{" "}
                <input
                    id="user-age"
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                />
            </label>
            <p>{errors?.age?.message}</p>


            <input type="submit" />
        </form>
    );
}
