/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorMessage } from "@hookform/error-message";
import * as EmailValidator from "email-validator";
import {
  Alert,
  Button,
  Card,
  Label,
  Spinner,
  TextInput,
  useTheme,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { SelectGroupModal } from "../../components/SelectGroupModal";
import { AlertContext } from "../../context/AlertContext";
import { getRowByColumn } from "../../server/supabaseQueries";
import { checkingAuth } from "../../store/auth/thunks";
import { AppDispatch } from "../../store/store";
import { resetPasswordByEmail } from "../users/data/UsersProvider";

export default function SignInPage() {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const [hasError, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { openAlert } = useContext(AlertContext);

  const [sendEmailStatus, setSendEmailStatus] = useState<
    "idle" | "pending" | "success" | "error" | "incorrect" | "notFound"
  >("idle");
  const [emailCorrectFormat, setEmailCorrectFormat] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const [isOpenGroupsModal, setIsOpenGroupsModal] = useState(false);
  const [userLogged, setUserLogged] = useState<any>(null);

  const { register, formState } = useForm({
    values: undefined,
    mode: "all",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;

  useEffect(() => {
    if (sendEmailStatus === "success") {
      openAlert(t("EMAIL_SEND"), "insert");
    } else if (sendEmailStatus === "error") {
      openAlert(t("EMAIL_SEND_ERROR"), "error");
    } else if (sendEmailStatus === "incorrect") {
      openAlert(t("EMAIL_FORMAT_ERROR"), "error");
    } else if (sendEmailStatus === "notFound") {
      openAlert(t("FORM_ERROR_INCORRECT_EMAIL"), "error");
    }
  }, [sendEmailStatus]);

  useEffect(() => {
    setEmailCorrectFormat(EmailValidator.validate(email));
  }, [email]);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setError(false);
    setLoading(true);

    const result = await dispatch(checkingAuth(email, password));
    console.log('result',result)
    if (result.payload?.error) {
      setLoading(false);
      return setError(true);
    }
    if (result.payload.user) {
      setUserLogged(result.payload.user);
      setIsOpenGroupsModal(true);
    }
    /* setTimeout(() => {
      setLoading(false);
      navigate("/");
      return;
    }, 1000); */
  };

  const sendEmailChangePass = async () => {
    try {
      if (!emailCorrectFormat) {
        setSendEmailStatus("incorrect");
        return;
      }
      setSendEmailStatus("pending");
      const user = await getRowByColumn("email", email, "users");
      if (user[0]) {
        await resetPasswordByEmail(email);
        setSendEmailStatus("success");
      } else {
        setSendEmailStatus("notFound");
      }
    } catch (error) {
      setSendEmailStatus("error");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
        <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
          <img
            alt="Aymo logo"
            src={
              isDarkMode
                ? "/images/logos/AYMO_Logo_RGB_negativo_A.svg"
                : "/images/logos/AYMO_Logo_RGB_positivo.svg"
            }
            className="mr-3 h-32"
          />
        </a>
        <Card
          horizontal
          imgSrc="/images/authentication/login.jpg"
          imgAlt=""
          className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
        >
          <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
            {t("ADMINISTRATION_TITLE")}
          </h1>
          {hasError ? (
            <Alert color="failure" rounded>
              <span>
                <p>
                  <span className="font-medium pr-2">{t("LOGIN_ERROR")}</span>
                  {t("INVALID_CREDENTIALS")}
                </p>
              </span>
            </Alert>
          ) : (
            <></>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4 flex flex-col gap-y-3">
              <Label htmlFor="email">{t("EMAIL")}</Label>
              <TextInput
                id="email"
                placeholder="nombre@tuayuntamiento.es"
                type="email"
                {...register("email", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                  validate: (value) => {
                    if (value != "" && !EmailValidator.validate(value!))
                      return t("FORM_ERROR_MSG_FORMAT");
                  },
                })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                color={errors.email && "failure"}
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p
                      className="mt-2 text-sm text-red-600 dark:text-red-500"
                      key={type}
                    >
                      {message}
                    </p>
                  ))
                }
              />
            </div>
            <div className="mb-6 flex flex-col gap-y-3">
              <Label htmlFor="password">{t("PASSWORD")}</Label>
              <TextInput
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                color={errors.password && "failure"}
              />
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p
                      className="mt-2 text-sm text-red-600 dark:text-red-500"
                      key={type}
                    >
                      {message}
                    </p>
                  ))
                }
              />
            </div>
            <div className="mb-6 flex items-center justify-between">
              {loading ? (
                <Button disabled color="primary" className="w-full lg:w-auto">
                  <Spinner aria-label="loading" size="sm" className="mr-2" />
                  {t("LOADING")}
                </Button>
              ) : (
                <Button
                  color="primary"
                  type="submit"
                  className="w-full lg:w-auto"
                >
                  {t("LOGIN")}
                </Button>
              )}
              <a
                href="#"
                className="w-1/2 text-right text-sm text-primary dark:text-white "
                onClick={() => {
                  sendEmailChangePass();
                }}
              >
                {sendEmailStatus === "pending" ? (
                  <Spinner aria-label="loading" size="sm" className="mr-2" />
                ) : (
                  t("PAGE_LOGIN_FORGOT_PASSWORD")
                )}
              </a>
            </div>
          </form>
        </Card>
      </div>

      {isOpenGroupsModal ? (
        <SelectGroupModal
          openModal={isOpenGroupsModal}
          closeModal={() => setIsOpenGroupsModal(false)}
          user={userLogged}
        />
      ) : null}
    </>
  );
}
