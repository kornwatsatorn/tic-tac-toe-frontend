"use client"

import { Button, Card, Form } from "react-bootstrap"
import Styles from "./style.module.css"
import classNames from "classnames"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ILoginSchema, LoginSchema } from "./login.zod"
import { useTranslation } from "react-i18next"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"
import { useState } from "react"
import { getErrorResponseOnCatch } from "@/utils"
import ToastWrapper from "@/components/ToastWrapper"

const LoginPage = () => {
  // import
  const { t } = useTranslation()
  const router = useRouter()
  const { setLoading } = useLoading()

  // variable
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginSchema>({
    resolver: zodResolver(LoginSchema),
    criteriaMode: "all",
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      email: "demo1@gmail.com",
      password: "demo",
    },
  })
  const [isShow, setIsShow] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // methods
  const onSubmit = async (data: ILoginSchema) => {
    try {
      setLoading(true)

      const result = await signIn("app", {
        ...data,
        redirect: true,
      })
      if (result && result.error) {
        throw new Error(result.error)
      } else if (!result?.ok) {
        throw new Error(
          "Login failed. Please check your credentials and try again."
        )
      }
      // router.push("/")
    } catch (error: any) {
      setErrorMessage(getErrorResponseOnCatch(error))
      setIsShow(true)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center height-same-outer">
        <Card className={classNames(Styles.login, "rounded-lg")}>
          <Card.Header className="text-center">{t("button.login")}</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>{t("label.email")}</Form.Label>
                <Form.Control
                  type="email"
                  isInvalid={!!errors.email}
                  {...register("email")}
                  placeholder={t("label.pleaseFill")}
                />
                {errors.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>{t("label.password")}</Form.Label>
                <Form.Control
                  type="password"
                  isInvalid={!!errors.password}
                  {...register("password")}
                  placeholder={t("label.pleaseFill")}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Button variant="primary" type="submit" className="form-control">
                {t("button.login")}
              </Button>
              <hr />
              <Button
                variant="secondary"
                type="button"
                className="form-control"
                onClick={() => router.push("/register")}
              >
                {t("button.register")}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <ToastWrapper
        message={<>{errorMessage}</>}
        isShow={isShow}
        setIsShow={setIsShow}
      />
    </>
  )
}
export default LoginPage
