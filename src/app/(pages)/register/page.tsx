"use client"

import { Button, Card, Form } from "react-bootstrap"
import Styles from "./style.module.css"
import classNames from "classnames"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IRegisterSchema, RegisterSchema } from "./register.zod"
import { useTranslation } from "react-i18next"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/context/LoadingContext"
import ToastWrapper from "@/components/ToastWrapper"
import { useState } from "react"
import { getErrorResponseOnCatch } from "@/utils"

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
  } = useForm<IRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    criteriaMode: "all",
    mode: "all",
    reValidateMode: "onChange",
  })
  const [isShow, setIsShow] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // methods
  const onSubmit = async (data: IRegisterSchema) => {
    try {
      setLoading(true)

      const result = await signIn("app-register", {
        ...data,
        redirect: false,
      })
      if (result?.error) {
        throw new Error(result?.error)
      } else if (result?.ok) {
        router.push("/")
      }
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
          <Card.Header className="text-center">
            {t("button.register")}
          </Card.Header>
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

              <Form.Group className="mb-3" controlId="formDisplayname">
                <Form.Label>{t("label.displayName")}</Form.Label>
                <Form.Control
                  type="text"
                  isInvalid={!!errors.displayName}
                  {...register("displayName")}
                  placeholder={t("label.pleaseFill")}
                />
                {errors.displayName && (
                  <Form.Control.Feedback type="invalid">
                    {errors.displayName.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Button variant="primary" type="submit" className="form-control">
                {t("button.register")}
              </Button>
              <hr />
              <Button
                variant="secondary"
                type="button"
                className="form-control"
                onClick={() => router.push("/login")}
              >
                {t("button.login")}
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
