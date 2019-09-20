import React, {useState, useEffect} from "react";
import axios from "axios";
import {Form, Field, withFormik} from "formik";
import * as Yup from "yup";

const UserForm = ({errors, touched, values, status}) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        status && setUsers(users => [...users, status])
    }, [status])

    return (
        <>
        <div>
            <h1>User-Onboarding Form</h1>
            <Form>
                <Field tpye="text" name="name" placeholder="Name"/>
                {touched.name && errors.name && (
                    <p>{errors.name}</p>
                )}

                <Field type="email" name="email" placeholder="Email"/>
                {touched.email && errors.email && <p>{errors.email}</p>}

                <Field type="password" name="password" placeholder="Password"/>
                <label>
                    <span>I have read and agree to the Term of Service.</span>
                <Field type="checkbox" name="terms" checked={values.terms}/>
                {touched.terms && errors.terms && <p>{errors.terms}</p>}
                </label>
                
                <button type="submit">Submit Form</button>
            </Form>
        </div>
        
        <div>
            {users.map(user => (
                <ul key={user.id}>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                    <li>Password: {user.password}</li>
                    <li>Agrees to Terms: {user.terms}</li>
                </ul>
            ))}
        </div>
        </>
    );    
};

const FormikUserForm = withFormik({
    mapPropsToValues({name, email, password, terms}) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            terms: terms || false
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string().required("You must enter your name to continue."),
        email: Yup.string().email("Invalid email!").required("Please enter your email to continue."),
        password: Yup.string().min(8, "Your password must be at least 8 characters!").required("Password is required."),
        
    }),

    handleSubmit(values, {setStatus}) {
        axios.post("https://reqres.in/api/users/", values)
             .then(response => {
                 setStatus(response.data);
                 console.log(response);
             })
             .catch(error => console.log(error.response));
    }

}) (UserForm);

export default FormikUserForm;